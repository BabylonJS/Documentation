import * as TypeDoc from "typedoc";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { execSync } from "child_process";
import { deleteAsync as del } from "del";
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

import typedocConfig, { TypeDocConfig } from "../../configuration/typedoc.config";

/**
 * Resolve the version tag.  When config says "latest", query the npm
 * registry for the current published version of the first package.
 */
const resolveVersion = (cfg: TypeDocConfig): string => {
    if (cfg.version !== "latest") {
        return cfg.version;
    }
    return execSync(`npm view ${cfg.packages[0].npmPackage} version`, {
        encoding: "utf-8",
    }).trim();
};

/**
 * Shallow-clone the Babylon.js monorepo at a specific version tag,
 * using sparse checkout to fetch only the directories we need.
 * Returns the path to the cloned repo root.
 */
const cloneRepo = (tmpPath: string, config: TypeDocConfig, version: string): string => {
    const repoDir = path.join(tmpPath, "repo");
    const firstEntry = path.join(repoDir, config.packages[0].entryPoint);

    // Reuse existing clone if the entry point file is already present
    if (existsSync(firstEntry)) {
        console.log("Repo already cloned, reusing", repoDir);
        return repoDir;
    }

    const repoUrl = `https://github.com/${config.githubRepo}.git`;
    console.log(`Cloning ${repoUrl} at tag ${version} (shallow + sparse)…`);

    // --depth 1          → single commit
    // --branch <tag>     → check out exactly that tag
    // --filter=blob:none → partial clone, fetch blobs on demand
    // --no-checkout       → don't populate working tree yet
    execSync(
        `git clone --depth 1 --branch ${version} --filter=blob:none --no-checkout ${repoUrl} ${repoDir}`,
        { stdio: "inherit" },
    );

    // Cone-mode sparse checkout: only materialise the needed directories
    const sparsePaths = config.packages.map((p) => p.repoPath).join(" ");
    execSync(`git sparse-checkout init --cone`, {
        cwd: repoDir,
        stdio: "inherit",
    });
    execSync(`git sparse-checkout set ${sparsePaths}`, {
        cwd: repoDir,
        stdio: "inherit",
    });
    execSync(`git checkout`, {
        cwd: repoDir,
        stdio: "inherit",
    });

    return repoDir;
};

/**
 * Shallow-clone the repo at the published version tag and run TypeDoc
 * against the real TypeScript source.  TypeDoc's built-in git
 * integration produces GitHub source links with correct line numbers.
 */
