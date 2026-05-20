import { describe, expect, it } from "vitest";

import { ContentGraph, ContentGraphPage } from "../lib/contentGraph/types";
import { createDocumentationSearchIndex, createPlaygroundSearchIndex, createSitemapEntries, createSitemapXml } from "../lib/contentGraph/staticArtifacts";

const createPage = (overrides: Partial<ContentGraphPage> = {}): ContentGraphPage => ({
    id: ["docs", "page"],
    route: "/docs/page",
    docItem: { friendlyName: "Docs Page", content: "docs/page" },
    contentPath: "docs/page",
    sourcePath: "content/docs/page.md",
    rawContent: "# Docs Page\nUseful content.",
    frontmatter: {},
    metadata: {
        title: "Docs Page",
        description: "A useful docs page",
        keywords: "babylonjs, docs, example",
        imageUrl: "/img/example.png",
        videoOverview: "video-id",
    },
    breadcrumbs: [
        { name: "Docs", url: "/docs" },
        { name: "Page", url: "/docs/page" },
    ],
    childIds: [],
    furtherReading: undefined,
    internalLinks: [],
    examples: [],
    lastModified: new Date("2024-01-02T03:04:05.000Z"),
    ...overrides,
});

const createGraph = (pages: ContentGraphPage[], routeIds = pages.map((page) => page.id)): ContentGraph => ({
    pages,
    pagesByRoute: Object.fromEntries(pages.map((page) => [page.route, page])),
    pagesByContentPath: pages.reduce<Record<string, ContentGraphPage[]>>((lookup, page) => {
        if (page.contentPath) {
            lookup[page.contentPath] = [...(lookup[page.contentPath] || []), page];
        }
        return lookup;
    }, {}),
    routeManifest: routeIds.map((id) => ({ params: { id } })),
});

describe("Static Content Artifacts", () => {
    it("creates sitemap XML from renderable content graph routes", () => {
        const graph = createGraph([
            createPage({ id: [], route: "/", contentPath: "index" }),
            createPage(),
            createPage({ id: ["hidden"], route: "/hidden", contentPath: "hidden" }),
        ], [[], ["docs", "page"]]);

        const entries = createSitemapEntries(graph);
        const sitemapXml = createSitemapXml(graph, "https://example.test");

        expect(entries.map((entry) => entry.url)).toEqual(["/", "/docs/page", "/playground", "/search"]);
        expect(sitemapXml).toContain("<loc>https://example.test/docs/page</loc><lastmod>2024-01-02T03:04:05.000Z</lastmod>");
        expect(sitemapXml).not.toContain("/hidden");
    });

    it("creates documentation search records from graph metadata", () => {
        const graph = createGraph([createPage()]);

        const [item] = createDocumentationSearchIndex(graph);

        expect(item).toMatchObject({
            id: "L2RvY3MvcGFnZQ==",
            path: "/docs/page",
            isApi: false,
            title: "Docs Page",
            description: "A useful docs page",
            content: "# Docs Page\nUseful content.",
            keywords: ["babylonjs", "docs", "example"],
            categories: ["Docs", "Page"],
            imageUrl: "/img/example.png",
            videoLink: "video-id",
        });
    });

    it("creates deduplicated playground search records", () => {
        const graph = createGraph([
            createPage({
                examples: [
                    { type: "pg", id: "ABC#1", title: "First", description: "First example", isMain: true, category: "Basics" },
                    { type: "nme", id: "NODE#1", title: "Node Material" },
                    { type: "pg", id: "ABC#1", title: "Replacement", imageUrl: "/img/custom.png" },
                    { type: "pg", id: "" },
                ],
            }),
        ]);

        const items = createPlaygroundSearchIndex(graph);

        expect(items).toEqual([
            expect.objectContaining({
                id: "QUJDIzE=",
                playgroundId: "ABC#1",
                title: "Replacement",
                imageUrl: "/img/custom.png",
                documentationPage: "/docs/page",
            }),
        ]);
    });
});