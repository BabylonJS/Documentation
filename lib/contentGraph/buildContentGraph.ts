import { existsSync, readFileSync, statSync } from "fs";
import { join } from "path";

import { parseMarkdownFrontmatter } from "../markdown/frontmatter";
import { IDocMenuItem, MarkdownMetadata } from "../interfaces";
import { documentationStructure } from "./loadStructure";
import { ContentGraph, ContentGraphExampleReference, ContentGraphPage, ContentGraphRouteParams } from "./types";

const markdownDirectory = "content";
const gitHubContentBaseUrl = "https://github.com/BabylonJS/Documentation/blob/master/content";

let cachedContentGraph: ContentGraph | undefined;

const routeFromId = (id: string[]) => `/${id.join("/")}`;

const normalizeFrontmatterKey = (key: string) => {
    const splits = key.split("-");
    return splits
        .map((part, index) => {
            if (index === 0) {
                return part.toLowerCase();
            }
            return `${part[0].toUpperCase()}${part.substr(1).toLowerCase()}`;
        })
        .join("");
};

const buildDefaultMetadata = (docItem: IDocMenuItem): MarkdownMetadata => ({
    title: docItem.friendlyName,
    description: `Documentation page for ${docItem.friendlyName}`,
    keywords: `babylonjs, babylon.js, webgl, engine,${docItem.friendlyName}`,
    ...(docItem.metadataOverrides || {}),
});

const applyFrontmatter = (metadata: MarkdownMetadata, frontmatter: Record<string, unknown>) => {
    Object.keys(frontmatter).forEach((key) => {
        (metadata as unknown as Record<string, unknown>)[normalizeFrontmatterKey(key)] = frontmatter[key];
    });
};

const deriveImageUrl = (metadata: MarkdownMetadata, rawMarkdown: string) => {
    if (metadata.imageUrl) {
        return;
    }

    const imageUrl = (rawMarkdown.match(/\((\/img\/.+?)\)/) || [])[1];
    if (imageUrl) {
        metadata.imageUrl = imageUrl.split("!")[0];
        return;
    }

    const playgrounds = rawMarkdown.match(/<Playground (.*)\/>/gm) || [];
    if (playgrounds[1]) {
        const playground = playgrounds[1];
        const imagePosition = playground.indexOf('image="');
        if (imagePosition !== -1 && playground.substr(imagePosition + 7).split('"')[0]) {
            metadata.imageUrl = playground.substr(imagePosition + 7).split('"')[0];
        } else {
            const idPosition = playground.indexOf('id="');
            const imageId = playground.substr(idPosition + 4).split('"')[0];
            metadata.imageUrl = `/img/playgroundsAndNMEs/pg${imageId.replace(/#/g, "-")}.webp`;
        }
    }
};

const extractInternalLinks = (rawMarkdown: string) => {
    return Array.from(rawMarkdown.matchAll(/]\(\/(.*?)\)/g))
        .map((match) => match[1].replace(/\)/g, "").split("#")[0].split(" ")[0])
        .filter((link) => link.indexOf(".") === -1 && link.indexOf("/typedoc") === -1 && link.indexOf("/packages") === -1);
};

const getStringProp = (source: string, prop: string) => {
    const match = new RegExp(`${prop}="(.*?)"`).exec(source);
    return match ? match[1] : undefined;
};

const extractExampleReferences = (rawMarkdown: string): ContentGraphExampleReference[] => {
    const matches = Array.from(rawMarkdown.matchAll(/(<(Playground|nme|nge|NME|NGE|NRGE|nrge|SFE|sfe).*id="([A-Za-z0-9#]*)".*\/>)/g));

    return matches.map(([, full, type, id]) => {
        const typePlayground = type === "Playground" ? "pg" : type.toLowerCase();
        return {
            type: typePlayground as ContentGraphExampleReference["type"],
            id,
            imageUrl: getStringProp(full, "image"),
            engine: getStringProp(full, "engine") as ContentGraphExampleReference["engine"],
            snapshot: getStringProp(full, "snapshot"),
            title: getStringProp(full, "title"),
            description: getStringProp(full, "description"),
            category: getStringProp(full, "category"),
            isMain: /isMain={true}/.test(full),
        };
    });
};

