import { readdirSync, statSync, readFileSync } from "fs";
import { join } from "path";
import { IDocMenuItem, MarkdownMetadata } from "../interfaces";

import matter from "gray-matter";
import { generateBreadcrumbs, getElementByIdArray } from "./content.utils";
import { IDocumentationPageProps } from "../content.interfaces";
import { addSearchItem } from "./search.utils";

export const markdownDirectory = "content/";

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

export async function getPageData(id: string[], fullPage?: boolean): Promise<IDocumentationPageProps> {
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

    // Search index!
    if (fullPage) {
        const url = "/" + id.join("/");
        // create a buffer
        const buff = Buffer.from(url, "utf-8");
        const searchId = buff.toString("base64");
        // TODO - check for errors
        const res = await addSearchItem({
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
    }

    return {
        id,
        breadcrumbs,
        childPages,
        metadata,
        content,
        previous,
        next,
        lastModified: lastModified ? lastModified.toUTCString() : '',
    };
}
