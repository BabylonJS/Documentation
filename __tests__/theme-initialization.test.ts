import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parse } from "node-html-parser";
import { runInNewContext } from "node:vm";
import type { DocumentProps } from "next/document";
import { describe, expect, it, vi } from "vitest";

import { documentationTheme, getDesignTokens, themeAttribute, themePreferenceKey } from "../styles/theme";
import { MyDocument } from "../pages/_document";

vi.mock("next/document", async (importOriginal) => ({
    ...await importOriginal<typeof import("next/document")>(),
    Html: "html",
    Head: "head",
    Main: () => createElement("main", null, "Article content"),
    NextScript: () => createElement("script", { src: "/_next/hydrate.js" }),
}));

describe("pre-paint documentation theme", () => {
    it("puts color variables in the head and initializes the scheme before article content", () => {
        const document = parse(renderToStaticMarkup(createElement(MyDocument, {} as DocumentProps)));
        expect(document.querySelector("html")!.getAttribute(themeAttribute)).toBe(documentationTheme.defaultColorScheme);
        const head = document.querySelector("head")!;
        expect(head.querySelector("style")!.textContent).toContain("--mui-palette-background-default");
        expect(head.querySelector("style")!.textContent).toContain("--mui-customPalette-sideMenu-backgroundColor");
        const body = document.querySelector("body")!;
        expect(body.firstChild).toBe(body.querySelector("script"));
        expect(body.firstChild?.textContent).toContain(`localStorage.getItem('${themePreferenceKey}')`);
        expect(body.firstChild?.textContent).toContain(`setAttribute('${themeAttribute}'`);
        expect(body.querySelector("main")?.textContent).toBe("Article content");
    });

    it.each([
        { saved: "light", systemDark: true, expected: "light" },
        { saved: "dark", systemDark: false, expected: "dark" },
        { saved: null, systemDark: false, expected: "light" },
        { saved: null, systemDark: true, expected: "dark" },
        { saved: "system", systemDark: false, expected: "light" },
        { saved: "system", systemDark: true, expected: "dark" },
    ])("selects $expected before hydration with saved=$saved and systemDark=$systemDark", ({ saved, systemDark, expected }) => {
        const attributes = new Map<string, string>();
        const markup = renderToStaticMarkup(createElement(InitColorSchemeScript, {
            attribute: themeAttribute,
            modeStorageKey: themePreferenceKey,
            defaultMode: "system",
        }));
        const script = parse(markup).querySelector("script")!.textContent;

        runInNewContext(script, {
            localStorage: { getItem: (key: string) => key === themePreferenceKey ? saved : null },
            window: { matchMedia: () => ({ matches: systemDark }) },
            document: { documentElement: { setAttribute: (key: string, value: string) => attributes.set(key, value) } },
        });

        expect(attributes.get(themeAttribute)).toBe(expected);
    });

    it("exports both schemes with matching selectors and variable-backed documentation colors", () => {
        expect(documentationTheme.colorSchemeSelector).toBe(`[${themeAttribute}="%s"]`);
        expect(documentationTheme.vars.customPalette.sideMenu.backgroundColor).toContain("var(--mui-customPalette-sideMenu-backgroundColor");
        expect(documentationTheme.vars.customPalette.tableOfContent.background).toContain("var(--mui-customPalette-tableOfContent-background");
        const stylesheets = documentationTheme.generateStyleSheets();

        for (const mode of ["light", "dark"] as const) {
            const selector = `[${themeAttribute}="${mode}"]`;
            const stylesheet = stylesheets.find((sheet) => Object.keys(sheet).some((key) => key.includes(selector)));
            expect(stylesheet).toBeDefined();
            const css = JSON.stringify(stylesheet);
            expect(css).toContain(getDesignTokens(mode).customPalette.sideMenu.backgroundColor);
            expect(css).toContain(getDesignTokens(mode).customPalette.tableOfContent.background);
            expect(css).toContain("--mui-palette-background-default");
        }
    });
});
