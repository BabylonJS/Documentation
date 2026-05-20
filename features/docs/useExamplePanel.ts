import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useState } from "react";

import { IExampleLink } from "../../lib/content.interfaces";
import { DocumentationExamplesState } from "./DocumentationContext";

export interface ExamplePanelState extends DocumentationExamplesState {
    activeExample: IExampleLink | null;
    examplesCollapsed: boolean;
    setExamplesCollapsed: Dispatch<SetStateAction<boolean>>;
    clearExampleLinks: () => void;
}

export const areSameExampleLink = (left: IExampleLink, right: IExampleLink) => {
    return left.id === right.id && left.playgroundId === right.playgroundId && (left.type || "pg") === (right.type || "pg");
};

export const addUniqueExampleLink = (links: IExampleLink[], link: IExampleLink) => {
    return links.some((existingLink) => areSameExampleLink(existingLink, link)) ? links : [...links, link];
};

export const useExamplePanel = (markdownRef: RefObject<HTMLDivElement>): ExamplePanelState => {
    const [exampleLinks, setExampleLinks] = useState<IExampleLink[]>([]);
    const [activeExample, setActiveExample] = useState<IExampleLink | null>(null);
    const [examplesCollapsed, setExamplesCollapsed] = useState(false);

    const addExampleLink = useCallback((link: IExampleLink) => {
        setExampleLinks((currentLinks) => addUniqueExampleLink(currentLinks, link));
    }, []);

    const clearExampleLinks = useCallback(() => {
        setExampleLinks([]);
    }, []);

    useEffect(() => {
        if (!activeExample) {
            markdownRef.current?.classList.add("closed");
            if (markdownRef.current?.classList.contains("opened")) {
                markdownRef.current.classList.remove("opened");
                markdownRef.current.scrollTo({ behavior: "auto", top: markdownRef.current.scrollTop - 400, left: 0 });
            }
        } else if (markdownRef.current?.classList.contains("closed")) {
            markdownRef.current.classList.remove("closed");
            markdownRef.current.classList.add("opened");
            markdownRef.current.scrollTo({ behavior: "auto", top: markdownRef.current.scrollTop + 400, left: 0 });
        }
    }, [activeExample, markdownRef]);

    return {
        exampleLinks,
        activeExample,
        examplesCollapsed,
        setExamplesCollapsed,
        addExampleLink,
        setActiveExample,
        clearExampleLinks,
    };
};
