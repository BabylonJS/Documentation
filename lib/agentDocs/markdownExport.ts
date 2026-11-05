import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";

import type { IExampleLink } from "../content.interfaces";
import { getExampleLink } from "../frontendUtils/frontendTools";
import type { ContentGraph, ContentGraphPage } from "../contentGraph/types";

export const agentDocsBaseUrl = "https://doc.babylonjs.com";

interface Position {
    start: { offset?: number; line?: number };
    end: { offset?: number };
}

interface JsxAttribute {
    type: string;
    name?: string;
    value?: string | null | { type: string; value: string };
}

interface MarkdownNode {
    type: string;
    name?: string | null;
    url?: string;
    value?: string;
    attributes?: JsxAttribute[];
    children?: MarkdownNode[];
    position?: Position;
}

interface Replacement {
    start: number;
    end: number;
    value: string;
}

export interface MarkdownConversionOptions {
    baseUrl?: string;
    /** Receives the names of JSX components that have no markdown conversion and were removed or unwrapped. */
    onUnknownComponent?: (name: string) => void;
}

const exampleTypes: Record<string, { type: NonNullable<IExampleLink["type"]>; label: string }> = {
    playground: { type: "pg", label: "Playground" },
    nme: { type: "nme", label: "Node Material Editor" },
    nge: { type: "nge", label: "Node Geometry Editor" },
    sfe: { type: "sfe", label: "Smart Filter Editor" },
    nrge: { type: "nrge", label: "Node Render Graph Editor" },
};

const alertKinds: Record<string, string> = {
    info: "NOTE",
    warning: "WARNING",
    error: "CAUTION",
    success: "TIP",
};

const htmlUrlAttributes = new Set(["src", "href", "poster"]);

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkMath);

const startOf = (node: MarkdownNode) => node.position?.start.offset;
const endOf = (node: MarkdownNode) => node.position?.end.offset;

export const toAbsoluteUrl = (url: string, baseUrl = agentDocsBaseUrl) => {
    return url.startsWith("/") && !url.startsWith("//") ? `${baseUrl}${url}` : url;
};

/** Image URLs in the docs may carry a `!WIDTHxHEIGHT` size suffix and an `?expandable=` hint used only by the web renderer. */
export const normalizeImageUrl = (url: string, baseUrl = agentDocsBaseUrl) => {
    let cleanUrl = url.replace(/!\d+(x\d+)?$/, "");
    const queryIndex = cleanUrl.indexOf("?");
    if (queryIndex !== -1 && /(^|&)expandable=/.test(cleanUrl.substring(queryIndex + 1))) {
        cleanUrl = cleanUrl.substring(0, queryIndex);
    }
    return toAbsoluteUrl(cleanUrl, baseUrl);
};

const escapeLinkText = (text: string) => text.replace(/([\\[\]])/g, "\\$1").replace(/\s+/g, " ").trim();

