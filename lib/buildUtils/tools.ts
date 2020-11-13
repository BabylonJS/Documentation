import { readdirSync, statSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { IDocMenuItem, MarkdownMetadata } from "../interfaces";

import matter from "gray-matter";
import { generateBreadcrumbs, getElementByIdArray } from "./content.utils";
import { IDocumentationPageProps, IExampleLink } from "../content.interfaces";
import { addSearchItem, addPlaygroundItem } from "./search.utils";
import { addToSitemap } from "./sitemap.utils";

import puppeteer from "puppeteer";
import { getExampleImageUrl, getExampleLink } from "../frontendUtils/frontendTools";

export const markdownDirectory = "content/";

const childPageData = {};

export const getAllFiles = (dirPath: string, arrayOfFiles?: string[], extension = ".md"): string[] => {
    const files = readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

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
                metadata[correctKey] = matterResult.data[key];
            });

            // find the first image in the document (if not already set)
            const imageUrl = (fileContents.match(/\((\/img\/.+)\)/) || [])[1];
            if (imageUrl) {
                metadata.imageUrl = metadata.imageUrl || imageUrl;
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

export const getExampleImagePath = (example: Partial<IExampleLink>) => {
    return join(process.cwd(), "public/img/playgroundsAndNMEs/", `${example.type}${example.id.replace(/#/g, "-")}.png`);
};

export const generateExampleImage = async (type: "pg" | "nme", id: string) => {
    const browser = await puppeteer.launch(); // opens a virtual browser

    try {
        const page = await browser.newPage(); // creates a new page

        await page.setDefaultNavigationTimeout(60000);

        // you can also set dimensions
        await page.setViewport({ width: 1200, height: 800 }); // sets it's  dimensions

        const url = getExampleLink({ type, id });
        await page.goto(url); // navigates to the url
        if (type === "pg") {
            await page.waitForSelector("#renderCanvas", { visible: true });
            await page.waitForFunction(`typeof scene !== 'undefined' && scene.isLoading === false`, { timeout: 60000 });
            await page.waitForSelector("#babylonjsLoadingDiv", { hidden: true, timeout: 60000 });
        } else {
            await page.waitForSelector("#graph-canvas", { visible: true, timeout: 60000 });
        }
        await page.waitForTimeout(500);

        const imageUrl = getExampleImagePath({ type, id });

        await page.screenshot({ path: imageUrl, fullPage: true }); // takes a screenshot
        console.log("screenshot created for", id);
    } catch (e) {
        console.log("error", type, id);
    }
    await browser.close(); // closes the browser.
};

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

    const childPages = {};

    if (fullPage && docItem.children) {
        Object.keys(docItem.children).forEach(async (key) => {
            childPages[key] = await getPageData([...id, key]);
        });
    }

    const { metadata, content, lastModified } = extractMetadataFromDocItem(docItem, fullPage);
    const previous = (await (fullPage && docs.prev && getPageData(docs.prev.idArray))) || null;
    const next = (await (fullPage && docs.next && getPageData(docs.next.idArray))) || null;

    const breadcrumbs = generateBreadcrumbs(id);

    const relatedArticles = {};
    const relatedExternalLinks = [];

    const promises = [];
    if (fullPage && metadata.furtherReading) {
        metadata.furtherReading.forEach((item) => {
            const url = typeof item === "string" ? item : item.url;
            const title = typeof item === "string" ? item : item.title;
            if (!url) {
                throw new Error("Error in md file, maybe used tab instead of space?");
            }
            if (!url.startsWith("http")) {
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
                        () => {
                            console.log("Error - url not found:", url);
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

    // Search index!
    if (fullPage) {
        const url = "/" + id.join("/");
        // create a buffer
        const buff = Buffer.from(url, "utf-8");
        const searchId = buff.toString("base64");
        // TODO - check for errors
        try {
            await addSearchItem({
                id: searchId,
                categories: breadcrumbs.map((bc) => bc.name),
                path: url,
                isApi: false,
                content: content,
                keywords: metadata.keywords.split(","),
                description: metadata.description,
                title: metadata.title,
                imageUrl: metadata.imageUrl,
                videoLink: metadata.videoOverview,
                lastModified: lastModified,
            });
        } catch (e) {
            console.log("Error indexing item. Probably an index error.");
        }

        addToSitemap(metadata.title, url, lastModified ? lastModified.toISOString() : "");

        // generate images to examples. Offline only at the moment
        const matches = Array.from(content.matchAll(/(<(Playground|nme).*id="([A-Za-z0-9#]*)".*\/>)/g));
        for (const [all, full, type, exampleId] of matches) {
            const realType = type === "nme" ? "nme" : "pg";
            const imageUrl = /image="(.*)"/.test(full) && /image="(.*)"/.exec(full)[1];
            if (!process.env.ONLINE && !imageUrl && !existsSync(getExampleImagePath({ id: exampleId, type: realType }))) {
                await generateExampleImage(realType, exampleId);
            }
            if (realType === "pg") {
                const title = (/title="(.*)"/.test(full) && /title="(.*)"/.exec(full)[1].split('"')[0]) || `Playground for ${metadata.title}`;
                const description = (/description="(.*)"/.test(full) && /description="(.*)"/.exec(full)[1].split('"')[0]) || "";
                const playgroundId = exampleId[0] === "#" ? exampleId.substr(1) : exampleId;
                const buff = Buffer.from(playgroundId, "utf-8");
                const searchId = buff.toString("base64");
                if (searchId) {
                    try {
                        await addPlaygroundItem({
                            title,
                            description,
                            id: searchId,
                            playgroundId,
                            keywords: metadata.keywords.split(",").map((item) => item.trim()),
                            imageUrl: imageUrl || getExampleImageUrl({ type: realType, id: exampleId }),
                            documentationPage: url,
                        });
                    } catch (e) {
                        console.log("Error indexing playground. Probably an index error.");
                    }
                }
            }
        }
    }

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
    } as IDocumentationPageProps;

    if (!fullPage) {
        // store this in cache
        childPageData[id.join("-")] = pageProps;
    }

    return pageProps;
}
