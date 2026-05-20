import type { IPlaygroundSearchItem, ISearchIndexItem } from "../buildUtils/search.utils";
import { getExampleImageUrl } from "../frontendUtils/frontendTools";
import type { ContentGraph, ContentGraphExampleReference, ContentGraphPage } from "./types";

export interface SitemapEntry {
    url: string;
    lastModified?: string;
}

export const contentArtifactsDirectory = ".temp/content";
export const apiSearchDirectory = "public/api-search";

const routeFromId = (id: string[]) => `/${id.join("/")}`;

const encodeSearchId = (value: string) => Buffer.from(value, "utf-8").toString("base64");

const getRenderablePages = (graph: ContentGraph) => {
    const renderableRoutes = new Set(graph.routeManifest.map((route) => routeFromId(route.params.id)));
    return graph.pages.filter((page) => renderableRoutes.has(page.route));
};

const getKeywords = (keywords: string) => keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean);

const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export const createSitemapEntries = (graph: ContentGraph): SitemapEntry[] => {
    const entries: SitemapEntry[] = getRenderablePages(graph).map((page) => ({
        url: page.route,
        lastModified: page.lastModified?.toISOString(),
    }));

    entries.push({ url: "/search" }, { url: "/playground" });

    return entries.sort((left, right) => left.url.localeCompare(right.url));
};

export const createSitemapXml = (graph: ContentGraph, baseUrl = "https://doc.babylonjs.com") => {
    const urls = createSitemapEntries(graph).map((entry) => {
        const location = `${baseUrl}${entry.url}`;
        const lastModified = entry.lastModified ? `<lastmod>${escapeXml(entry.lastModified)}</lastmod>` : "";
        return `    <url><loc>${escapeXml(location)}</loc>${lastModified}</url>`;
    });

    return [`<?xml version="1.0" encoding="UTF-8"?>`, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`, ...urls, `</urlset>`].join("\n");
};

export const createDocumentationSearchIndex = (graph: ContentGraph): ISearchIndexItem[] => {
    return getRenderablePages(graph).map((page) => ({
        id: encodeSearchId(page.route),
        categories: page.breadcrumbs.map((breadcrumb) => breadcrumb.name),
        path: page.route,
        isApi: false,
        content: page.rawContent,
        keywords: getKeywords(page.metadata.keywords),
        description: page.metadata.description,
        title: page.metadata.title,
        imageUrl: page.metadata.imageUrl,
        videoLink: page.metadata.videoOverview,
        lastModified: page.lastModified,
    }));
};

const createPlaygroundSearchItem = (page: ContentGraphPage, example: ContentGraphExampleReference): IPlaygroundSearchItem | undefined => {
    if (example.type !== "pg" || !example.id) {
        return undefined;
    }

    const playgroundId = example.id[0] === "#" ? example.id.substr(1) : example.id;
    const id = encodeSearchId(playgroundId);
    if (!id) {
        return undefined;
    }

    return {
        id,
        playgroundId,
        title: example.title || `Playground for ${page.metadata.title}`,
        description: example.description || "",
        keywords: getKeywords(page.metadata.keywords),
        imageUrl: example.imageUrl || getExampleImageUrl({ type: example.type, id: example.id }),
        documentationPage: page.route,
        isMain: example.isMain,
        category: example.category || "",
    };
};

export const createPlaygroundSearchIndex = (graph: ContentGraph): IPlaygroundSearchItem[] => {
    const items = new Map<string, IPlaygroundSearchItem>();

    getRenderablePages(graph).forEach((page) => {
        page.examples.forEach((example) => {
            const item = createPlaygroundSearchItem(page, example);
            if (item) {
                items.set(item.id, item);
            }
        });
    });

    return Array.from(items.values()).sort((left, right) => left.playgroundId.localeCompare(right.playgroundId));
};