const getAttribute = (node: MarkdownNode, name: string): string | undefined => {
    const attribute = node.attributes?.find((candidate) => candidate.type === "mdxJsxAttribute" && candidate.name === name);
    if (!attribute) {
        return undefined;
    }
    if (attribute.value === null || attribute.value === undefined) {
        return "true";
    }
    if (typeof attribute.value === "string") {
        return attribute.value;
    }
    return attribute.value.value.trim().replace(/^(["'`])([\s\S]*)\1$/, "$2");
};

const absolutizeHtmlUrls = (html: string, baseUrl: string) => {
    return html.replace(/\b(src|href|poster)=(["'])(\/(?!\/)[^"']*)\2/g, (_, attribute, quote, url) => `${attribute}=${quote}${baseUrl}${url}${quote}`);
};

/**
 * Converts documentation MDX (without frontmatter) to portable markdown: custom components such as
 * `<Playground>` become plain links, site-relative URLs become absolute, and MDX-only syntax is removed.
 * Everything else is kept byte-for-byte so code samples and formatting are untouched.
 */
export const convertMdxToMarkdown = (source: string, options: MarkdownConversionOptions = {}): string => {
    const baseUrl = options.baseUrl ?? agentDocsBaseUrl;

    let tree: MarkdownNode;
    try {
        tree = parser.parse(source) as MarkdownNode;
    } catch {
        return source;
    }

    const lineStartOf = (offset: number) => source.lastIndexOf("\n", offset - 1) + 1;

    /** Prefix that continuation lines of a multi-line replacement need to stay inside the same list item or blockquote. */
    const continuationPrefix = (offset: number) => source.substring(lineStartOf(offset), offset).replace(/[^\s>]/g, " ");

    const indentContinuationLines = (text: string, offset: number) => {
        const prefix = continuationPrefix(offset);
        return text
            .split("\n")
            .map((line, index) => (index === 0 || !line ? line : prefix + line))
            .join("\n");
    };

    const renderChildren = (node: MarkdownNode) => {
        const children = node.children || [];
        if (!children.length) {
            return "";
        }
        const start = startOf(children[0]);
        const end = endOf(children[children.length - 1]);
        if (start === undefined || end === undefined) {
            return "";
        }
        // Children of a flow element are indented relative to the element itself; remove that shared indentation.
        const childIndent = source.substring(lineStartOf(start), start);
        const rendered = renderRange(start, end, children);
        if (!/^\s+$/.test(childIndent)) {
            return rendered;
        }
        return rendered
            .split("\n")
            .map((line) => (line.startsWith(childIndent) ? line.substring(childIndent.length) : line))
            .join("\n");
    };

    const renderExample = (node: MarkdownNode, isFlow: boolean, parent?: MarkdownNode) => {
        const exampleType = exampleTypes[(node.name || "").toLowerCase()];
        const id = getAttribute(node, "playgroundId") || getAttribute(node, "id") || "";
        const url = getExampleLink(
            {
                type: exampleType.type,
                id,
                engine: getAttribute(node, "engine") as IExampleLink["engine"],
                snapshot: getAttribute(node, "snapshot"),
                version: getAttribute(node, "version"),
            },
            false,
        );
        const title = getAttribute(node, "title");
        const description = getAttribute(node, "description");
        const label = escapeLinkText(title ? `${exampleType.label}: ${title}` : `${exampleType.label} ${id}`);
        const listMarker = isFlow && parent?.type === "root" ? "- " : "";
        return `${listMarker}[${label}](${url})${description && description !== title ? ` - ${description.replace(/\s+/g, " ").trim()}` : ""}`;
    };

    const renderEmbedLink = (label: string, title: string | undefined, url: string) => `[${escapeLinkText(title ? `${label}: ${title}` : label)}](${url})`;

    const renderAlert = (node: MarkdownNode, isFlow: boolean, offset: number) => {
        const kind = alertKinds[(getAttribute(node, "severity") || "info").toLowerCase()] || "NOTE";
        const title = getAttribute(node, "title");
        const description = getAttribute(node, "description");
        const body = renderChildren(node).trim();
        const parts = [title ? `**${title.trim()}**` : "", description ? absolutizeHtmlUrls(description.trim(), baseUrl) : "", body].filter(Boolean);

        if (!isFlow) {
            return `**${kind === "WARNING" || kind === "CAUTION" ? "Warning" : "Note"}:** ${parts.join(" ")}`;
        }

        const lines = [`[!${kind}]`, ...parts.join("\n\n").split("\n")];
        return indentContinuationLines(lines.map((line) => (line ? `> ${line}` : ">")).join("\n"), offset);
    };

    const renderJsxElement = (node: MarkdownNode, offset: number, parent?: MarkdownNode): string | undefined => {
        const lowerName = (node.name || "").toLowerCase();
        const isFlow = node.type === "mdxJsxFlowElement";

        if (exampleTypes[lowerName]) {
            return renderExample(node, isFlow, parent);
        }

        switch (lowerName) {
            case "youtube": {
                const id = getAttribute(node, "id") || getAttribute(node, "url") || "";
                return renderEmbedLink("YouTube video", getAttribute(node, "title"), id.startsWith("http") ? id : `https://www.youtube.com/watch?v=${id}`);
            }
            case "media":
                return renderEmbedLink("Media", getAttribute(node, "title"), toAbsoluteUrl(getAttribute(node, "url") || getAttribute(node, "id") || "", baseUrl));
            case "codepen":
                return renderEmbedLink("CodePen", getAttribute(node, "title"), `https://codepen.io/BabylonJS/pen/${getAttribute(node, "pen")}/`);
            case "codesandbox":
                return renderEmbedLink("CodeSandbox", getAttribute(node, "title"), `https://codesandbox.io/s/${getAttribute(node, "id")}`);
            case "alert":
                return renderAlert(node, isFlow, offset);
            case "img": {
                const src = getAttribute(node, "src");
                if (!src) {
                    return "";
                }
                const alt = getAttribute(node, "alt") || getAttribute(node, "title") || "";
                return `![${escapeLinkText(alt)}](${normalizeImageUrl(src, baseUrl)})`;
            }
            case "h2image":
            case "h3image": {
                const heading = `${lowerName === "h2image" ? "##" : "###"} ${getAttribute(node, "title") || renderChildren(node).trim()}`;
                const image = getAttribute(node, "image");
                const alt = escapeLinkText(getAttribute(node, "alt") || getAttribute(node, "title") || "");
                return indentContinuationLines(image ? `${heading}\n\n![${alt}](${normalizeImageUrl(image, baseUrl)})` : heading, offset);
            }
            case "codevariants":
                return indentContinuationLines(renderChildren(node), offset);
            case "codevariant": {
                const label = getAttribute(node, "label") || getAttribute(node, "variant");
                const children = renderChildren(node);
                return indentContinuationLines(label ? `**${label}**\n\n${children}` : children, offset);
            }
        }

        return undefined;
    };

    const collectReplacements = (node: MarkdownNode, replacements: Replacement[], parent?: MarkdownNode) => {
        const start = startOf(node);
        const end = endOf(node);
        if (start === undefined || end === undefined) {
            return;
        }

        switch (node.type) {
            case "mdxjsEsm":
                replacements.push({ start, end, value: "" });
                return;
            case "mdxFlowExpression":
            case "mdxTextExpression":
                if (/^\s*\/\*[\s\S]*\*\/\s*$/.test(node.value || "")) {
                    replacements.push({ start, end, value: "" });
                }
                return;
            case "link":
            case "image":
            case "definition": {
                const url = node.url || "";
                const absoluteUrl = node.type === "image" ? normalizeImageUrl(url, baseUrl) : toAbsoluteUrl(url, baseUrl);
                if (absoluteUrl !== url) {
                    const nodeSource = source.substring(start, end);
                    const markerIndex = nodeSource.lastIndexOf(node.type === "definition" ? "]:" : "](");
                    const urlIndex = markerIndex === -1 ? -1 : nodeSource.indexOf(url, markerIndex);
                    if (urlIndex !== -1) {
                        replacements.push({ start: start + urlIndex, end: start + urlIndex + url.length, value: absoluteUrl });
                    }
                }
                break;
            }
            case "mdxJsxFlowElement":
            case "mdxJsxTextElement": {
                const name = node.name || "";
                const converted = renderJsxElement(node, start, parent);
                if (converted !== undefined) {
                    replacements.push({ start, end, value: converted });
                    return;
                }
                if (!name || /^[A-Z]/.test(name)) {
                    options.onUnknownComponent?.(name || "<>");
                    replacements.push({ start, end, value: indentContinuationLines(renderChildren(node), start) });
                    return;
                }
                // Plain HTML elements are valid markdown; only make their URLs absolute.
                const openingTagEnd = node.children?.length ? (startOf(node.children[0]) ?? end) : end;
                const openingTag = source.substring(start, openingTagEnd);
                node.attributes?.forEach((attribute) => {
                    if (!attribute.name || !htmlUrlAttributes.has(attribute.name.toLowerCase()) || typeof attribute.value !== "string") {
                        return;
                    }
                    const absoluteUrl = toAbsoluteUrl(attribute.value, baseUrl);
                    const valueIndex = absoluteUrl === attribute.value ? -1 : openingTag.indexOf(attribute.value, openingTag.indexOf(attribute.name));
                    if (valueIndex !== -1) {
                        replacements.push({ start: start + valueIndex, end: start + valueIndex + attribute.value.length, value: absoluteUrl });
                    }
                });
                break;
            }
        }

        node.children?.forEach((child) => collectReplacements(child, replacements, node));
    };

    const renderRange = (start: number, end: number, nodes: MarkdownNode[], parent?: MarkdownNode) => {
        const replacements: Replacement[] = [];
        nodes.forEach((node) => collectReplacements(node, replacements, parent));
        replacements.sort((left, right) => left.start - right.start);

        let result = "";
        let cursor = start;
        replacements.forEach((replacement) => {
            if (replacement.start < cursor || replacement.end > end) {
                return;
            }
            result += source.substring(cursor, replacement.start) + replacement.value;
            cursor = replacement.end;
        });
        return result + source.substring(cursor, end);
    };

    const converted = renderRange(0, source.length, tree.children || [], tree);
    return `${converted.replace(/\n{3,}/g, "\n\n").trim()}\n`;
};

export const getMarkdownPath = (route: string) => (route === "/" ? "/index.md" : `${route}.md`);

export const getMarkdownUrl = (route: string, baseUrl = agentDocsBaseUrl) => `${baseUrl}${getMarkdownPath(route)}`;

const getDescription = (page: ContentGraphPage) => {
    const description = page.metadata.description?.replace(/\s+/g, " ").trim() || "";
    return description === `Documentation page for ${page.metadata.title}` ? "" : description;
};

const linkListItem = (title: string, url: string, baseUrl: string) => {
    const resolvedUrl = toAbsoluteUrl(url, baseUrl);
    return `- [${escapeLinkText(title || resolvedUrl)}](${resolvedUrl})`;
};

const renderReferenceList = (items: Array<string | { title: string; url: string }> | undefined, baseUrl: string) => {
    return (items || []).map((item) => (typeof item === "string" ? linkListItem(item, item, baseUrl) : linkListItem(item.title, item.url, baseUrl))).join("\n");
};

export interface RenderPageMarkdownOptions extends MarkdownConversionOptions {
    graph?: ContentGraph;
}

/** Renders a documentation page as a standalone markdown document. */
export const renderPageMarkdown = (page: ContentGraphPage, options: RenderPageMarkdownOptions = {}): string => {
    const baseUrl = options.baseUrl ?? agentDocsBaseUrl;
    const body = convertMdxToMarkdown(page.rawContent, options).trim();
    const sections: string[] = [];

    if (!/^#\s/.test(body)) {
        sections.push(`# ${page.metadata.title}`);
    }

    const description = getDescription(page);
    if (description) {
        sections.push(`> ${description}`);
    }

    sections.push(`Source: ${baseUrl}${page.route}`);

    if (page.metadata.videoOverview) {
        sections.push(`Video overview: https://www.youtube.com/watch?v=${page.metadata.videoOverview}`);
    }

    if (body) {
        sections.push(body);
    }

    if (page.metadata.videoContent?.length) {
        sections.push(`## Videos\n\n${renderReferenceList(page.metadata.videoContent, baseUrl)}`);
    }

    if (page.furtherReading?.length) {
        sections.push(`## Further reading\n\n${renderReferenceList(page.furtherReading, baseUrl)}`);
    }

    const childPages = page.childIds
        .map((id) => options.graph?.pagesByRoute[`/${id.join("/")}`])
        .filter((child): child is ContentGraphPage => !!child?.contentPath);
    if (childPages.length) {
        const items = childPages.map((child) => {
            const childDescription = getDescription(child);
            return `${linkListItem(child.metadata.title, getMarkdownUrl(child.route, baseUrl), baseUrl)}${childDescription ? `: ${childDescription}` : ""}`;
        });
        sections.push(`## Pages in this section\n\n${items.join("\n")}`);
    }

    return `${sections.join("\n\n")}\n`;
};

export interface AgentDocsSection {
    title: string;
    pages: ContentGraphPage[];
    /** Depth of the section's top-level pages; deeper pages are indented relative to it. */
    baseDepth: number;
}

export interface LlmsTxtOptions {
    baseUrl?: string;
    sections: AgentDocsSection[];
    /**
     * Number of hierarchy levels listed per section. Deeper pages are reachable through the
     * "Pages in this section" list of their parent's markdown, so they are only listed here when that parent has no markdown page.
     */
    maxDepth?: number;
}

export const defaultLlmsTxtDepth = 3;

/** Builds an llms.txt index (https://llmstxt.org) that links to the markdown version of the documentation pages. */
export const createLlmsTxt = ({ baseUrl = agentDocsBaseUrl, sections, maxDepth = defaultLlmsTxtDepth }: LlmsTxtOptions) => {
    const markdownRoutes = new Set(sections.flatMap((section) => section.pages.filter((page) => !!page.contentPath).map((page) => page.route)));
    const isListed = (page: ContentGraphPage, relativeDepth: number) => relativeDepth < maxDepth || !markdownRoutes.has(`/${page.id.slice(0, -1).join("/")}`);

    const lines = [
        "# Babylon.js Documentation",
        "",
        "> Babylon.js is a powerful, beautiful, simple, and open game and rendering engine packed into a friendly JavaScript framework. This file indexes the official Babylon.js documentation.",
        "",
        `Every documentation page is available as markdown by appending \`.md\` to its URL (for example ${baseUrl}/setup/starterHTML.md). The links below point to those markdown versions. This index lists the top ${maxDepth} levels of each section; every page's markdown ends with a "Pages in this section" list linking to its subpages.`,
        "",
        `- API reference: ${baseUrl}/typedoc`,
        "- Playground (live code examples linked from the docs): https://playground.babylonjs.com",
        "- Source code: https://github.com/BabylonJS/Babylon.js",
        "- Community forum: https://forum.babylonjs.com",
    ];

    sections.forEach((section) => {
        const items = section.pages
            .map((page) => ({ page, relativeDepth: Math.max(0, page.id.length - section.baseDepth) }))
            .filter(({ page, relativeDepth }) => isListed(page, relativeDepth))
            .map(({ page, relativeDepth }) => {
                const description = getDescription(page);
                const title = escapeLinkText(page.metadata.title);
                const entry = page.contentPath ? `[${title}](${getMarkdownUrl(page.route, baseUrl)})${description ? `: ${description}` : ""}` : title;
                return `${"  ".repeat(relativeDepth)}- ${entry}`;
            });
        if (items.length) {
            lines.push("", `## ${section.title}`, "", ...items);
        }
    });

    return `${lines.join("\n")}\n`;
};

/**
 * Groups pages for llms.txt. Without a title, pages below `rootDepth` are grouped by their top-level section.
 * With a title, all pages at or below `rootDepth` form a single section.
 * Pages without content are kept only when they contain pages that have content, to preserve the hierarchy.
 */
export const getAgentDocsSections = (graph: ContentGraph, options: { rootDepth?: number; title?: string } = {}): AgentDocsSection[] => {
    const rootDepth = options.rootDepth ?? 0;
    const renderableRoutes = graph.pages.filter((page) => !!page.contentPath).map((page) => page.route);
    const isListed = (page: ContentGraphPage) => !!page.contentPath || renderableRoutes.some((route) => route.startsWith(`${page.route}/`));

    if (options.title) {
        return [{ title: options.title, pages: graph.pages.filter((page) => page.id.length >= rootDepth && isListed(page)), baseDepth: rootDepth }];
    }

    const sections = new Map<string, AgentDocsSection>();
    graph.pages
        .filter((page) => page.id.length > rootDepth && isListed(page))
        .forEach((page) => {
            const sectionKey = page.id[rootDepth];
            if (!sections.has(sectionKey)) {
                const sectionPage = graph.pagesByRoute[`/${page.id.slice(0, rootDepth + 1).join("/")}`];
                sections.set(sectionKey, { title: sectionPage?.metadata.title || sectionKey, pages: [], baseDepth: rootDepth + 1 });
            }
            sections.get(sectionKey)!.pages.push(page);
        });

    return Array.from(sections.values());
};
