import { describe, expect, it } from "vitest";

import { docsFlavors, getDocsFlavorFromId } from "../lib/docsFlavors";

describe("docs flavors", () => {
    it("uses Babylon.js as the default documentation flavor", () => {
        expect(getDocsFlavorFromId([])).toBe(docsFlavors.babylon);
        expect(getDocsFlavorFromId(["features"])).toBe(docsFlavors.babylon);
    });

    it("detects Babylon Lite routes", () => {
        expect(getDocsFlavorFromId(["lite"])).toBe(docsFlavors.lite);
        expect(getDocsFlavorFromId(["lite", "search"])).toBe(docsFlavors.lite);
    });

    it("keeps Babylon Lite search and menu paths separate", () => {
        expect(docsFlavors.babylon.apiPath).toBe("/typedoc");
        expect(docsFlavors.lite.apiPath).toBe("/lite/typedoc");
        expect(docsFlavors.lite.searchPath).toBe("/lite/search");
        expect(docsFlavors.lite.menuItems?.[0].url).toBe("/lite");
    });
});