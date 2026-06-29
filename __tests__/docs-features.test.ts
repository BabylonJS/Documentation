import { describe, expect, it, vi } from "vitest";

import { createDocumentationContextValue } from "../features/docs/DocumentationContext";
import { addUniqueTableOfContentsItem } from "../features/docs/DocsTableOfContentsProvider";
import { addUniqueExampleLink } from "../features/docs/useExamplePanel";
import { IExampleLink, ITableOfContentsItem } from "../lib/content.interfaces";

describe("docs feature helpers", () => {
    it("deduplicates example links by identity fields", () => {
        const example: IExampleLink = { id: "abc", playgroundId: "#123", type: "pg", title: "First title" };
        const links = [example];

        expect(addUniqueExampleLink(links, { ...example, title: "Updated title" })).toBe(links);
        expect(addUniqueExampleLink(links, { ...example, type: "nme" })).toEqual([example, { ...example, type: "nme" }]);
    });

    it("deduplicates table of contents items by id", () => {
        const item: ITableOfContentsItem = { id: "intro", level: 1, title: "Intro" };
        const items = [item];

        expect(addUniqueTableOfContentsItem(items, { ...item, title: "Introduction" })).toBe(items);
        expect(addUniqueTableOfContentsItem(items, { id: "setup", level: 2, title: "Setup" })).toEqual([items[0], { id: "setup", level: 2, title: "Setup" }]);
    });

    it("combines examples and table of contents state into the documentation context", () => {
        const addExampleLink = vi.fn();
        const setActiveExample = vi.fn();
        const addTOCItem = vi.fn();
        const setActiveTOCItem = vi.fn();
        const exampleLinks: IExampleLink[] = [{ id: "example" }];
        const activeTOCItem: ITableOfContentsItem = { id: "intro", level: 1, title: "Intro" };

        expect(
            createDocumentationContextValue(
                { exampleLinks, addExampleLink, setActiveExample },
                { activeTOCItem, addTOCItem, setActiveTOCItem },
            ),
        ).toEqual({
            exampleLinks,
            addExampleLink,
            setActiveExample,
            activeTOCItem,
            addTOCItem,
            setActiveTOCItem,
        });
    });
});
