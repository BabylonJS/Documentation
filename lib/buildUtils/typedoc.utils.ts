import * as TypeDoc from "typedoc";
// import { ScriptTarget } from "typescript";
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import del from "del";
import { sep } from "path";
import * as path from "path";
import * as glob from "glob";
import os from "os";
import { getAllFiles } from "./tools";
import { MarkdownMetadata } from "../interfaces";
import { addSearchItem, clearIndex } from "./search.utils";

import { htmlToText } from "html-to-text";
import { parse, HTMLElement } from "node-html-parser";
import { addToSitemap } from "./sitemap.utils";

export const generateTypeDoc = async (url: string = "https://cdn.babylonjs.com/documentation.d.ts", title: string = "Babylon.js API documentation", baseLocation: string = "typedoc") => {
    const basePath = path.join(process.cwd(), `.${sep}.temp${sep}${baseLocation}${sep}docdirectory`);
    const tmpPath = path.join(process.cwd(), `.${sep}.temp${sep}${baseLocation}`);
    const basePathResolved = path.resolve(basePath);
    // force recreating the API docs when in production mode
    if (process.env.NODE_ENV === "production") {
        console.log("making sure directory is empty", basePathResolved);

        await del(tmpPath);
    }
    if (!existsSync(basePathResolved + sep + "files" + sep + "index.html")) {
        console.log("generating API docs, patience is required");
        // download the latest .d.ts
        const response = await fetch(url);
        const text = (await response.text()).replace(/declare module "[^}]*}/g, "");
        try {
            mkdirSync(basePathResolved, { recursive: true });
        } catch (e) {}
        writeFileSync(`${basePathResolved}${sep}doc.d.ts`, text);

        // write tsconfig.json, required for TypeDoc
        writeFileSync(
            `${basePathResolved}${sep}tsconfig.json`,
            JSON.stringify({
                compilerOptions: {
                    experimentalDecorators: true,
                    noImplicitAny: true,
                    noImplicitReturns: true,
                    noImplicitThis: true,
                    noUnusedLocals: true,
                    strictNullChecks: true,
                    strictFunctionTypes: true,
                    skipLibCheck: true,
                },
            }),
        );

        try {
            const app = await TypeDoc.Application.bootstrap({
                // typedoc options here
                name: title,
                excludeExternals: true,
                excludePrivate: true,
                excludeProtected: true,
                excludeInternal: true,
                // includes: basePathResolved,
                hideGenerator: true,
                tsconfig: `${basePathResolved}${sep}tsconfig.json`,
                readme: "none",
                entryPoints: [`${basePathResolved}${sep}doc.d.ts`],
            });

            console.log("API starting", "post bootstrap");

            // If you want TypeDoc to load tsconfig.json / typedoc.json files
            app.options.addReader(new TypeDoc.TSConfigReader());
            app.options.addReader(new TypeDoc.TypeDocReader());

            const project = await app.convert();

            console.log("API starting", "post convert");

            if (project) {
                // Rendered docs
                await app.generateDocs(project, `${basePathResolved}${sep}files`);
            }
        } catch (e) {
            console.error(e);
        }
    }

    console.log("API done");

    const files = getTypeDocFiles(baseLocation);

    // clear the search index if needed
    // only run this when building for master
    if (process.env.PRODUCTION) {
        // only remove those that don't exist anymore
        const existingDocs = files.map(({ params }) => `/${baseLocation}/${params.id.join("/")}`);
        await clearIndex(true, existingDocs);
    }

    return files;
};

export const generateBreadcrumbs = (html: HTMLElement, id: string[], baseLocation: string) => {
    const breadcrumbs = html.querySelectorAll(".tsd-breadcrumb li a").map((element) => {
        const baseUrl = "/" + baseLocation + "/" + id[0] + "/";
        const href = element.getAttribute("href");
        let url = "";
        // index?
        if (href === "/modules/BABYLON.html" || href === "../modules/BABYLON.html") {
            url = "/" + baseLocation;
        } else {
            url = baseUrl + href.replace(".html", "");
        }
        if (url.endsWith("/")) {
            url = url.substring(0, url.length - 1);
        }
        if (url.endsWith("/index")) {
            url = url.substring(0, url.length - 6);
        }

        return {
            name: element.firstChild.rawText,
            url,
        };
    });
    // remove the first element, it's not needed
    if (baseLocation === "typedoc") {
        breadcrumbs.shift();
    } else {
        if (breadcrumbs.length) {
            breadcrumbs[0].url = "/" + baseLocation + "/index";
        }
    }
    return breadcrumbs;
};

export const getAPIPageData = async (id: string[], baseLocation: string = "typedoc") => {
    const basePath = path.join(process.cwd(), `.${sep}.temp${sep}${baseLocation}${sep}docdirectory`);
    let filename = `${basePath}${sep}files${sep}${id.join(sep)}.html`;
    const allLowerCase = id.every((i) => i.toLowerCase() === i);
    if (allLowerCase && id.length > 1) {
        glob.sync(path.relative(path.resolve("."), path.resolve(filename)).replace(/\\/g, "/"), { nocase: true }).forEach((f) => {
            filename = f.substring(f.indexOf(id[0]));
        });
        return {
            redirect: `/${baseLocation}/${filename.replace(".html", "")}`,
        };
    }
    const html = readFileSync(filename, "utf-8").toString();
    // read the HTML file, extract description, title, css
    const root = parse(html);
    const head = root.querySelector("head");
    const cssArray = [];
    const metadata: MarkdownMetadata = {
        title: "Babylon.js API",
        description: "[Babylon.js API]",
        keywords: "babylonjs, babylon.js, api, " + baseLocation + "," + id.join(","),
    };
    const titleNode = head.querySelector("title").firstChild;
    if (titleNode) {
        metadata.title = titleNode.rawText.split(" | ")[0];
    }

    try {
        metadata.description = root.querySelector(".tsd-panel .tsd-comment p").textContent.substring(0, 150) + " " + metadata.description;
    } catch (e) {
        metadata.description = `${id.join(" ")} ${metadata.description}`;
    }
    // clean description
    metadata.description = metadata.description.replace(/\n/g, "").replace(/\t/g, "");
    // Search index
    let url = "/" + baseLocation + "/" + id.join("/");
    // create a buffer
    const buff = Buffer.from(url, "utf-8");
    const searchId = buff.toString("base64");
    // index page
    if (id.length === 1 && id[0] === "module/BABYLON") {
        metadata.description = "Babylon.js API main page - BABYLON namespace";
        url = "/" + baseLocation;
    }

    root.querySelectorAll("script").forEach((node) => node.remove());

    // do not index lowercased pages
    if (/[A-Z]/.test(url)) {
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
    }

    return {
        id,
        metadata,
        cssArray,
        contentNode: root.toString(),
        breadcrumbs: generateBreadcrumbs(root, id, baseLocation),
    };
};

export const getTypeDocFiles = (baseLocation: string = "typedoc") => {
    const basePath = path.join(process.cwd(), `.${sep}.temp${sep}${baseLocation}${sep}docdirectory`);
    const filenames = getAllFiles(`${basePath}${sep}files`, [], ".html");
    const fileMap = filenames
        .map((fileName) => {
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
        })
        .filter(({ params }) => (baseLocation === "typedoc" ? params.id.indexOf("index") === -1 && params.id.indexOf("module/BABYLON") === -1 : true));
    const extra =
        os.platform() === "win32" || os.platform() === "darwin"
            ? []
            : fileMap.map((file) => {
                  return {
                      params: {
                          id: file.params.id.map((id) => id.toLowerCase()),
                      },
                  };
              });

    return [...fileMap, ...extra];
};
