import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import matter from "gray-matter";
import * as path from "path";
import { sep } from "path";

export const markdownDirectory = "content/";

// very temporary structure configuration
import structure from "../configuration/structure.json";
import { MarkdownMetadata } from "./interfaces";

export const getAllDocumentationIds = () => {
    const filenames = getAllFiles(markdownDirectory);
    const fileMap = filenames.map((fileName) => {
        return {
            params: {
                id: fileName
                    .replace(/content\\/g, "")
                    .replace(/\.md$/, "")
                    .split("\\"),
            },
        };
    });
    return fileMap;
};

export function extractMetadataFromMarkdown(fileContents: string, fullPath?: string) {
    const matterResult = matter(fileContents);

    // const parsed = await parseMDFile(matterResult.content);

    // Combine the data with the id and contentHtml
    const metadata: MarkdownMetadata = {
        title: "",
        description: fullPath || "Babylon.js documentation page description",
        keywords: "babylonjs, babylon.js, webgl, engine",
    };
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

    // find the first image in the document

    const imageUrl = (fileContents.match(/\((\/img\/.+)\)/) || [])[1];
    if (imageUrl) {
        metadata.imageUrl = metadata.imageUrl || imageUrl;
    }

    return {
        content: matterResult.content,
        metadata,
    };
}

export async function getPageData(id: string[]) {
    try {
        const fullPath = path.join(markdownDirectory, `${id.join(sep)}.md`);
        const fileContents = readFileSync(fullPath, "utf8");

        const parsed = extractMetadataFromMarkdown(fileContents, fullPath);

        return {
            id,
            content: parsed.content,
            metadata: parsed.metadata,
            isBucket: false,
        };
    } catch (e) {
        // find the right container in config
        let parent = structure;
        let lastKey = "";
        id.forEach((key) => {
            parent = parent[key];
            lastKey = key;
        });

        const metadata: MarkdownMetadata = {
            title: `${lastKey} section`,
            description: `${lastKey} section of the documentation page`,
            keywords: `${id.join(",")}`,
        };

        // augment the child pages if it has strings
        // TODO - this is not needed after the configuration file was finalized
        const childPages = {};

        Object.keys(parent).forEach((key) => {
            if (typeof parent[key] === "string") {
                // an .md file
                const fullPath = path.join(markdownDirectory, `${parent[key]}`);
                const fileContents = readFileSync(fullPath, "utf8");
                const parsed = extractMetadataFromMarkdown(fileContents);
                childPages[key] = {
                    isBucket: false,
                    link: parent[key],
                    metadata: parsed.metadata,
                };
            } else {
                childPages[key] = {
                    link: `${id.join("/")}/${key}`,
                    metadata: {
                        title: key,
                        description: `Section - ${key}`,
                    },
                };
            }
        });

        return {
            id,
            metadata,
            isBucket: true,
            childPages,
        };
    }
}
// Process

export const getAllFiles = (dirPath: string, arrayOfFiles?: string[]): string[] => {
    const files = readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, "/", file);
        if (statSync(fullPath).isDirectory()) {
            arrayOfFiles.push(fullPath);
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (file.endsWith(".md")) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
};
