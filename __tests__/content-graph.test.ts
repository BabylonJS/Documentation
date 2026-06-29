import { describe, expect, it } from "vitest";

import { buildContentGraph } from "../lib/contentGraph/buildContentGraph";

describe("Content Graph", () => {
    const graph = buildContentGraph();

    it("builds the documentation pages and route manifest", () => {
        expect(graph.pages.length).toBeGreaterThan(700);
        expect(graph.routeManifest.length).toBeGreaterThan(700);
        expect(graph.pagesByRoute["/"]).toBeTruthy();
        expect(graph.routeManifest[0].params.id).toEqual([]);
    });

    it("normalizes page metadata and breadcrumbs", () => {
        const page = graph.pagesByRoute["/addons/htmlMesh"];

        expect(page.metadata.title).toBe("HtmlMesh");
        expect(page.metadata.description).toContain("HTML Mesh is a mesh");
        expect(page.breadcrumbs).toEqual([
            { name: "Official Add-ons", url: "/addons" },
            { name: "HTML Mesh", url: "/addons/htmlMesh" },
        ]);
        expect(page.sourcePath).toBe("content/addons/htmlMesh.md");
        expect(page.gitHubUrl).toBe("https://github.com/BabylonJS/Documentation/blob/master/content/addons/htmlMesh.md");
    });

    it("extracts example references from markdown content", () => {
        const page = graph.pagesByRoute["/addons/htmlMesh"];

        expect(page.examples).toEqual([
            expect.objectContaining({
                type: "pg",
                id: "#HVHYJC#82",
                title: "HtmlMesh Example",
                imageUrl: "/img/playgroundsAndNMEs/htmlMeshPG.webp",
            }),
            expect.objectContaining({
                type: "pg",
                id: "#B17TC7#210",
                title: "HtmlMesh Box Example",
                imageUrl: "/img/playgroundsAndNMEs/HtmlMeshBoxPG.webp",
            }),
        ]);
    });

    it("links pages in structure order", () => {
        const page = graph.pagesByRoute["/journey/theFirstStep"];

        expect(page.previousId).toEqual(["journey"]);
        expect(page.nextId).toEqual(["journey", "learningTheDocs"]);
        expect(page.childIds).toEqual([]);
    });
});
