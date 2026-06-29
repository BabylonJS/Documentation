import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { afterEach, describe, expect, it } from "vitest";

import { IDocMenuItem } from "../lib/interfaces";
import { ContentGraph, ContentGraphPage } from "../lib/contentGraph/types";
import { validateContentGraph, validateDocumentationContent, validateDocumentationStructure } from "../lib/contentGraph/validateContentGraph";

const tempDirectories: string[] = [];

const createTempContentRoot = () => {
    const directory = mkdtempSync(join(tmpdir(), "docs-validation-"));
    tempDirectories.push(directory);
    return directory;
};

const writeMarkdown = (contentRoot: string, contentPath: string, content = "# Test") => {
    const filePath = join(contentRoot, `${contentPath}.md`);
    mkdirSync(join(filePath, ".."), { recursive: true });
    writeFileSync(filePath, content);
};

const createPage = (overrides: Partial<ContentGraphPage> = {}): ContentGraphPage => ({
    id: ["test"],
    route: "/test",
    docItem: { friendlyName: "Test", content: "test" },
    contentPath: "test",
    sourcePath: "content/test.md",
    rawContent: "# Test",
    frontmatter: {},
    metadata: {
        title: "Test",
        description: "Test page",
        keywords: "test",
    },
    breadcrumbs: [],
    childIds: [],
    furtherReading: undefined,
    internalLinks: [],
    examples: [],
    ...overrides,
});

const createGraph = (pages: ContentGraphPage[]): ContentGraph => ({
    pages,
    pagesByRoute: Object.fromEntries(pages.map((page) => [page.route, page])),
    pagesByContentPath: pages.reduce<Record<string, ContentGraphPage[]>>((lookup, page) => {
        if (page.contentPath) {
            lookup[page.contentPath] = [...(lookup[page.contentPath] || []), page];
        }
        return lookup;
    }, {}),
    routeManifest: pages.map((page) => ({ params: { id: page.id, content: page.contentPath } })),
});

afterEach(() => {
    tempDirectories.splice(0).forEach((directory) => {
        if (existsSync(directory)) {
            rmSync(directory, { recursive: true, force: true });
        }
    });
});

describe("Content Validation", () => {
    it("passes the current documentation content without validation errors", () => {
        const report = validateDocumentationContent();

        expect(report.errors).toEqual([]);
        expect(report.checkedPages).toBeGreaterThan(700);
        expect(report.checkedMarkdownFiles).toBeGreaterThan(700);
    });

    it("reports structure errors for missing, duplicate, and unreferenced markdown files", () => {
        const contentRoot = createTempContentRoot();
        writeMarkdown(contentRoot, "shared");
        writeMarkdown(contentRoot, "orphaned");
        const structure: IDocMenuItem = {
            friendlyName: "Root",
            content: "missing",
            children: {
                first: { friendlyName: "First", content: "shared" },
                second: { friendlyName: "Second", content: "shared" },
            },
        };

        const report = validateDocumentationStructure(structure, { contentRoot });

        expect(report.errors.map((issue) => issue.code)).toEqual(expect.arrayContaining(["missing-content-file", "duplicate-content-reference", "unreferenced-content-file"]));
    });

    it("reports unknown and incorrectly typed frontmatter fields", () => {
        const graph = createGraph([
            createPage({
                frontmatter: {
                    titel: "Typo",
                    "toc-levels": "3",
                    "further-reading": [{ title: "Missing URL" }],
                },
            }),
        ]);

        const report = validateContentGraph(graph);

        expect(report.errors.map((issue) => issue.code)).toEqual(expect.arrayContaining(["unknown-frontmatter-field", "invalid-frontmatter-number", "invalid-frontmatter-list-item"]));
    });

    it("reports unresolved links while allowing redirected links as warnings", () => {
        const page = createPage({ internalLinks: ["missing/page", "start"] });
        const graph = createGraph([page]);

        const report = validateContentGraph(graph);

        expect(report.errors.map((issue) => issue.code)).toContain("unresolved-internal-link");
        expect(report.warnings.map((issue) => issue.code)).toContain("redirected-internal-link");
    });

    it("reports malformed example component props", () => {
        const graph = createGraph([
            createPage({
                rawContent: '<Playground title="No ID" engine="webgl3" />',
            }),
        ]);

        const report = validateContentGraph(graph);

        expect(report.errors.map((issue) => issue.code)).toContain("invalid-example-engine");
        expect(report.warnings.map((issue) => issue.code)).toEqual(expect.arrayContaining(["missing-example-id", "missing-example-description"]));
    });
});