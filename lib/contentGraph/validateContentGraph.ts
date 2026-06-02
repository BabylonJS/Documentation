import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

import redirectsConfig from "../../redirects.json";
import { IDocMenuItem } from "../interfaces";
import { buildContentGraph, getContentGraph } from "./buildContentGraph";
import { documentationStructure } from "./loadStructure";
import { ContentGraph, ContentGraphPage } from "./types";

export type ContentValidationSeverity = "error" | "warning";

export interface ContentValidationIssue {
    severity: ContentValidationSeverity;
    code: string;
    message: string;
    route?: string;
    sourcePath?: string;
    structurePath?: string;
}

export interface ContentValidationReport {
    isValid: boolean;
    issues: ContentValidationIssue[];
    errors: ContentValidationIssue[];
    warnings: ContentValidationIssue[];
    checkedPages: number;
    checkedMarkdownFiles: number;
}

export interface ContentValidationOptions {
    contentRoot?: string;
    graph?: ContentGraph;
    structure?: IDocMenuItem;
}

const contentRootDefault = "content";

const allowedStructureKeys = new Set(["friendlyName", "content", "metadataOverrides", "children", "navOverrides"]);
const allowedFrontmatterKeys = new Set(["title", "description", "keywords", "image", "image-url", "imageUrl", "category-id", "category-name", "video-overview", "robots", "toc-levels", "video-content", "further-reading"]);
const allowedMetadataOverrideKeys = new Set(["title", "description", "keywords", "imageUrl", "categoryId", "categoryName", "videoOverview", "robots", "tocLevels", "videoContent", "furtherReading"]);
const allowedExampleEngines = new Set(["webgpu", "webgl2", "webgl1"]);
const allowedDuplicateContentPaths = new Set(["features/featuresDeepDive/physics"]);
const redirectSources = new Set((redirectsConfig.redirects || []).map((redirect) => redirect.source.replace(/\/$/, "") || "/"));

const createIssue = (severity: ContentValidationSeverity, code: string, message: string, context: Partial<ContentValidationIssue> = {}): ContentValidationIssue => ({
    severity,
    code,
    message,
    ...context,
});

const isPlainObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown) => typeof value === "string" && value.trim().length > 0;

const toStructurePath = (id: string[]) => (id.length ? `/${id.join("/")}` : "/");

const normalizeRoute = (route: string) => {
    const withSlash = route.startsWith("/") ? route : `/${route}`;
    return withSlash.replace(/\/$/, "") || "/";
};

const getMarkdownFiles = (contentRoot: string) => {
    const files: string[] = [];

    const traverse = (directory: string) => {
        if (!existsSync(directory)) {
            return;
        }

        readdirSync(directory).forEach((file) => {
            const fullPath = join(directory, file);
            if (statSync(fullPath).isDirectory()) {
                traverse(fullPath);
            } else if (file.endsWith(".md")) {
                files.push(fullPath.replace(/\\/g, "/").replace(`${contentRoot.replace(/\\/g, "/")}/`, "").replace(/\.md$/, ""));
            }
        });
    };

    traverse(contentRoot);
    return files;
};

const validateTextField = (value: unknown, fieldName: string, page: ContentGraphPage, issues: ContentValidationIssue[], allowNull = false) => {
    if (allowNull && value === null) {
        return;
    }
    if (!isString(value)) {
        issues.push(createIssue("error", "invalid-frontmatter-field", `Frontmatter field '${fieldName}' must be a non-empty string.`, { route: page.route, sourcePath: page.sourcePath }));
    }
};

const validateLinkedListField = (value: unknown, fieldName: string, page: ContentGraphPage, issues: ContentValidationIssue[]) => {
    if (value === null || value === undefined) {
        return;
    }
    if (!Array.isArray(value)) {
        issues.push(createIssue("error", "invalid-frontmatter-list", `Frontmatter field '${fieldName}' must be a list of URLs or { title, url } objects.`, { route: page.route, sourcePath: page.sourcePath }));
        return;
    }

    value.forEach((item, index) => {
        if (typeof item === "string") {
            if (!item.trim()) {
                issues.push(createIssue("error", "invalid-frontmatter-list-item", `Frontmatter field '${fieldName}' item ${index + 1} must not be blank.`, { route: page.route, sourcePath: page.sourcePath }));
            }
            return;
        }
        if (!isPlainObject(item) || !isString(item.title) || !isString(item.url)) {
            issues.push(createIssue("error", "invalid-frontmatter-list-item", `Frontmatter field '${fieldName}' item ${index + 1} must be a URL string or an object with non-empty title and url strings.`, { route: page.route, sourcePath: page.sourcePath }));
        }
    });
};

const getProp = (source: string, prop: string) => {
    const match = new RegExp(`${prop}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`).exec(source);
    return match ? match[1] || match[2] : undefined;
};

