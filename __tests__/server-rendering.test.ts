import type { AppProps } from "next/app";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parse } from "node-html-parser";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DocsPage } from "../features/docs/DocsPage";
import { compileMarkdown } from "../lib/markdown/compileMarkdown";
import { MyApp } from "../pages/_app";

vi.mock("next/dist/client/router", () => ({
    useRouter: () => ({ asPath: "/features/server-rendering" }),
}));

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("readable server-rendered documentation", () => {
    it("renders compiled article content through the real app and theme wrappers without browser globals", async () => {
        const mdxContent = await compileMarkdown(`
## Creating a box

The box has its origin at its center.

\`\`\`javascript
const box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
\`\`\`

| Option | Default |
| ------ | ------- |
| size | 1 |

[More documentation](/features/featuresDeepDive/mesh)

Example: <Playground id="#6XIT28#4" title="Create a Cuboid" />

![Box example](/img/box.png)
`);
        const markup = renderToStaticMarkup(
            createElement(MyApp, {
                Component: DocsPage,
                pageProps: {
                    id: ["features", "server-rendering"],
                    breadcrumbs: [],
                    metadata: { title: "Readable documentation", description: "A server-rendered article.", keywords: "box" },
                    mdxContent,
                },
                // Next supplies this prop; MyApp does not read it.
                router: {} as AppProps["router"],
            }),
        );
        const article = parse(markup).querySelector("#markdown-container");

        expect(article).not.toBeNull();
        expect(article!.querySelector("h1")?.textContent).toBe("Readable documentation");
        expect(article!.querySelector("h2")?.textContent).toBe("Creating a box");
        expect(article!.textContent).toContain("The box has its origin at its center.");
        expect(article!.querySelector("pre")?.textContent).toContain("CreateBox");
        expect(article!.querySelector("table")?.textContent).toContain("size");
        expect(article!.querySelector('a[href="/features/featuresDeepDive/mesh"]')).not.toBeNull();
        expect(article!.querySelector('a[href*="6XIT28"]')).not.toBeNull();
        expect(article!.querySelector("img")?.getAttribute("alt")).toBe("Box example");
        expect(article!.querySelector("p div")).toBeNull();
    });

    it("does not read saved theme preferences during the initial render", () => {
        const getItem = vi.fn(() => "light");
        vi.stubGlobal("localStorage", { getItem });

        const markup = renderToStaticMarkup(
            createElement(MyApp, {
                Component: () => createElement("main", null, "Readable before hydration"),
                pageProps: {},
                router: {} as AppProps["router"],
            }),
        );

        expect(markup).toContain("<main>Readable before hydration</main>");
        expect(getItem).not.toHaveBeenCalled();
    });
});