export const generateTypeDoc = async (
    title: string = typedocConfig.title,
    baseLocation: string = "typedoc",
    config: TypeDocConfig = typedocConfig,
) => {
    const basePath = path.join(process.cwd(), ".temp", baseLocation, "docdirectory");
    const tmpPath = path.join(process.cwd(), ".temp", baseLocation);
    const basePathResolved = path.resolve(basePath);

    // force recreating the API docs when in production mode
    if (process.env.NODE_ENV === "production") {
        console.log("making sure directory is empty", basePathResolved);
        await del(tmpPath);
    }

    if (!existsSync(basePathResolved + sep + "files" + sep + "index.html")) {
        console.log("generating API docs, patience is required");

        // 1. Resolve version and clone the repo
        const resolvedVersion = resolveVersion(config);
        console.log(`Resolved version: ${resolvedVersion}`);

        const repoDir = cloneRepo(tmpPath, config, resolvedVersion);

        // 2. Inject @module tags into entry point files so TypeDoc names
        //    modules after the npm package (e.g. "@babylonjs/core") instead
        //    of deriving names from the file path ("packages_dev_core_src").
        //    The real file paths stay intact so TypeDoc's git integration
        //    still produces correct GitHub source links.
        for (const pkg of config.packages) {
            const entryFile = path.join(repoDir, pkg.entryPoint);
            const original = readFileSync(entryFile, "utf-8");
            if (!original.includes("@module")) {
                writeFileSync(entryFile, `/** @module ${pkg.npmPackage} */\n${original}`);
            }
        }

        // 3. Collect entry points from the real source paths
        const entryPoints = config.packages.map((p) => {
            const ep = path.join(repoDir, p.entryPoint);
            if (!existsSync(ep)) {
                throw new Error(`Entry point not found: ${ep}`);
            }
            return ep;
        });

        // 4. Write a tsconfig for TypeDoc.
        const paths: Record<string, string[]> = {};
        for (const pkg of config.packages) {
            const srcDir = "./" + path.dirname(pkg.entryPoint);
            paths[pkg.npmPackage] = [srcDir];
            paths[pkg.npmPackage + "/*"] = [srcDir + "/*"];
        }

        mkdirSync(basePathResolved, { recursive: true });
        const tsconfigPath = path.join(repoDir, "tsconfig.typedoc.json");
        writeFileSync(
            tsconfigPath,
            JSON.stringify({
                compilerOptions: {
                    target: "es2020",
                    module: "esnext",
                    moduleResolution: "bundler",
                    experimentalDecorators: true,
                    skipLibCheck: true,
                    baseUrl: ".",
                    paths,
                },
                include: config.packages.map((p) => p.entryPoint),
            }),
        );

        // 4. Run TypeDoc — git integration is automatic since the
        //    source files live inside a real git clone.
        try {
            const app = await TypeDoc.Application.bootstrap({
                name: title,
                excludeExternals: true,
                excludePrivate: true,
                excludeProtected: true,
                excludeInternal: true,
                hideGenerator: true,
                skipErrorChecking: true,
                logLevel: "Error",
                tsconfig: tsconfigPath,
                readme: "none",
                entryPoints,
                // basePath = repo root so display text shows "packages/dev/core/src/..."
                // instead of ".temp/typedoc/repo/packages/dev/core/src/..."
                basePath: repoDir,
            } as Partial<Record<string, unknown>> as TypeDoc.TypeDocOptions);

            console.log("API starting", "post bootstrap");

            app.options.addReader(new TypeDoc.TSConfigReader());
            app.options.addReader(new TypeDoc.TypeDocReader());

            const project = await app.convert();

            console.log("API starting", "post convert");

            if (project) {
                const outputDir = path.join(basePathResolved, "files");
                await app.generateDocs(project, outputDir);
            }
        } catch (e) {
            console.error(e);
        }
    }

    console.log("API done");

    // Build a lightweight search index from the generated HTML filenames
    buildSearchIndex(basePathResolved, baseLocation);

    const files = getTypeDocFiles(baseLocation);

    // clear the search index if needed
    // only run this when building for master
    if (process.env.PRODUCTION) {
        const existingDocs = files.map(({ params }) => `/${baseLocation}/${params.id.join("/")}`);
        await clearIndex(true, existingDocs);
    }

    return files;
};

export const generateBreadcrumbs = (html: HTMLElement, id: string[], baseLocation: string) => {
    const breadcrumbs = html.querySelectorAll(".tsd-breadcrumb li a").map((element) => {
        const href = element.getAttribute("href");
        let url = "";
        if (!href || href === "" || href === "#") {
            // Current page — use the page's own URL
            url = "/" + baseLocation + "/" + id.join("/");
        } else {
            // Resolve relative hrefs (e.g. "../modules/packages_dev_core_src.html")
            // relative to the current page's directory in the TypeDoc output.
            // id = ["classes", "packages_dev_core_src.Scene"]
            // so the "directory" is "classes/"
            const pageDir = id.slice(0, -1).join("/");
            const parts = (pageDir ? pageDir + "/" + href : href).split("/");
            // Resolve ".." segments
            const resolved: string[] = [];
            for (const p of parts) {
                if (p === "..") {
                    resolved.pop();
                } else if (p !== ".") {
                    resolved.push(p);
                }
            }
            url = "/" + baseLocation + "/" + resolved.join("/").replace(".html", "");
        }
        if (url.endsWith("/")) {
            url = url.substring(0, url.length - 1);
        }

        return {
            name: element.firstChild.rawText,
            url,
        };
    });
    // Prepend a root "API" breadcrumb that links to the index page
    breadcrumbs.unshift({
        name: baseLocation === "typedoc" ? "API" : "Viewer API",
        url: "/" + baseLocation,
    });
    return breadcrumbs;
};

