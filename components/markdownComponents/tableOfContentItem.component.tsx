import { FunctionComponent, useContext, useEffect } from "react";
import { ITableOfContentsItem } from "../../lib/content.interfaces";
import { DocumentationContext } from "../../pages/[...id]";

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const TOCMarkdownComponent: FunctionComponent<ITableOfContentsItem> = (item) => {
    const context = useContext(DocumentationContext);

    useEffect(() => {
        context.addTOCItem({ ...item, title: item.children as string });
    }, []);

    switch (item.level) {
        case 0:
            return <h1 {...item}>{item.children}</h1>;
        case 1:
            return <h2 {...item}>{item.children}</h2>;
        case 2:
            return <h3 {...item}>{item.children}</h3>;
        case 3:
            return <h4 {...item}>{item.children}</h4>;
    }
    return <></>;
};

export const H1MarkdownComponent: FunctionComponent<ITableOfContentsItem> = (item) => {
    return <TOCMarkdownComponent {...item} level={0}></TOCMarkdownComponent>;
};

export const H2MarkdownComponent: FunctionComponent<ITableOfContentsItem> = (item) => {
    return <TOCMarkdownComponent {...item} level={1}></TOCMarkdownComponent>;
};

export const H3MarkdownComponent: FunctionComponent<ITableOfContentsItem> = (item) => {
    return <TOCMarkdownComponent {...item} level={2}></TOCMarkdownComponent>;
};

export const H4MarkdownComponent: FunctionComponent<ITableOfContentsItem> = (item) => {
    return <TOCMarkdownComponent {...item} level={3}></TOCMarkdownComponent>;
};