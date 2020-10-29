import { readdirSync, statSync, readFileSync } from "fs";
import { join } from "path";
import { IDocMenuItem, MarkdownMetadata } from "./interfaces";
import { generateBreadcrumbs, getElementByToIdArray } from "./page.utils";
import { IDocumentationPageProps } from "./pages.interfaces";
import matter from "gray-matter";

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

export function extractMetadataFromDocItem(docItem: IDocMenuItem) {
    // Combine the data with the id and contentHtml
    const metadata: MarkdownMetadata = {
        title: docItem.friendlyName,
        description: `Babylon.js documentation page - ${docItem.friendlyName}`,
        keywords: "babylonjs, babylon.js, webgl, engine," + docItem.friendlyName,
        ...(docItem && docItem.metadataOverrides),
    };

    if (docItem.content) {
        const fullPath = join(markdownDirectory, `${docItem.content}.md`);
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
            };
        }
    }

    return {
        metadata,
        content: "",
    };
}

export function getPageData(id: string[], fullPage?: boolean): IDocumentationPageProps {
    // get fullPath from the configuration
    const docs = getElementByToIdArray(id, !fullPage);
    if (!docs) {
        throw new Error("wrong ids! " + id.join("/"));
    }

    const docItem = docs.doc;

    const childPages = {};

    if (fullPage && docItem.children) {
        Object.keys(docItem.children).forEach((key) => {
            childPages[key] = getPageData([...id, key]);
        });
    }

    const { metadata, content } = extractMetadataFromDocItem(docItem);
    const previous = (fullPage && docs.prev && getPageData(docs.prev.idArray)) || null;
    const next = (fullPage && docs.next && getPageData(docs.next.idArray)) || null;

    const breadcrumbs = generateBreadcrumbs(id);

    // prev and next!

    return {
        id,
        breadcrumbs,
        childPages,
        metadata,
        content,
        previous,
        next
    };
}