export const getAPIPageData = async (id: string[], baseLocation: string = "typedoc") => {
    const basePath = path.join(process.cwd(), '.temp', baseLocation, 'docdirectory');
    let filename = path.join(basePath, 'files', ...id) + '.html';
    const allLowerCase = id.every((i) => i.toLowerCase() === i);
    // Only redirect if the URL is all-lowercase AND the exact file doesn't exist.
    // This handles case-insensitive lookups (e.g. /classes/scene → /classes/Scene)
    // without breaking legitimately lowercase pages like /modules/_babylonjs_core.
    // eslint-disable-next-line no-eval
    const fs = (eval("require") as NodeRequire)("fs");
    if (allLowerCase && id.length > 1 && !fs.existsSync(filename)) {
        const relPattern = path.relative(basePath, filename).replace(/\\/g, "/");
        glob.sync(relPattern, { nocase: true, cwd: basePath }).forEach((f) => {
            filename = f.substring(f.indexOf(id[0]));
        });
        return {
            redirect: `/${baseLocation}/${filename.replace(".html", "")}`,
        };
    }
    // Use the dynamic fs require (above) to prevent the bundler from tracing
    // this read — the fully dynamic path triggers an overly broad file pattern.
    const html = fs.readFileSync(filename, "utf-8").toString();
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

    // Extract only the main content area (.col-content) to avoid
    // passing the full HTML page (with header/footer/sidebar) through
    // the React rendering pipeline. This is more robust than relying
    // on fragile index-based traversal of the React element tree.
    const colContent = root.querySelector(".col-content");

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
        contentNode: colContent ? colContent.innerHTML : root.toString(),
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
        .filter(({ params }) => (baseLocation === "typedoc" ? params.id.indexOf("module/BABYLON") === -1 : true));
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

/**
 * Scans the generated TypeDoc HTML and produces a lightweight JSON search
 * index written to `public/<baseLocation>-search-index.json`.
 *
 * Each entry contains: name, kind (Class, Interface …), module, and url.
 */
const KIND_LABELS: Record<string, string> = {
    classes: "Class",
    interfaces: "Interface",
    enums: "Enum",
    functions: "Function",
    types: "Type",
    variables: "Variable",
    modules: "Module",
};

const buildSearchIndex = (basePathResolved: string, baseLocation: string) => {
    const filesDir = path.join(basePathResolved, "files");
    const index: { name: string; kind: string; module: string; url: string }[] = [];

    for (const kindDir of Object.keys(KIND_LABELS)) {
        const dir = path.join(filesDir, kindDir);
        if (!existsSync(dir)) continue;

        const htmlFiles = glob.sync("*.html", { cwd: dir });
        for (const file of htmlFiles) {
            const base = file.replace(/\.html$/, "");
            // Filename pattern: _babylonjs_core.Scene  →  module = "@babylonjs/core", name = "Scene"
            const dotIdx = base.indexOf(".");
            let module = "";
            let name = base;
            if (dotIdx !== -1) {
                const rawModule = base.substring(0, dotIdx);
                name = base.substring(dotIdx + 1);
                // Convert _babylonjs_core → @babylonjs/core
                module = rawModule.replace(/^_/, "@").replace(/_/g, "/");
            } else {
                // Module pages themselves (e.g. _babylonjs_core → @babylonjs/core)
                module = base.replace(/^_/, "@").replace(/_/g, "/");
                name = module;
            }

            index.push({
                name,
                kind: KIND_LABELS[kindDir],
                module,
                url: `/${baseLocation}/${kindDir}/${base}`,
            });
        }
    }

    // Sort alphabetically by name for consistent output
    index.sort((a, b) => a.name.localeCompare(b.name));

    const outDir = path.join(process.cwd(), "public");
    mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `${baseLocation.replace(/\//g, "-")}-search-index.json`);
    writeFileSync(outFile, JSON.stringify(index));
    console.log(`Search index: ${index.length} entries → ${outFile}`);
};
