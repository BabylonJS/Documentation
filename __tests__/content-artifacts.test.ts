import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";
import sharp from "sharp";

import { ContentGraph, ContentGraphPage } from "../lib/contentGraph/types";
import { collectExampleImageReferences, createExampleImageReport, createExampleImageReportWithBlanks, detectBlankImages, isBlankImage } from "../lib/contentGraph/exampleImages";
import { createDocumentationSearchIndex, createPlaygroundSearchIndex, createSitemapEntries, createSitemapXml, createSitemapXmlFromEntries } from "../lib/contentGraph/staticArtifacts";

// libvips caches decoded input keyed on filename + coarse mtime; disable it so tests that rewrite
// the same path within a second read fresh pixels.
sharp.cache(false);

const testImagePath = join(process.cwd(), "public/img/playgroundsAndNMEs/__content-artifacts-test.webp");
const blankImagePath = join(process.cwd(), "public/img/playgroundsAndNMEs/__content-artifacts-blank.webp");
const variedImagePath = join(process.cwd(), "public/img/playgroundsAndNMEs/__content-artifacts-varied.webp");

const writeSolidImage = async (path: string) => {
    mkdirSync(join(path, ".."), { recursive: true });
    await sharp({ create: { width: 16, height: 16, channels: 3, background: { r: 0, g: 0, b: 0 } } })
        .webp()
        .toFile(path);
};

const writeVariedImage = async (path: string) => {
    mkdirSync(join(path, ".."), { recursive: true });
    const pixels = Buffer.alloc(16 * 16 * 3);
    for (let i = 0; i < pixels.length; i++) {
        pixels[i] = (i * 37) % 256;
    }
    await sharp(pixels, { raw: { width: 16, height: 16, channels: 3 } })
        .webp({ lossless: true })
        .toFile(path);
};

afterEach(() => {
    [testImagePath, blankImagePath, variedImagePath].forEach((path) => {
        if (existsSync(path)) {
            rmSync(path, { force: true });
        }
    });
});

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

    it("creates sitemap XML from explicit entries", () => {
        const sitemapXml = createSitemapXmlFromEntries([{ url: "/typedoc/classes/Scene" }], "https://example.test");

        expect(sitemapXml).toContain("<loc>https://example.test/typedoc/classes/Scene</loc>");
    });

    it("creates documentation search records from graph metadata", () => {
        const graph = createGraph([createPage()]);

        const [item] = createDocumentationSearchIndex(graph);

        expect(item).toMatchObject({
            id: "L2RvY3MvcGFnZQ==",
            flavor: "babylon",
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

    it("creates flavor-specific search records", () => {
        const graph = createGraph([
            createPage({
                examples: [{ type: "pg", id: "ABC#1", title: "Lite example" }],
            }),
        ]);

        const [documentationItem] = createDocumentationSearchIndex(graph, "lite");
        const [playgroundItem] = createPlaygroundSearchIndex(graph, "lite");

        expect(documentationItem).toMatchObject({
            id: "L2RvY3MvcGFnZQ==",
            flavor: "lite",
        });
        expect(playgroundItem).toMatchObject({
            id: "bGl0ZTpBQkMjMQ==",
            flavor: "lite",
            playgroundId: "ABC#1",
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
                id: "YmFieWxvbjpBQkMjMQ==",
                flavor: "babylon",
                playgroundId: "ABC#1",
                title: "Replacement",
                imageUrl: "/img/custom.png",
                documentationPage: "/docs/page",
            }),
        ]);
    });

    it("collects preview image references from renderable graph examples", () => {
        const graph = createGraph([
            createPage({
                examples: [
                    { type: "pg", id: "ABC#1", title: "Playground" },
                    { type: "nme", id: "NODE#1", imageUrl: "/img/playgroundsAndNMEs/custom-node.png" },
                    { type: "pg", id: "playgroundId" },
                ],
            }),
            createPage({ id: ["hidden"], route: "/hidden", examples: [{ type: "pg", id: "HIDDEN#1" }] }),
        ], [["docs", "page"]]);

        const references = collectExampleImageReferences(graph);

        expect(references.map((reference) => reference.imageUrl)).toEqual(["/img/playgroundsAndNMEs/custom-node.png", "/img/playgroundsAndNMEs/pgABC-1.webp"]);
        expect(references.map((reference) => reference.documentationPage)).toEqual(["/docs/page", "/docs/page"]);
    });

    it("reports missing and existing preview images", () => {
        mkdirSync(join(testImagePath, ".."), { recursive: true });
        writeFileSync(testImagePath, "test image");

        const graph = createGraph([
            createPage({
                examples: [
                    { type: "pg", id: "EXISTING#1", imageUrl: "/img/playgroundsAndNMEs/__content-artifacts-test.webp" },
                    { type: "pg", id: "MISSING#1" },
                ],
            }),
        ]);

        const report = createExampleImageReport(graph);

        expect(report.checkedImages).toBe(2);
        expect(report.existingImages.map((reference) => reference.id)).toEqual(["EXISTING#1"]);
        expect(report.missingImages.map((reference) => reference.id)).toEqual(["MISSING#1"]);
    });

    it("detects blank solid-color images and treats varied images as non-blank", async () => {
        await writeSolidImage(blankImagePath);
        expect(await isBlankImage(blankImagePath)).toBe(true);

        await writeVariedImage(variedImagePath);
        expect(await isBlankImage(variedImagePath)).toBe(false);
    });

    it("treats unreadable images as blank", async () => {
        mkdirSync(join(testImagePath, ".."), { recursive: true });
        writeFileSync(testImagePath, "not a real image");
        expect(await isBlankImage(testImagePath)).toBe(true);
    });

    it("flags blank existing images in the report", async () => {
        await writeSolidImage(testImagePath);

        const graph = createGraph([
            createPage({
                examples: [{ type: "pg", id: "BLANK#1", imageUrl: "/img/playgroundsAndNMEs/__content-artifacts-test.webp" }],
            }),
        ]);

        const report = await createExampleImageReportWithBlanks(graph);

        expect(report.existingImages.map((reference) => reference.id)).toEqual(["BLANK#1"]);
        expect(report.blankImages?.map((reference) => reference.id)).toEqual(["BLANK#1"]);

        const references = collectExampleImageReferences(graph);
        expect((await detectBlankImages(references)).map((reference) => reference.id)).toEqual(["BLANK#1"]);
    });
});