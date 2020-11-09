import { Application } from "typedoc";
import { ScriptTarget } from "typescript";
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import del from "del";
import { sep } from "path";
import * as path from "path";
import { getAllFiles } from "./tools";
import { MarkdownMetadata } from "../interfaces";
import { addSearchItem, clearIndex } from "./search.utils";

import { htmlToText } from "html-to-text";
import { parse, HTMLElement } from "node-html-parser";
import { addToSitemap } from "./sitemap.utils";

const basePath = path.join(process.cwd(), `.${sep}.temp${sep}docdirectory`);
const tmpPath = path.join(process.cwd(), `.${sep}.temp`);
const basePathResolved = path.resolve(basePath);

export const generateTypeDoc = async () => {
    // force recreating the API docs when in production mode 
    if (process.env.NODE_ENV === "production") {
        console.log("making sure directory is empty", basePathResolved);
        await del(tmpPath);
    }
    // only run this when building for master
    if (process.env.PRODUCTION) {
        await clearIndex(true);
    }
    if (!existsSync(basePathResolved + sep + "files" + sep + "index.html")) {
        console.log("generating API docs, patience is required");
        // download the latest .d.ts
        const response = await fetch("https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/dist/preview%20release/documentation.d.ts");
        const text = await response.text();
        try {
            mkdirSync(basePathResolved, { recursive: true });
        } catch (e) {}
        writeFileSync(`${basePathResolved}${sep}doc.d.ts`, text);

        const app = new Application();

        app.bootstrap({
            target: ScriptTarget.ES2015,
            name: "Babylon.js API documentation",
            excludeExternals: true,
            excludePrivate: true,
            excludeProtected: true,
            excludeNotExported: true,
            includeDeclarations: true,
            entryPoint: `BABYLON`,
            mode: "file",
            theme: "default",
            includes: basePathResolved,
            exclude: ["node_modules/**"],
            baseUrl: basePathResolved,
            hideGenerator: true,
        });
        const outputDir = `${basePathResolved}${sep}files`;

        // Rendered docs
        app.generateDocs([`${basePathResolved}${sep}doc.d.ts`], outputDir);
    }

    console.log("API done");

    return getTypeDocFiles();
};

export const generateBreadcrumbs = (html: HTMLElement, id: string[]) => {
    return html.querySelectorAll(".tsd-breadcrumb li a").map((element) => {
        const baseUrl = "/typedoc/" + id[0] + "/";
        const href = element.getAttribute("href");
        let url = "";
        // index?
        if (href === "/globals.html" || href === "../globals.html") {
            url = "/typedoc";
        } else {
            url = baseUrl + href.replace(".html", "");
        }

        return {
            name: element.firstChild.rawText,
            url,
        };
    });
};

export const getAPIPageData = async (id: string[]) => {
    const html = readFileSync(`${basePath}${sep}files${sep}${id.join(sep)}.html`, "utf-8").toString();
    // read the HTML file, extract description, title, css
    const root = parse(html);
    const head = root.querySelector("head");
    const cssArray = [];
    const metadata: MarkdownMetadata = {
        title: "Babylon.js API",
        description: "[API]",
        keywords: "babylonjs, babylon.js, api, typedoc," + id.join(","),
    };
    const titleNode = head.querySelector("title").firstChild;
    if (titleNode) {
        metadata.title = titleNode.rawText.split(" | ")[0];
    }

    try {
        metadata.description = root.querySelector(".tsd-panel .tsd-comment .lead p").firstChild.rawText.substr(0, 150) + " " + metadata.description;
    } catch (e) {
        metadata.description = `${id.join(" ")} ${metadata.description}`;
    }
    // clean description
    metadata.description = metadata.description.replace(/\n/g, "").replace(/\t/g, "");
    // Search index
    let url = "/typedoc/" + id.join("/");
    // create a buffer
    const buff = Buffer.from(url, "utf-8");
    const searchId = buff.toString("base64");
    // index page
    if (id.length === 1 && id[0] === "globals") {
        metadata.description = "Babylon.js API main page - BABYLON namespace";
        url = "/typedoc";
    }

    root.querySelectorAll("script").forEach((node) => node.remove());

    // TODO - check for errors
    const res = await addSearchItem({
        id: searchId,
        path: url,
        isApi: true,
        content: htmlToText(html),
        keywords: id,
        description: metadata.description,
        title: metadata.title,
        imageUrl: metadata.imageUrl,
        videoLink: metadata.videoOverview,
    });

    // add to sitemap
    addToSitemap(metadata.title, url);

    return {
        id,
        metadata,
        cssArray,
        contentNode: root.toString(),
        breadcrumbs: generateBreadcrumbs(root, id),
    };
};

export const getTypeDocFiles = () => {
    const filenames = getAllFiles(`${basePath}${sep}files`, [], ".html");
    const fileMap = filenames.map((fileName) => {
        const id = fileName
            .replace(`${basePath}${sep}files`, "")
            .replace(/\.html$/, "")
            .split(sep);
        id.shift();
        return {
            params: {
                id,
            },
        };
    });
    return fileMap.filter(({ params }) => params.id.indexOf("index") === -1 && params.id.indexOf("globals") === -1);
};
