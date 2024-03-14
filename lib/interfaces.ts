export interface IDocMenuItem {
    // id: number;
    // uniqueName: string;
    friendlyName: string;
    content?: string;
    metadataOverrides?: Partial<MarkdownMetadata>;
    children?: { [uniqueName: string]: IDocMenuItem };
    navOverrides?: {
        next?: string;
        previous?: string;
    };
}

export interface MarkdownMetadata {
    title: string;
    description: string;
    keywords: string;
    imageUrl?: string;
    categoryId?: number;
    categoryName?: string;
    videoOverview?: string;
    robots?: string;
    tocLevels?: number;
    videoContent?: Array<string | { title: string; url: string }>;
    furtherReading?: Array<string | { title: string; url: string }>;
}
