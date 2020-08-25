export interface DocMenuItem {
    id: number;
    name: string;
    friendlyName: string;
    children?: DocMenuItem[];
}

export interface MarkdownMetadata {
    title: string;
    description: string;
    keywords: string;
    imageUrl?: string;
    categoryId?: number;
    categoryName?: string;
    // modifiers
    
    /**
     * Should the titles be in Tabs (tutorials, for example)
     */
    tabbed?: boolean;
}