const generateBreadcrumbs = (id: string[], root: IDocMenuItem) => {
    let currentChildren = root.children || {};
    return id.map((item, index) => {
        const child = currentChildren[item];
        currentChildren = child.children || {};
        return {
            name: child.friendlyName,
            url: `/${id.slice(0, index + 1).join("/")}`,
        };
    });
};

const flattenStructure = (root: IDocMenuItem) => {
    const items: Array<IDocMenuItem & { idArray: string[] }> = [{ ...root, idArray: [] }];

    const traverseChildren = (previousKeys: string[], children: { [key: string]: IDocMenuItem }) => {
        Object.keys(children).forEach((key) => {
            const idArray = [...previousKeys, key];
            const child = children[key];
            items.push({ ...child, idArray });
            if (child.children) {
                traverseChildren(idArray, child.children);
            }
        });
    };

    traverseChildren([], root.children || {});
    return items;
};

const readPageMarkdown = (docItem: IDocMenuItem) => {
    if (!docItem.content) {
        return {
            rawMarkdown: "",
            content: "",
            frontmatter: {} as Record<string, unknown>,
            sourcePath: undefined,
            lastModified: undefined,
        };
    }

    const sourcePath = join(markdownDirectory, `${docItem.content}.md`);
    if (!existsSync(sourcePath)) {
        throw new Error(`Content file not found: ${sourcePath}`);
    }

    const rawMarkdown = readFileSync(sourcePath, "utf8");
    const { content, frontmatter } = parseMarkdownFrontmatter(rawMarkdown);

    return {
        rawMarkdown,
        content,
        frontmatter,
        sourcePath,
        lastModified: statSync(sourcePath).mtime,
    };
};

const createPage = (item: IDocMenuItem & { idArray: string[] }, index: number, items: Array<IDocMenuItem & { idArray: string[] }>, root: IDocMenuItem): ContentGraphPage => {
    const { rawMarkdown, content, frontmatter, sourcePath, lastModified } = readPageMarkdown(item);
    const metadata = buildDefaultMetadata(item);
    applyFrontmatter(metadata, frontmatter);
    deriveImageUrl(metadata, rawMarkdown);

    return {
        id: item.idArray,
        route: routeFromId(item.idArray),
        docItem: item,
        contentPath: item.content,
        sourcePath,
        rawContent: content,
        frontmatter,
        metadata,
        breadcrumbs: generateBreadcrumbs(item.idArray, root),
        childIds: Object.keys(item.children || {}).map((key) => [...item.idArray, key]),
        previousId: index > 0 ? items[index - 1].idArray : undefined,
        nextId: index < items.length - 1 ? items[index + 1].idArray : undefined,
        furtherReading: metadata.furtherReading,
        internalLinks: extractInternalLinks(content),
        examples: extractExampleReferences(content),
        lastModified,
        gitHubUrl: item.content ? `${gitHubContentBaseUrl}/${item.content}.md` : undefined,
    };
};

const createRouteManifest = (pages: ContentGraphPage[]): ContentGraphRouteParams[] => {
    return pages
        .filter((page) => page.id.length === 0 || !!page.contentPath)
        .map((page) => ({
            params: {
                id: page.id,
                content: page.contentPath,
            },
        }));
};

export const buildContentGraph = (root: IDocMenuItem = documentationStructure): ContentGraph => {
    const items = flattenStructure(root);
    const pages = items.map((item, index) => createPage(item, index, items, root));
    const pagesByRoute: Record<string, ContentGraphPage> = {};
    const pagesByContentPath: Record<string, ContentGraphPage[]> = {};

    pages.forEach((page) => {
        pagesByRoute[page.route] = page;
        if (page.contentPath) {
            if (!pagesByContentPath[page.contentPath]) {
                pagesByContentPath[page.contentPath] = [];
            }
            pagesByContentPath[page.contentPath].push(page);
        }
    });

    return {
        pages,
        pagesByRoute,
        pagesByContentPath,
        routeManifest: createRouteManifest(pages),
    };
};

export const getContentGraph = () => {
    if (!cachedContentGraph) {
        cachedContentGraph = buildContentGraph();
    }
    return cachedContentGraph;
};

export const clearContentGraphCache = () => {
    cachedContentGraph = undefined;
};
