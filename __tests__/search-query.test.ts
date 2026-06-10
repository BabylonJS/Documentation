import { describe, expect, it } from "vitest";

import { buildSearchIndexUrl } from "../lib/frontendUtils/searchQuery.utils";

describe("search query utilities", () => {
    it("filters document search results to the Babylon.js flavor by default", () => {
        const url = new URL(buildSearchIndexUrl("mesh builder"));

        expect(url.pathname).toBe("/indexes/documents/docs");
        expect(url.searchParams.get("search")).toBe("mesh builder");
        expect(url.searchParams.get("$filter")).toBe("flavor eq 'babylon'");
    });

    it("filters search results to the requested flavor and index type", () => {
        const url = new URL(buildSearchIndexUrl("thin instances", "playgrounds", "lite"));

        expect(url.pathname).toBe("/indexes/playgrounds/docs");
        expect(url.searchParams.get("search")).toBe("thin instances");
        expect(url.searchParams.get("$filter")).toBe("flavor eq 'lite'");
    });
});