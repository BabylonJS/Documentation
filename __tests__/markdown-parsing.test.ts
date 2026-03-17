/**
 * Markdown Parsing Regression Tests
 *
 * These tests capture the output of the markdown→MDX serialization pipeline
 * (the same pipeline used in getStaticProps) as snapshots. They protect against
 * breaking changes when updating remark/rehype/unified/next-mdx-remote and
 * related dependencies.
 *
 * The tests exercise:
 *   - Frontmatter parsing (gray-matter)
 *   - Heading ID generation (remark-slug)
 *   - GitHub Flavored Markdown (remark-gfm): tables, strikethrough, task lists
 *   - Math equations (remark-math + rehype-katex)
 *   - Code blocks
 *   - Custom MDX components (Playground, NME, Youtube, Alert, etc.)
 *   - Links, images, blockquotes, lists, inline formatting
 *   - Real content files as full regression tests
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

// next-mdx-remote's serialize must be dynamically imported (ESM)
async function getSerialize() {
    const { serialize } = await import("next-mdx-remote/serialize");
    return serialize;
}

async function getPlugins() {
    const rehypeSlug = (await import("rehype-slug")).default;
    const remarkGfm = (await import("remark-gfm")).default;
    const remarkMath = (await import("remark-math")).default;
    const rehypeKatex = (await import("rehype-katex")).default;
    return { rehypeSlug, remarkGfm, remarkMath, rehypeKatex };
}

/**
 * Serialize markdown content through the same pipeline as getStaticProps.
 * Returns { compiledSource, frontmatter }.
 */
async function serializeMarkdown(markdownWithFrontmatter: string) {
    const serialize = await getSerialize();
    const { rehypeSlug, remarkGfm, remarkMath, rehypeKatex } = await getPlugins();

    const { content, data: frontmatter } = matter(markdownWithFrontmatter);

    const mdxResult = await serialize(content, {
        mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeSlug, rehypeKatex],
        },
    });

    return {
        compiledSource: mdxResult.compiledSource,
        frontmatter,
    };
}

function loadFixture(name: string): string {
    const fixturePath = join(__dirname, "fixtures", name);
    return readFileSync(fixturePath, "utf-8");
}

function loadContentFile(relativePath: string): string | null {
    const fullPath = join(__dirname, "..", "content", relativePath);
    if (!existsSync(fullPath)) return null;
    return readFileSync(fullPath, "utf-8");
}

// ─── Frontmatter Parsing ────────────────────────────────────────────────

describe("Frontmatter Parsing (gray-matter)", () => {
    it("should parse basic frontmatter fields", () => {
        const raw = loadFixture("headings.md");
        const { data } = matter(raw);
        expect(data).toMatchSnapshot();
    });

    it("should parse frontmatter with further-reading list", () => {
        const raw = loadFixture("links-and-images.md");
        const { data } = matter(raw);
        expect(data).toMatchSnapshot();
    });

    it("should parse complex frontmatter with all field variations", () => {
        const raw = loadFixture("frontmatter-variations.md");
        const { data } = matter(raw);
        expect(data).toMatchSnapshot();
    });

    it("should correctly separate frontmatter from content", () => {
        const raw = loadFixture("frontmatter-variations.md");
        const { content, data } = matter(raw);
        expect(content).not.toContain("title:");
        expect(content).not.toContain("further-reading:");
        expect(content).toContain("## Content After Frontmatter");
        expect(data.title).toBe("Frontmatter Variations Test");
    });

    it("should handle empty optional frontmatter fields", () => {
        const raw = loadFixture("headings.md");
        const { data } = matter(raw);
        // These fields are present but empty in the fixture
        expect(data["further-reading"]).toBeNull();
        expect(data["video-overview"]).toBeNull();
        expect(data["video-content"]).toBeNull();
    });
});

// ─── Heading ID Generation (remark-slug) ────────────────────────────────

