import { useCallback, useState } from "react";

import { ITableOfContentsItem } from "../../lib/content.interfaces";
import { DocumentationTableOfContentsState } from "./DocumentationContext";

export interface DocsTableOfContentsState extends DocumentationTableOfContentsState {
    tocLinks: ITableOfContentsItem[];
    clearTOCItems: () => void;
}

export const addUniqueTableOfContentsItem = (items: ITableOfContentsItem[], item: ITableOfContentsItem) => {
    return items.some((existingItem) => existingItem.id === item.id) ? items : [...items, item];
};

export const useDocsTableOfContents = (): DocsTableOfContentsState => {
    const [tocLinks, setTocLinks] = useState<ITableOfContentsItem[]>([]);
    const [activeTOCItem, setActiveTOCItem] = useState<ITableOfContentsItem | null>(null);

    const addTOCItem = useCallback((tocItem: ITableOfContentsItem) => {
        setTocLinks((currentLinks) => addUniqueTableOfContentsItem(currentLinks, tocItem));
    }, []);

    const clearTOCItems = useCallback(() => {
        setTocLinks([]);
    }, []);

    return {
        tocLinks,
        activeTOCItem,
        setActiveTOCItem,
        addTOCItem,
        clearTOCItems,
    };
};
