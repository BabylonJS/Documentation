import { createContext, FunctionComponent, PropsWithChildren } from "react";

import { IExampleLink, ITableOfContentsItem } from "../../lib/content.interfaces";

export interface DocumentationPageContext {
    exampleLinks: IExampleLink[];
    addExampleLink: (_link: IExampleLink) => void;
    setActiveExample: (_link: IExampleLink | null) => void;
    addTOCItem: (_tocItem: ITableOfContentsItem) => void;
    activeTOCItem: ITableOfContentsItem | null;
    setActiveTOCItem: (_tocItem: ITableOfContentsItem) => void;
}

export interface DocumentationExamplesState {
    exampleLinks: IExampleLink[];
    addExampleLink: (_link: IExampleLink) => void;
    setActiveExample: (_link: IExampleLink | null) => void;
}

export interface DocumentationTableOfContentsState {
    addTOCItem: (_tocItem: ITableOfContentsItem) => void;
    activeTOCItem: ITableOfContentsItem | null;
    setActiveTOCItem: (_tocItem: ITableOfContentsItem) => void;
}

export const DocumentationContext = createContext<DocumentationPageContext>({
    exampleLinks: [],
    addExampleLink: (_link: IExampleLink) => {},
    setActiveExample: (_link: IExampleLink | null) => {},
    addTOCItem: (_tocItem: ITableOfContentsItem) => {},
    activeTOCItem: null,
    setActiveTOCItem: (_tocItem: ITableOfContentsItem) => {},
});

export const createDocumentationContextValue = (examples: DocumentationExamplesState, tableOfContents: DocumentationTableOfContentsState): DocumentationPageContext => ({
    exampleLinks: examples.exampleLinks,
    addExampleLink: examples.addExampleLink,
    setActiveExample: examples.setActiveExample,
    addTOCItem: tableOfContents.addTOCItem,
    activeTOCItem: tableOfContents.activeTOCItem,
    setActiveTOCItem: tableOfContents.setActiveTOCItem,
});

export const DocumentationContextProvider: FunctionComponent<PropsWithChildren<{ examples: DocumentationExamplesState; tableOfContents: DocumentationTableOfContentsState }>> = ({ examples, tableOfContents, children }) => {
    return <DocumentationContext.Provider value={createDocumentationContextValue(examples, tableOfContents)}>{children}</DocumentationContext.Provider>;
};
