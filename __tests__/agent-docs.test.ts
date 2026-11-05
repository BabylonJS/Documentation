import { describe, expect, it } from "vitest";

import { convertMdxToMarkdown, createLlmsTxt, getAgentDocsSections, getMarkdownPath, normalizeImageUrl, renderPageMarkdown } from "../lib/agentDocs/markdownExport";
import { buildContentGraph } from "../lib/contentGraph/buildContentGraph";
import type { ContentGraph, ContentGraphPage } from "../lib/contentGraph/types";

const createPage = (id: string[], overrides: Partial<ContentGraphPage> = {}): ContentGraphPage => ({
    id,
    route: `/${id.join("/")}`,
    docItem: { friendlyName: id[id.length - 1] || "Home", content: id.join("/") },
    contentPath: id.join("/"),
    rawContent: "",
    frontmatter: {},
    metadata: { title: `Title ${id.join(" ")}`, description: `Description ${id.join(" ")}`, keywords: "" },
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
    pagesByContentPath: {},
    routeManifest: [],
});

describe("convertMdxToMarkdown", () => {
    it("converts example components to links", () => {
        const markdown = convertMdxToMarkdown(
            [
                'Text <Playground id="#ABC#1" title="Inline" /> here.',
                "",
                '<Playground id="#XYZ#2" title="Box [demo]" description="A box" engine="webgpu"/>',
                "",
                '<NME id="#NME#3" title="Material"/>',
            ].join("\n"),
        );

        expect(markdown).toContain("Text [Playground: Inline](https://playground.babylonjs.com/#ABC#1) here.");
        expect(markdown).toContain("- [Playground: Box \\[demo\\]](https://playground.babylonjs.com/?webgpu#XYZ#2) - A box");
        expect(markdown).toContain("- [Node Material Editor: Material](https://nme.babylonjs.com/#NME#3)");
    });

    it("converts media embeds to links", () => {
        expect(convertMdxToMarkdown('<CodePen pen="p" title="Path C:\\"/>')).toBe("[CodePen: Path C:\\\\](https://codepen.io/BabylonJS/pen/p/)\n");

        const markdown = convertMdxToMarkdown(['<Youtube id="abc123"/>', "", '<CodePen pen="xyz" title="Pen"/>', "", '<CodeSandbox id="sb1" title="Sandbox"/>'].join("\n"));

        expect(markdown).toContain("[YouTube video](https://www.youtube.com/watch?v=abc123)");
        expect(markdown).toContain("[CodePen: Pen](https://codepen.io/BabylonJS/pen/xyz/)");
        expect(markdown).toContain("[CodeSandbox: Sandbox](https://codesandbox.io/s/sb1)");
    });

    it("converts alerts to GitHub-style callouts", () => {
        const markdown = convertMdxToMarkdown('<Alert severity="warning" title="Careful" description="See <a href=\'/setup\'>setup</a>."/>');

        expect(markdown).toBe("> [!WARNING]\n> **Careful**\n>\n> See <a href='https://doc.babylonjs.com/setup'>setup</a>.\n");
    });

    it("keeps nested list indentation for multi-line replacements", () => {
        const markdown = convertMdxToMarkdown('- item\n\n  <Alert severity="info" title="Title" description="Body"/>\n');

        expect(markdown).toBe("- item\n\n  > [!NOTE]\n  > **Title**\n  >\n  > Body\n");
    });

    it("makes site-relative links and images absolute and removes renderer-only image hints", () => {
        const markdown = convertMdxToMarkdown(
            ["[Setup](/setup#top) [External](https://example.com) [Anchor](#local)", "", "![Box](/img/box.webp!600x400)", "", '<img src="/img/raw.png?expandable=false" alt="Raw"/>', "", "[ref]: /features"].join("\n"),
        );

        expect(markdown).toContain("[Setup](https://doc.babylonjs.com/setup#top) [External](https://example.com) [Anchor](#local)");
        expect(markdown).toContain("![Box](https://doc.babylonjs.com/img/box.webp)");
        expect(markdown).toContain("![Raw](https://doc.babylonjs.com/img/raw.png)");
        expect(markdown).toContain("[ref]: https://doc.babylonjs.com/features");
    });

    it("leaves code untouched and removes MDX-only syntax", () => {
        const source = ['import Something from "x";', "", "{/* hidden */}", "", "```javascript", '<Playground id="#CODE"/>', "[link](/setup)", "```", "", "Use `<Alert/>` inline."].join("\n");
        const markdown = convertMdxToMarkdown(source);

        expect(markdown).not.toContain("import Something");
        expect(markdown).not.toContain("hidden");
        expect(markdown).toContain('```javascript\n<Playground id="#CODE"/>\n[link](/setup)\n```');
        expect(markdown).toContain("Use `<Alert/>` inline.");
    });

    it("converts heading images and unwraps code variants and unknown components", () => {
        const unknown: string[] = [];
        const markdown = convertMdxToMarkdown(
            ['<H3Image title="Box" image="/img/box.webp" alt="Box node"/>', "", '<CodeVariant label="ES6">', "", "```js", "code();", "```", "", "</CodeVariant>", "", "<Custom>", "", "Inner text", "", "</Custom>"].join("\n"),
            { onUnknownComponent: (name) => unknown.push(name) },
        );

        expect(markdown).toContain("### Box\n\n![Box node](https://doc.babylonjs.com/img/box.webp)");
        expect(markdown).toContain("**ES6**\n\n```js\ncode();\n```");
        expect(markdown).toContain("Inner text");
        expect(markdown).not.toContain("<Custom>");
        expect(unknown).toEqual(["Custom"]);
    });

    it("normalizes image URLs", () => {
        expect(normalizeImageUrl("/img/a.png!600")).toBe("https://doc.babylonjs.com/img/a.png");
        expect(normalizeImageUrl("https://example.com/a.png?size=2")).toBe("https://example.com/a.png?size=2");
    });
});

