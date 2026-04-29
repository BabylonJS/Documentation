import * as TypeDoc from "typedoc";
import { writeFileSync, mkdirSync, existsSync, rmSync } from "fs";
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

    // Reuse existing clone only if it matches the requested version tag
    if (existsSync(firstEntry)) {
        try {
            const clonedTag = execSync("git describe --tags --exact-match HEAD", {
                cwd: repoDir,
                encoding: "utf-8",
                stdio: ["pipe", "pipe", "pipe"],
            }).trim();
            if (clonedTag === version) {
                console.log(`Repo already cloned at ${version}, reusing`, repoDir);
                return repoDir;
            }
            console.log(`Cloned repo is at ${clonedTag} but need ${version}, re-cloning…`);
        } catch {
            console.log("Cannot determine cloned version, re-cloning…");
        }
        // Remove stale clone
        rmSync(repoDir, { recursive: true, force: true });
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

        // 2. Create temporary wrapper entry point files that declare the
        //    @module tag and re-export from the real entry points. This
        //    avoids mutating the git clone so line numbers in the checked-out
        //    sources stay aligned with the tagged commit.
        const wrapperDir = path.join(tmpPath, "typedoc-wrappers");
        mkdirSync(wrapperDir, { recursive: true });
        const entryPoints: string[] = [];

        for (const pkg of config.packages) {
            const realEntry = path.join(repoDir, pkg.entryPoint);
            if (!existsSync(realEntry)) {
                throw new Error(`Entry point not found: ${realEntry}`);
            }

            const wrapperFileName = pkg.npmPackage.replace(/[^a-zA-Z0-9_-]/g, "_") + ".ts";
            const wrapperPath = path.join(wrapperDir, wrapperFileName);

            // Relative path from the wrapper file to the real entry point
            const relativeToReal = path
                .relative(wrapperDir, realEntry)
                .replace(/\\/g, "/")
                .replace(/\.(tsx?|jsx?)$/, "");

            const wrapperSource = `/** @module ${pkg.npmPackage} */\nexport * from "${relativeToReal}";\n`;
            writeFileSync(wrapperPath, wrapperSource);
            entryPoints.push(wrapperPath);
        }

        // 3. Write a tsconfig for TypeDoc.
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
                include: [
                    ...config.packages.map((p) => p.entryPoint),
                    path.relative(repoDir, wrapperDir).replace(/\\/g, "/") + "/*.ts",
                ],
            }),
        );

        // 4. Run TypeDoc — git integration is automatic since the
        //    source files live inside a real git clone.
        //    The wrapper entry points live outside the clone, so TypeDoc
        //    resolves @module names from those, while source links still
        //    point at the unmodified files inside the git repo.
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
            name: element.firstChild!.rawText,
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
    const cssArray: string[] = [];
    const metadata: MarkdownMetadata = {
        title: "Babylon.js API",
        description: "[Babylon.js API]",
        keywords: "babylonjs, babylon.js, api, " + baseLocation + "," + id.join(","),
    };
    const titleNode = head!.querySelector("title")!.firstChild;
    if (titleNode) {
        metadata.title = titleNode.rawText.split(" | ")[0];
    }

    try {
        metadata.description = root.querySelector(".tsd-panel .tsd-comment p")!.textContent.substring(0, 150) + " " + metadata.description;
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
 * Scans the generated TypeDoc HTML and produces per-module JSON search
 * indices written to `public/api-search/<prefix>/<module-slug>.json`,
 * plus a small manifest at `public/api-search/<prefix>/manifest.json`.
 *
 * Each entry contains: name, kind (Class, Interface …), module, and url.
 * Splitting by module means the browser only loads the ~10-20 KB file(s)
 * it actually needs instead of a single 400 KB blob.
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
    const byModule: Record<string, { name: string; kind: string; url: string }[]> = {};

    for (const kindDir of Object.keys(KIND_LABELS)) {
        const dir = path.join(filesDir, kindDir);
        if (!existsSync(dir)) continue;

        const htmlFiles = glob.sync("*.html", { cwd: dir });
        for (const file of htmlFiles) {
            const base = file.replace(/\.html$/, "");
            const dotIdx = base.indexOf(".");
            let module = "";
            let name = base;
            if (dotIdx !== -1) {
                const rawModule = base.substring(0, dotIdx);
                name = base.substring(dotIdx + 1);
                module = rawModule.replace(/^_/, "@").replace(/_/g, "/");
            } else {
                module = base.replace(/^_/, "@").replace(/_/g, "/");
                name = module;
            }

            if (!byModule[module]) byModule[module] = [];
            byModule[module].push({
                name,
                kind: KIND_LABELS[kindDir],
                url: `/${baseLocation}/${kindDir}/${base}`,
            });
        }
    }

    // Write per-module files and build manifest
    const prefix = baseLocation.replace(/\//g, "-");
    const outDir = path.join(process.cwd(), "public", "api-search", prefix);
    mkdirSync(outDir, { recursive: true });

    const manifest: { module: string; file: string; count: number }[] = [];

    for (const [module, entries] of Object.entries(byModule)) {
        entries.sort((a, b) => a.name.localeCompare(b.name));
        // Slug: "@babylonjs/core" → "babylonjs-core"
        const slug = module.replace(/^@/, "").replace(/\//g, "-");
        const fileName = `${slug}.json`;
        writeFileSync(path.join(outDir, fileName), JSON.stringify(entries));
        manifest.push({ module, file: fileName, count: entries.length });
    }

    manifest.sort((a, b) => a.module.localeCompare(b.module));
    writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest));

    const total = manifest.reduce((sum, m) => sum + m.count, 0);
    console.log(`Search index: ${total} entries across ${manifest.length} modules → ${outDir}/`);

    // Build a legacy redirect map so old BABYLON.* URLs can be resolved.
    // Only generated on CI to avoid slowing down local dev builds.
    if (process.env.PRODUCTION) {
        const redirectMap: Record<string, string> = {};
        for (const entries of Object.values(byModule)) {
            for (const entry of entries) {
                const urlParts = entry.url.split("/");
                const kind = urlParts[urlParts.length - 2];
                const key = `${kind}/${entry.name}`;
                if (!redirectMap[key]) {
                    redirectMap[key] = entry.url;
                }
            }
        }
        writeFileSync(path.join(outDir, "legacy-redirects.json"), JSON.stringify(redirectMap));
        console.log(`Legacy redirect map: ${Object.keys(redirectMap).length} entries`);
    }
};