const validateExampleComponents = (page: ContentGraphPage, issues: ContentValidationIssue[]) => {
    const matches = Array.from(page.rawContent.matchAll(/<(Playground|NME|nme|NGE|nge|SFE|sfe|NRGE|nrge)\b([^>]*)\/>/g));
    matches.forEach(([full, componentName]) => {
        const id = getProp(full, "id");
        if (!id || !id.trim()) {
            issues.push(createIssue("warning", "missing-example-id", `${componentName} component should include a non-empty id prop unless it intentionally opens the default editor.`, { route: page.route, sourcePath: page.sourcePath }));
        }

        if (!getProp(full, "title")) {
            issues.push(createIssue("warning", "missing-example-title", `${componentName} component should include a title prop for search and preview metadata.`, { route: page.route, sourcePath: page.sourcePath }));
        }

        if (!getProp(full, "description")) {
            issues.push(createIssue("warning", "missing-example-description", `${componentName} component should include a description prop for search and preview metadata.`, { route: page.route, sourcePath: page.sourcePath }));
        }

        const engine = getProp(full, "engine");
        if (engine && !allowedExampleEngines.has(engine)) {
            issues.push(createIssue("error", "invalid-example-engine", `${componentName} component engine prop must be one of: ${Array.from(allowedExampleEngines).join(", ")}.`, { route: page.route, sourcePath: page.sourcePath }));
        }
    });
};

const validateFrontmatter = (page: ContentGraphPage, issues: ContentValidationIssue[]) => {
    Object.entries(page.frontmatter).forEach(([key, value]) => {
        if (!allowedFrontmatterKeys.has(key)) {
            issues.push(createIssue("error", "unknown-frontmatter-field", `Unknown frontmatter field '${key}'.`, { route: page.route, sourcePath: page.sourcePath }));
            return;
        }

        switch (key) {
            case "title":
            case "description":
            case "keywords":
                validateTextField(value, key, page, issues);
                break;
            case "image":
            case "image-url":
            case "imageUrl":
            case "category-name":
            case "video-overview":
            case "robots":
                validateTextField(value, key, page, issues, true);
                break;
            case "category-id":
            case "toc-levels":
                if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
                    issues.push(createIssue("error", "invalid-frontmatter-number", `Frontmatter field '${key}' must be a non-negative integer.`, { route: page.route, sourcePath: page.sourcePath }));
                }
                break;
            case "video-content":
            case "further-reading":
                validateLinkedListField(value, key, page, issues);
                break;
        }
    });
};

const validateInternalLinks = (graph: ContentGraph, page: ContentGraphPage, issues: ContentValidationIssue[]) => {
    page.internalLinks.forEach((link) => {
        const route = normalizeRoute(link);
        if (graph.pagesByRoute[route]) {
            return;
        }

        if (redirectSources.has(route)) {
            issues.push(createIssue("warning", "redirected-internal-link", `Internal link '${route}' is covered by a redirect; prefer linking to the redirect destination.`, { route: page.route, sourcePath: page.sourcePath }));
            return;
        }

        issues.push(createIssue("error", "unresolved-internal-link", `Internal link '${route}' does not resolve to a documentation route or redirect.`, { route: page.route, sourcePath: page.sourcePath }));
    });
};

export const createContentValidationReport = (issues: ContentValidationIssue[], checkedPages = 0, checkedMarkdownFiles = 0): ContentValidationReport => {
    const errors = issues.filter((issue) => issue.severity === "error");
    const warnings = issues.filter((issue) => issue.severity === "warning");
    return {
        isValid: errors.length === 0,
        issues,
        errors,
        warnings,
        checkedPages,
        checkedMarkdownFiles,
    };
};

