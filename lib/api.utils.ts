import { Application } from "typedoc";
import { ScriptTarget } from "typescript";
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import { sep } from "path";
import * as path from "path";
import { getAllFiles } from "./build.utils";
import { htmlToJson, parseHTMLFile } from "./unified.utils";
import { MarkdownMetadata } from "./interfaces";

const basePath = path.join(process.cwd(), `.${sep}.temp${sep}docdirectory`);
const basePathResolved = path.resolve(basePath);

export const generateTypeDoc = async () => {
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
            // out: "./public/html/api",
            name: "Babylon.js API documentation",
            excludeExternals: true,
            excludePrivate: true,
            excludeProtected: true,
            // excludeNotExported: true,
            includeDeclarations: true,
            entryPoint: `BABYLON`,
            mode: "file",
            theme: "minimal",
            includes: basePathResolved,
            exclude: ["node_modules/**"],
            baseUrl: basePathResolved,
            // experimentalDecorators: true,
        });
        const outputDir = `${basePathResolved}${sep}files`;

        // Rendered docs
        app.generateDocs([`${basePathResolved}${sep}doc.d.ts`], outputDir);
    }
    // Alternatively generate JSON output
    // app.generateJson(project, outputDir + "/documentation.json");
    // }

    console.log("done");

    return getTypeDocFiles();
};

export const getAPIPageData = (id: string[]) => {
    const html = readFileSync(`${basePath}${sep}files${sep}${id.join(sep)}.html`, "utf-8").toString();
    // read the HTML file, extract description, title, css
    const htmlJson = htmlToJson(html);
    const head = htmlJson.children[1].children[0];
    const cssArray = [];
    const metadata: MarkdownMetadata = {
        title: "Babylon.js API",
        description: `Babylon.js API`,
        keywords: "babylonjs, babylon.js, api, typedoc," + id.join(","),
    };
    head.children.forEach((element) => {
        if (element.tagName === "title") {
            metadata.title = element.children[0].value;
        }
        if (element.tagName === "meta") {
            if (element.properties.name === "description") {
                metadata.description = element.properties.content;
            }
        }
        if (element.tagName === "style") {
            cssArray.push(element.children[0].value);
        }
    });
    return {
        id,
        metadata,
        cssArray,
        contentNode: htmlJson.children[1].children[2],
    };
};

export const getFileContent = (id: string[]) => {
    const html = readFileSync(`${basePath}${sep}${id.join(sep)}.html`, "utf-8").toString();
    return parseHTMLFile(html);
};

export const getTypeDocFiles = () => {
    const filenames = getAllFiles(`${basePath}${sep}files`, [], ".html");
    const fileMap = filenames.map((fileName) => {
        const id = fileName
            .replace(`${basePath}${sep}files`, "")
            .replace(/\.html$/, "")
            .split(sep);
            console.log(id);
        id.shift();
        return {
            params: {
                id,
            },
        };
    });
    return fileMap.filter(({ params }) => params.id.indexOf("index") === -1 && params.id.indexOf("globals") === -1);
};
