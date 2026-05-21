import { readdirSync, statSync, readFileSync } from "fs";
import { join } from "path";
import { IDocMenuItem, MarkdownMetadata } from "../interfaces";

import matter from "gray-matter";
import { generateBreadcrumbs, getElementByIdArray } from "./content.utils";
import { IDocumentationPageProps } from "../content.interfaces";

export const markdownDirectory = "content/";

import vercelConfig from "../../redirects.json";

const childPageData: Record<string, IDocumentationPageProps> = {};

export const getAllFiles = (dirPath: string, arrayOfFiles: string[] = [], extension = ".md"): string[] => {
    const files = readdirSync(dirPath);

    files.forEach(function (file) {
        const fullPath = join(dirPath, "/", file);
        if (statSync(fullPath).isDirectory()) {
            // arrayOfFiles.push(fullPath);
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles, extension);
        } else {
            if (!extension) {
                arrayOfFiles.push(fullPath);
            }
            if (extension && file.endsWith(extension)) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
};

export const getLastModified = (relativePath: string) => {
    const fullPath = join(markdownDirectory, `${relativePath}.md`);
    const stat = statSync(fullPath);
    return stat.mtime;
};

export function extractMetadataFromDocItem(docItem: IDocMenuItem, fullPage: boolean = false) {
    // Combine the data with the id and contentHtml
    const metadata: MarkdownMetadata = {
        title: docItem.friendlyName,
        description: `Documentation page for ${docItem.friendlyName}`,
        keywords: "babylonjs, babylon.js, webgl, engine," + docItem.friendlyName,
        ...(docItem && docItem.metadataOverrides),
    };

    if (docItem.content) {
        const fullPath = join(markdownDirectory, `${docItem.content}.md`);
        const stat = statSync(fullPath);
        const fileContents = readFileSync(fullPath, "utf8");
        if (fileContents) {
            const matterResult = matter(fileContents);
            Object.keys(matterResult.data).forEach((key) => {
                const splits = key.split("-");
                const correctKey = splits
                    .map((s, idx) => {
                        if (idx !== 0) {
                            return `${s[0].toUpperCase()}${s.substr(1).toLowerCase()}`;
                        } else {
                            return s.toLowerCase();
                        }
                    })
                    .join("");
                (metadata as any)[correctKey] = matterResult.data[key];
            });

            // find the first image in the document (if not already set)
            if (!metadata.imageUrl) {
                const imageUrl = (fileContents.match(/\((\/img\/.+?)\)/) || [])[1];
                if (imageUrl) {
                    metadata.imageUrl = imageUrl.split("!")[0]; // remove the image size
                } else {
                    // find a playground
                    const playgrounds = fileContents.match(/<Playground (.*)\/>/gm) || [];
                    if (playgrounds[1]) {
                        // take the playground image
                        const pg = playgrounds[1];
                        const imagePosition = pg.indexOf('image="');
                        if (imagePosition !== -1 && pg.substr(imagePosition + 7).split('"')[0]) {
                            // find the image url
                            // pos + 'image="'.length
                            metadata.imageUrl = pg.substr(imagePosition + 7).split('"')[0];
                        } else {
                            const idPos = pg.indexOf('id="');
                            const imgId = pg.substr(idPos + 4).split('"')[0];
                            metadata.imageUrl = `/img/playgroundsAndNMEs/pg${imgId.replace(/#/g, "-")}.png`;
                        }
                    }
                }
            }
            return {
                content: matterResult.content,
                metadata,
                lastModified: stat.mtime,
            };
        }
    }

    return {
        metadata,
        content: "",
    };
}

export async function getPageData(id: string[], fullPage?: boolean): Promise<IDocumentationPageProps> {
    if (!fullPage && childPageData[id.join("-")]) {
        return childPageData[id.join("-")];
    }

    // get fullPath from the configuration
    const docs = getElementByIdArray(id, !fullPage);
    if (!docs) {
        throw new Error("wrong ids! " + id.join("/"));
    }

    const docItem = docs.doc;

    const childPages: Record<string, IDocumentationPageProps> = {};

    if (fullPage && docItem.children) {
        Object.keys(docItem.children).forEach(async (key) => {
            childPages[key] = await getPageData([...id, key]);
        });
    }

    const { metadata, content, lastModified } = extractMetadataFromDocItem(docItem, fullPage);
    const previous = (await (fullPage && docs.prev && getPageData(docs.prev.idArray))) || null;
    const next = (await (fullPage && docs.next && getPageData(docs.next.idArray))) || null;

    const breadcrumbs = generateBreadcrumbs(id);

    const relatedArticles: Record<string, IDocumentationPageProps> = {};
    const relatedExternalLinks: { url: string; title: string }[] = [];

    const promises: Promise<any>[] = [];
    if (fullPage && metadata.furtherReading) {
        metadata.furtherReading.forEach((item) => {
            const url = typeof item === "string" ? item : item.url;
            const title = typeof item === "string" ? item : item.title;
            if (!url) {
                throw new Error("Error in md file, maybe used tab instead of space?");
            }
            if (!url.startsWith("http") && !url.startsWith("/typedoc") && !url.startsWith("/packages")) {
                const idArray = url.split("/");
                if (idArray[0] === "") {
                    idArray.shift();
                }
                const lastId = idArray[idArray.length - 1];
                promises.push(
                    getPageData(idArray, false).then(
                        (data) => {
                            return (relatedArticles[lastId] = data);
                        },
                        (e) => {
                            console.log("Error - url not found:", url);
                            throw e;
                        },
                    ),
                );
                // console.log('pushed');
            } else {
                relatedExternalLinks.push({
                    url,
                    title,
                });
            }
        });
    }

    await Promise.all(promises);

    if (!metadata.imageUrl) {
        // no image? check children.
        const childrenKeys = Object.keys(childPages);
        childrenKeys.some((childKey) => {
            if (childPages[childKey].metadata && childPages[childKey].metadata.imageUrl) {
                metadata.imageUrl = childPages[childKey].metadata.imageUrl;
                return true;
            }
        });
    }

    if (fullPage) {
        // search for internal links
        try {
            // stay safe, catch all errors here.
            const internalLinks = Array.from(content.matchAll(/]\(\/(.*?)\)/g))
                .map((res) => {
                    return res[1].replace(/\)/g, "").split("#")[0].split(" ")[0];
                })
                .filter((link) => link.indexOf(".") === -1 && link.indexOf("/typedoc") === -1 && link.indexOf("/packages") === -1);

            internalLinks.forEach((link) => {
                const found = getElementByIdArray(link.split("/"), true);
                if (!found) {
                    // try to find a redirect
                    if (vercelConfig?.redirects) {
                        const redirectFound = vercelConfig.redirects.find((redirect) => {
                            return redirect.source === `/${link}`;
                        });
                        if (redirectFound) {
                            console.log(`Internal link /${link} in doc /${id.join("/")} should be ${redirectFound.destination}`);
                        } else {
                            console.log(`Internal link /${link} not found in doc /${id.join("/")}`);
                            throw new Error(`Internal link /${link} not found in doc /${id.join("/")}`);
                        }
                    }
                }
            });
        } catch (e) {
            console.log("Error checking internal links. Probably an index error.", e);
            throw e;
        }
    }

    const gitHubUrl = `https://github.com/BabylonJS/Documentation/blob/master/content/${docItem.content}.md`;

    const pageProps = {
        id,
        breadcrumbs,
        childPages,
        metadata,
        content,
        previous,
        next,
        relatedArticles,
        relatedExternalLinks,
        lastModified: lastModified ? lastModified.toUTCString() : "",
        gitHubUrl,
        baseUrl: process.env.BASE_URL ?? "",
    } as IDocumentationPageProps;

    if (!fullPage) {
        // store this in cache
        childPageData[id.join("-")] = pageProps;
    }

    return pageProps;
}