describe("Heading ID Generation (remark-slug)", () => {
    it("should generate heading IDs from fixture", async () => {
        const raw = loadFixture("headings.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toMatchSnapshot();
    });

    it("should handle special characters in headings", async () => {
        const raw = loadFixture("headings.md");
        const result = await serializeMarkdown(raw);
        // The compiled source should contain slug-ified heading IDs
        expect(result.compiledSource).toContain("getting-started");
        expect(result.compiledSource).toContain("api-reference");
    });
});

// ─── GFM Features (remark-gfm) ─────────────────────────────────────────

describe("GFM Features (remark-gfm)", () => {
    it("should render tables, strikethrough, and task lists", async () => {
        const raw = loadFixture("gfm-features.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toMatchSnapshot();
    });

    it("should contain table markup", async () => {
        const raw = loadFixture("gfm-features.md");
        const result = await serializeMarkdown(raw);
        // Tables should be rendered as HTML table elements
        expect(result.compiledSource).toContain("table");
        expect(result.compiledSource).toContain("thead");
    });

    it("should contain strikethrough markup", async () => {
        const raw = loadFixture("gfm-features.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toContain("del");
    });
});

// ─── Math Equations (remark-math + rehype-katex) ────────────────────────

describe("Math Equations (remark-math + rehype-katex)", () => {
    it("should render inline and block math", async () => {
        const raw = loadFixture("math-equations.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toMatchSnapshot();
    });

    it("should contain KaTeX output for inline math", async () => {
        const raw = loadFixture("math-equations.md");
        const result = await serializeMarkdown(raw);
        // KaTeX wraps math in span elements with katex class
        expect(result.compiledSource).toContain("katex");
    });

    it("should contain KaTeX output for block math", async () => {
        const raw = loadFixture("math-equations.md");
        const result = await serializeMarkdown(raw);
        // Block math uses katex-display class
        expect(result.compiledSource).toContain("katex-display");
    });
});

// ─── Code Blocks ────────────────────────────────────────────────────────

describe("Code Blocks", () => {
    it("should render code blocks with language classes", async () => {
        const raw = loadFixture("code-blocks.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toMatchSnapshot();
    });

    it("should preserve language designations in code blocks", async () => {
        const raw = loadFixture("code-blocks.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toContain("javascript");
        expect(result.compiledSource).toContain("typescript");
        expect(result.compiledSource).toContain("shell");
        expect(result.compiledSource).toContain("glsl");
    });
});

// ─── Custom MDX Components ──────────────────────────────────────────────

describe("Custom MDX Components", () => {
    it("should serialize all custom component types", async () => {
        const raw = loadFixture("custom-components.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toMatchSnapshot();
    });

    it("should contain Playground component references", async () => {
        const raw = loadFixture("custom-components.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toContain("Playground");
        expect(result.compiledSource).toContain("#2KRNG9");
    });

    it("should contain NME component references", async () => {
        const raw = loadFixture("custom-components.md");
        const result = await serializeMarkdown(raw);
        // Both NME and nme are registered
        expect(result.compiledSource).toContain("NME");
    });

    it("should contain Youtube component references", async () => {
        const raw = loadFixture("custom-components.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toContain("Youtube");
        expect(result.compiledSource).toContain("qqMuuSM7GvI");
    });

    it("should contain Alert component references", async () => {
        const raw = loadFixture("custom-components.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toContain("Alert");
    });

    it("should contain CodePen component references", async () => {
        const raw = loadFixture("custom-components.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toContain("CodePen");
    });

    it("should contain CodeSandbox component references", async () => {
        const raw = loadFixture("custom-components.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toContain("CodeSandbox");
    });
});

// ─── Links and Images ───────────────────────────────────────────────────

describe("Links and Images", () => {
    it("should render all link and image patterns", async () => {
        const raw = loadFixture("links-and-images.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toMatchSnapshot();
    });

    it("should preserve internal link hrefs", async () => {
        const raw = loadFixture("links-and-images.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toContain("/features/featuresDeepDive/webXR/webXRFeaturesManager");
        expect(result.compiledSource).toContain("/contribute/contributeToDocs");
    });

    it("should preserve external link hrefs", async () => {
        const raw = loadFixture("links-and-images.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toContain("https://www.babylonjs.com");
    });

    it("should preserve image sources", async () => {
        const raw = loadFixture("links-and-images.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toContain("/img/features/animation/horse_frames.jpg");
    });
});

// ─── Complex Mixed Content ──────────────────────────────────────────────

describe("Complex Mixed Content", () => {
    it("should render lists, blockquotes, tables, and HTML together", async () => {
        const raw = loadFixture("complex-mixed.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toMatchSnapshot();
    });

    it("should preserve blockquote content", async () => {
        const raw = loadFixture("complex-mixed.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toContain("blockquote");
    });

    it("should preserve kbd elements", async () => {
        const raw = loadFixture("complex-mixed.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toContain("kbd");
    });

    it("should handle mixed inline formatting", async () => {
        const raw = loadFixture("complex-mixed.md");
        const result = await serializeMarkdown(raw);
        expect(result.compiledSource).toContain("strong");
        expect(result.compiledSource).toContain("em");
        expect(result.compiledSource).toContain("del");
    });
});

// ─── Real Content File Regression Tests ─────────────────────────────────

describe("Real Content File Regression", () => {
    it("should serialize content/setup.md correctly", async () => {
        const raw = loadContentFile("setup.md");
        if (!raw) return; // skip if file not available
        const result = await serializeMarkdown(raw);
        expect(result.frontmatter).toMatchSnapshot("frontmatter");
        expect(result.compiledSource).toMatchSnapshot("compiledSource");
    });

    it("should serialize content/addons/htmlMesh.md correctly", async () => {
        const raw = loadContentFile("addons/htmlMesh.md");
        if (!raw) return;
        const result = await serializeMarkdown(raw);
        expect(result.frontmatter).toMatchSnapshot("frontmatter");
        expect(result.compiledSource).toMatchSnapshot("compiledSource");
    });

    it("should serialize content/features.md correctly", async () => {
        const raw = loadContentFile("features.md");
        if (!raw) return;
        const result = await serializeMarkdown(raw);
        expect(result.frontmatter).toMatchSnapshot("frontmatter");
        expect(result.compiledSource).toMatchSnapshot("compiledSource");
    });

    it("should serialize content/whats-new.md correctly", async () => {
        const raw = loadContentFile("whats-new.md");
        if (!raw) return;
        const result = await serializeMarkdown(raw);
        expect(result.frontmatter).toMatchSnapshot("frontmatter");
        expect(result.compiledSource).toMatchSnapshot("compiledSource");
    });
});

// ─── Bulk Content Parsing Smoke Test ────────────────────────────────────

describe("Bulk Content Parsing", () => {
    it("should parse all fixture files without errors", async () => {
        const fixtures = [
            "headings.md",
            "gfm-features.md",
            "math-equations.md",
            "code-blocks.md",
            "custom-components.md",
            "links-and-images.md",
            "complex-mixed.md",
            "frontmatter-variations.md",
        ];

        for (const fixture of fixtures) {
            const raw = loadFixture(fixture);
            const result = await serializeMarkdown(raw);
            expect(result.compiledSource).toBeTruthy();
            expect(typeof result.compiledSource).toBe("string");
            expect(result.compiledSource.length).toBeGreaterThan(0);
        }
    });
});