describe("renderPageMarkdown", () => {
    it("adds a title, description, source URL, further reading, and child pages", () => {
        const child = createPage(["docs", "child"]);
        const page = createPage(["docs"], {
            rawContent: "Body text.",
            childIds: [["docs", "child"]],
            furtherReading: [{ title: "More", url: "/more" }],
        });

        const markdown = renderPageMarkdown(page, { graph: createGraph([page, child]) });

        expect(markdown).toBe(
            [
                "# Title docs",
                "",
                "> Description docs",
                "",
                "Source: https://doc.babylonjs.com/docs",
                "",
                "Body text.",
                "",
                "## Further reading",
                "",
                "- [More](https://doc.babylonjs.com/more)",
                "",
                "## Pages in this section",
                "",
                "- [Title docs child](https://doc.babylonjs.com/docs/child.md): Description docs child",
                "",
            ].join("\n"),
        );
    });

    it("keeps an existing H1 and skips generated default descriptions", () => {
        const page = createPage(["docs"], {
            rawContent: "# Own Title\n\nBody",
            metadata: { title: "Docs", description: "Documentation page for Docs", keywords: "" },
        });

        expect(renderPageMarkdown(page)).toBe("Source: https://doc.babylonjs.com/docs\n\n# Own Title\n\nBody\n");
    });
});

describe("createLlmsTxt", () => {
    it("lists sections up to the configured depth", () => {
        const pages = [
            createPage([], { contentPath: "home" }),
            createPage(["a"]),
            createPage(["a", "b"]),
            createPage(["a", "b", "c"]),
            createPage(["a", "b", "c", "d"]),
            createPage(["e"], { contentPath: undefined }),
            createPage(["e", "f"]),
        ];

        const llmsTxt = createLlmsTxt({ sections: getAgentDocsSections(createGraph(pages)) });

        expect(llmsTxt).toContain("## Title a\n\n- [Title a](https://doc.babylonjs.com/a.md): Description a\n  - [Title a b](https://doc.babylonjs.com/a/b.md): Description a b\n    - [Title a b c](https://doc.babylonjs.com/a/b/c.md): Description a b c\n");
        expect(llmsTxt).not.toContain("a/b/c/d.md");
        expect(llmsTxt).toContain("## Title e\n\n- Title e\n  - [Title e f](https://doc.babylonjs.com/e/f.md)");
    });

    it("lists deep pages whose parent has no markdown page", () => {
        const pages = [createPage(["a"]), createPage(["a", "b"], { contentPath: undefined }), createPage(["a", "b", "c"], { contentPath: undefined }), createPage(["a", "b", "c", "d"])];

        expect(createLlmsTxt({ sections: getAgentDocsSections(createGraph(pages)), maxDepth: 2 })).toContain("a/b/c/d.md");
    });
});

describe("agent docs for real content", () => {
    it("converts every documentation page without leaving custom components outside code", () => {
        const graph = buildContentGraph();
        const unknown = new Set<string>();

        graph.pages
            .filter((page) => !!page.contentPath)
            .forEach((page) => {
                const markdown = renderPageMarkdown(page, { graph, onUnknownComponent: (name) => unknown.add(name) });
                const withoutCode = markdown.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
                expect(withoutCode, page.route).not.toMatch(/<(Playground|Alert|Youtube|NME|NGE|NRGE|SFE|CodePen|CodeSandbox|H2Image|H3Image)\b/);
            });

        expect(Array.from(unknown)).toEqual([]);
        expect(getMarkdownPath("/")).toBe("/index.md");
    });
});
