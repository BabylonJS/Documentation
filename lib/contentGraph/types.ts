import { IDocMenuItem, MarkdownMetadata } from "../interfaces";

export interface ContentGraphBreadcrumb {
    name: string;
    url: string;
}

export interface ContentGraphExampleReference {
    type: "pg" | "nme" | "nge" | "sfe" | "nrge";
    id: string;
    imageUrl?: string;
    engine?: "webgpu" | "webgl2" | "webgl1";
    snapshot?: string;
    title?: string;
    description?: string;
    category?: string;
    isMain?: boolean;
}

export interface ContentGraphPage {
    id: string[];
    route: string;
    docItem: IDocMenuItem;
    contentPath?: string;
    sourcePath?: string;
    rawContent: string;
    frontmatter: Record<string, unknown>;
    metadata: MarkdownMetadata;
    breadcrumbs: ContentGraphBreadcrumb[];
    childIds: string[][];
    previousId?: string[];
    nextId?: string[];
    furtherReading: MarkdownMetadata["furtherReading"];
    internalLinks: string[];
    examples: ContentGraphExampleReference[];
    lastModified?: Date;
    gitHubUrl?: string;
}

export interface ContentGraphRouteParams {
    params: {
        id: string[];
        content?: string;
    };
}

export interface ContentGraph {
    pages: ContentGraphPage[];
    pagesByRoute: Record<string, ContentGraphPage>;
    pagesByContentPath: Record<string, ContentGraphPage[]>;
    routeManifest: ContentGraphRouteParams[];
}