export const validateDocumentationStructure = (structure: IDocMenuItem = documentationStructure, options: Pick<ContentValidationOptions, "contentRoot"> = {}) => {
    const contentRoot = options.contentRoot || contentRootDefault;
    const issues: ContentValidationIssue[] = [];
    const referencedContentPaths = new Map<string, string[]>();
    let checkedPages = 0;

    const validateItem = (item: IDocMenuItem, id: string[]) => {
        checkedPages += 1;
        const structurePath = toStructurePath(id);

        Object.keys(item as unknown as Record<string, unknown>).forEach((key) => {
            if (!allowedStructureKeys.has(key)) {
                issues.push(createIssue("error", "unknown-structure-field", `Unknown structure field '${key}'.`, { structurePath }));
            }
        });

        if (!isString(item.friendlyName)) {
            issues.push(createIssue("error", "missing-friendly-name", "Structure item must include a non-empty friendlyName.", { structurePath }));
        }

        if (item.content !== undefined && item.content !== "") {
            if (!isString(item.content)) {
                issues.push(createIssue("error", "invalid-content-reference", "Structure content must be a non-empty string when provided.", { structurePath }));
            } else {
                const references = referencedContentPaths.get(item.content) || [];
                references.push(structurePath);
                referencedContentPaths.set(item.content, references);

                if (!existsSync(join(contentRoot, `${item.content}.md`))) {
                    issues.push(createIssue("error", "missing-content-file", `Referenced markdown file '${item.content}.md' does not exist.`, { structurePath }));
                }
            }
        }

        if (item.metadataOverrides !== undefined) {
            if (!isPlainObject(item.metadataOverrides)) {
                issues.push(createIssue("error", "invalid-metadata-overrides", "metadataOverrides must be an object when provided.", { structurePath }));
            } else {
                Object.keys(item.metadataOverrides).forEach((key) => {
                    if (!allowedMetadataOverrideKeys.has(key)) {
                        issues.push(createIssue("error", "unknown-metadata-override", `Unknown metadataOverrides field '${key}'.`, { structurePath }));
                    }
                });
            }
        }

        if (item.navOverrides !== undefined) {
            if (!isPlainObject(item.navOverrides)) {
                issues.push(createIssue("error", "invalid-nav-overrides", "navOverrides must be an object when provided.", { structurePath }));
            } else {
                Object.entries(item.navOverrides).forEach(([key, value]) => {
                    if (key !== "next" && key !== "previous") {
                        issues.push(createIssue("error", "unknown-nav-override", `Unknown navOverrides field '${key}'.`, { structurePath }));
                    }
                    if (value !== undefined && typeof value !== "string") {
                        issues.push(createIssue("error", "invalid-nav-override", `navOverrides.${key} must be a string when provided.`, { structurePath }));
                    }
                });
            }
        }

        if (item.children !== undefined) {
            if (!isPlainObject(item.children)) {
                issues.push(createIssue("error", "invalid-children", "children must be an object when provided.", { structurePath }));
            } else {
                Object.entries(item.children).forEach(([key, child]) => validateItem(child, [...id, key]));
            }
        }
    };

    validateItem(structure, []);

    referencedContentPaths.forEach((references, contentPath) => {
        if (references.length > 1) {
            const severity = allowedDuplicateContentPaths.has(contentPath) ? "warning" : "error";
            issues.push(createIssue(severity, "duplicate-content-reference", `Markdown file '${contentPath}.md' is referenced by multiple structure entries: ${references.join(", ")}.`));
        }
    });

    const markdownFiles = getMarkdownFiles(contentRoot);
    const referencedContentSet = new Set(referencedContentPaths.keys());
    markdownFiles.forEach((contentPath) => {
        if (!referencedContentSet.has(contentPath)) {
            issues.push(createIssue("error", "unreferenced-content-file", `Markdown file '${contentPath}.md' is not referenced by structure.json.`));
        }
    });

    return createContentValidationReport(issues, checkedPages, markdownFiles.length);
};

export const validateContentGraph = (graph: ContentGraph) => {
    const issues: ContentValidationIssue[] = [];
    const contentReferences = new Map<string, string[]>();

    graph.pages.forEach((page) => {
        if (page.contentPath) {
            const routes = contentReferences.get(page.contentPath) || [];
            routes.push(page.route);
            contentReferences.set(page.contentPath, routes);
        }

        validateFrontmatter(page, issues);
        validateInternalLinks(graph, page, issues);
        validateExampleComponents(page, issues);
    });

    contentReferences.forEach((routes, contentPath) => {
        if (routes.length > 1) {
            const severity = allowedDuplicateContentPaths.has(contentPath) ? "warning" : "error";
            issues.push(createIssue(severity, "duplicate-content-reference", `Markdown content '${contentPath}.md' is used by multiple routes: ${routes.join(", ")}.`));
        }
    });

    return createContentValidationReport(issues, graph.pages.length, Object.keys(graph.pagesByContentPath).length);
};

export const validateDocumentationContent = (options: ContentValidationOptions = {}) => {
    const structure = options.structure || documentationStructure;
    const structureReport = validateDocumentationStructure(structure, options);

    if (!structureReport.isValid) {
        return structureReport;
    }

    try {
        const graph = options.graph || (options.structure ? buildContentGraph(structure) : getContentGraph());
        const graphReport = validateContentGraph(graph);
        return createContentValidationReport([...structureReport.issues, ...graphReport.issues], graphReport.checkedPages, structureReport.checkedMarkdownFiles);
    } catch (error) {
        return createContentValidationReport(
            [
                ...structureReport.issues,
                createIssue("error", "content-graph-build-failed", error instanceof Error ? error.message : "Content graph build failed."),
            ],
            structureReport.checkedPages,
            structureReport.checkedMarkdownFiles,
        );
    }
};

export const formatContentValidationReport = (report: ContentValidationReport) => {
    const lines = [`Content validation ${report.isValid ? "passed" : "failed"}: ${report.checkedPages} pages, ${report.checkedMarkdownFiles} markdown files, ${report.errors.length} errors, ${report.warnings.length} warnings.`];

    const displayedIssues = [...report.errors, ...report.warnings.slice(0, 25)];
    displayedIssues.forEach((issue) => {
        const location = [issue.sourcePath, issue.route, issue.structurePath].filter(Boolean).join(" ");
        lines.push(`${issue.severity.toUpperCase()} ${issue.code}${location ? ` (${location})` : ""}: ${issue.message}`);
    });

    if (report.warnings.length > 25) {
        lines.push(`... ${report.warnings.length - 25} additional warning(s) omitted.`);
    }

    return lines.join("\n");
};
