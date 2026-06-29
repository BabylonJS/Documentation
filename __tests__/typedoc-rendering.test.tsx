import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { parseNode } from "../lib/buildUtils/parser.utils";

describe("TypeDoc HTML rendering", () => {
    it("parses generated TypeDoc content as a fragment", () => {
        const markup = renderToStaticMarkup(parseNode('<div class="col-content"><h1>API</h1></div>').result);

        expect(markup).toContain('<div class="col-content"><h1>API</h1></div>');
        expect(markup).not.toContain("<html");
        expect(markup).not.toContain("<body");
    });

    it("rewrites TypeDoc icon references to use the inline sprite", () => {
        const markup = renderToStaticMarkup(parseNode('<svg><use href="../assets/icons.svg#icon-search"></use></svg>').result);

        expect(markup).toContain('href="#icon-search"');
        expect(markup).not.toContain("assets/icons.svg");
    });
});