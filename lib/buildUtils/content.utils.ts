import { IDocMenuItem, MarkdownMetadata } from "../interfaces";

// very temporary structure configuration
import structure from "../../configuration/structure.json";
import { IMenuItem } from "../content.interfaces";
import { IDocumentationPageProps } from "../../components/DocumentPage";
import { getAllFiles, markdownDirectory } from "./tools";
import { join } from "path";
import { readFileSync } from "fs";
import matter from "gray-matter";

// cast for general usage
export const config: IDocMenuItem = structure;

export const docItems: Array<IDocMenuItem & { idArray: string[] }> = [];

export const populateDocItemsArray = () => {
    if (docItems.length) {
        return;
    }
    function traverseChildren(prevKeys: string[], childrenObject: { [key: string]: IDocMenuItem }) {
        Object.keys(childrenObject).forEach((key) => {
            docItems.push({ ...childrenObject[key], idArray: [...prevKeys, key] });
            if (childrenObject[key].children) {
                traverseChildren([...prevKeys, key], childrenObject[key].children);
            }
        });
    }

    traverseChildren([], config.children);
};

export const getAvailableUrls = (): { params: { id: string[]; content?: string } }[] => {
    const array = [];

    function traverseChildren(prevKeys: string[], childrenObject: { [key: string]: IDocMenuItem }) {
        Object.keys(childrenObject).forEach((key) => {
            array.push({
                params: {
                    id: [...prevKeys, key],
                    content: childrenObject.content
                },
            });
            if (childrenObject[key].children) {
                traverseChildren([...prevKeys, key], childrenObject[key].children);
            }
        });
    }

    traverseChildren([], config.children);

    return array;
};

export const checkUnusedFiles = (contentArray: { params: { id: string[]; content?: string } }[]) => {
    const allMarkdownFiles = getAllFiles(markdownDirectory);
    console.log(allMarkdownFiles[0], allMarkdownFiles[1]);
};

export const generateBreadcrumbs = (ids: string[]) => {
    let currentChildren = config.children;
    return ids.map((id, idx) => {
        const { friendlyName } = currentChildren[id];
        currentChildren = currentChildren[id].children;
        return {
            name: friendlyName,
            url: `/${ids.slice(0, idx + 1).join("/")}`,
        };
    });
};

export const getElementByIdArray = (ids: string[], skipPrevNext: boolean): { doc: IDocMenuItem; prev?: IDocMenuItem & { idArray: string[] }; next?: IDocMenuItem & { idArray: string[] } } | undefined => {
    populateDocItemsArray();
    const found = docItems.findIndex(({ idArray }) => ids.length === idArray.length && ids.every((value, index) => value === idArray[index]));
    if (found !== -1) {
        const prev = skipPrevNext || found === 0 ? undefined : docItems[found - 1];
        const next = skipPrevNext || found === docItems.length - 1 ? undefined : docItems[found + 1];
        return {
            doc: docItems[found],
            prev,
            next,
        };
    }
};

export const generateMenuStructure = (docMenuItem: IDocMenuItem = config): IMenuItem[] => {
    const array: IMenuItem[] = [];

    function traverseChildren(itemsArray: IMenuItem[], prevKeys: string[], childrenObject: { [key: string]: IDocMenuItem }) {
        Object.keys(childrenObject).forEach((key) => {
            const menuItem = {
                name: childrenObject[key].friendlyName,
                url: `/${[...prevKeys, key].join("/")}`,
                children: [],
            };
            itemsArray.push(menuItem);
            if (childrenObject[key].children) {
                traverseChildren(menuItem.children, [...prevKeys, key], childrenObject[key].children);
            }
        });
    }

    traverseChildren(array, [], docMenuItem.children || {});

    return array;
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
    const docs = getElementByIdArray(id, !fullPage);
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
        next,
    };
}
