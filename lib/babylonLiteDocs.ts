import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from "fs";
import { basename, join, relative, resolve } from "path";

import matter from "gray-matter";

import { IDocumentationPageProps, IMenuItem } from "./content.interfaces";
import { docsFlavors } from "./docsFlavors";
import { MarkdownMetadata } from "./interfaces";
import { parseMarkdownFrontmatter } from "./markdown/frontmatter";
import { ContentGraph, ContentGraphExampleReference, ContentGraphPage, ContentGraphRouteParams } from "./contentGraph/types";

const babylonLiteGitHubRepo = "BabylonJS/Babylon-Lite";
const babylonLiteRepositoryUrl = `https://github.com/${babylonLiteGitHubRepo}.git`;
const babylonLiteApiUrl = `https://api.github.com/repos/${babylonLiteGitHubRepo}`;
const babylonLiteTempDirectory = join(process.cwd(), ".temp", "babylon-lite");
const babylonLiteTempRepoDirectory = join(babylonLiteTempDirectory, "repo");
const babylonLiteDocsRelativeRoot = join("docs", "lite");
const babylonLiteTypeDocTempDirectory = join(process.cwd(), ".temp", "lite", "typedoc");
const babylonLiteTypeDocSearchDirectory = join(process.cwd(), "public", "api-search", "lite-typedoc");
const localBabylonLiteRepositoryCandidates = ["../Babylon-Lite", "../babylon-lite"];

let cachedRepositoryPath: Promise<string | undefined> | undefined;
let cachedContentGraph: Promise<ContentGraph | undefined> | undefined;

const routeFromId = (id: string[]) => `/${id.join("/")}`;

const titleAcronyms: Record<string, string> = {
    "2d": "2D",
    "3d": "3D",
    api: "API",
    hdr: "HDR",
    pbr: "PBR",
};

const titleFromSlug = (slug: string) => slug
    .replace(/^\d+-/, "")
    .split("-")
    .filter(Boolean)
    .map((part) => titleAcronyms[part.toLowerCase()] ?? part[0].toUpperCase() + part.slice(1))
    .join(" ");

const getMarkdownFiles = (directory: string, files: string[] = []): string[] => {
    if (!existsSync(directory)) {
        return files;
    }

    for (const entry of readdirSync(directory).sort()) {
        const fullPath = join(directory, entry);
        if (statSync(fullPath).isDirectory()) {
            getMarkdownFiles(fullPath, files);
        } else if (entry.endsWith(".md")) {
            files.push(fullPath);
        }
    }

    return files;
};

const idsFromRelativeFile = (relativeFile: string) => relativeFile.replace(/\.md$/, "").split("/");

const routeIdFromRelativeFile = (relativeFile: string) => {
    const ids = idsFromRelativeFile(relativeFile);
    return ids[0] === "porting-guide" ? ["lite"] : ["lite", ...ids];
};

const relativeFileFromIds = (ids: string[]) => `${ids.join("/")}.md`;

const getTitleFromContent = (content: string, fallback: string) => {
    const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
    return heading || fallback;
};

const escapeMdxJsxOutsideCodeBlocks = (content: string) => {
    let inFence = false;
    return content
        .split("\n")
        .map((line) => {
            if (line.trimStart().startsWith("```")) {
                inFence = !inFence;
                return line;
            }
            if (inFence) {
                return line;
            }
            return line.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        })
        .join("\n");
};

const readJson = (filePath: string) => JSON.parse(readFileSync(filePath, "utf-8")) as Record<string, unknown>;

const hasBabylonLiteDocs = (repositoryPath: string) => existsSync(join(repositoryPath, babylonLiteDocsRelativeRoot));

const getLocalBabylonLiteRepositoryPath = () => {
    const localRepositoryPath = process.env.BABYLON_LITE_REPO_PATH;
    if (localRepositoryPath) {
        const resolvedPath = resolve(localRepositoryPath);
        if (hasBabylonLiteDocs(resolvedPath)) {
            return resolvedPath;
        }
        console.warn(`Skipping Babylon Lite docs: BABYLON_LITE_REPO_PATH does not contain ${babylonLiteDocsRelativeRoot}.`);
        return undefined;
    }

    return localBabylonLiteRepositoryCandidates
        .map((candidate) => resolve(candidate))
        .find(hasBabylonLiteDocs);
};

export const isBabylonLiteRepositoryPublic = async () => {
    try {
        const response = await fetch(babylonLiteApiUrl, {
            headers: {
                Accept: "application/vnd.github+json",
                "User-Agent": "BabylonJS-Documentation-build",
            },
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json() as { private?: boolean };
        return data.private === false;
    } catch (error) {
        console.warn("Skipping Babylon Lite docs: unable to check public repository status.", error);
        return false;
    }
};

const clonePublicBabylonLiteRepository = () => {
    if (existsSync(join(babylonLiteTempRepoDirectory, babylonLiteDocsRelativeRoot))) {
        return babylonLiteTempRepoDirectory;
    }

    rmSync(babylonLiteTempRepoDirectory, { recursive: true, force: true });
    mkdirSync(babylonLiteTempDirectory, { recursive: true });

    const env = { ...process.env, GIT_TERMINAL_PROMPT: "0" };
    execSync(`git clone --depth 1 --filter=blob:none --sparse ${babylonLiteRepositoryUrl} ${babylonLiteTempRepoDirectory}`, { stdio: "inherit", env });
    execSync("git sparse-checkout set docs packages/babylon-lite package.json tsconfig.base.json typedoc.json", { cwd: babylonLiteTempRepoDirectory, stdio: "inherit", env });

    return babylonLiteTempRepoDirectory;
};

export const getBabylonLiteRepositoryPath = async () => {
    cachedRepositoryPath ??= (async () => {
        const localRepositoryPath = getLocalBabylonLiteRepositoryPath();
        if (localRepositoryPath) {
            return localRepositoryPath;
        }

        if (!(await isBabylonLiteRepositoryPublic())) {
            console.log("Skipping Babylon Lite docs: BabylonJS/Babylon-Lite is not public.");
            return undefined;
        }

        return clonePublicBabylonLiteRepository();
    })();

    return cachedRepositoryPath;
};

const getBabylonLiteDocsRoot = async () => {
    const repositoryPath = await getBabylonLiteRepositoryPath();
    return repositoryPath ? join(repositoryPath, babylonLiteDocsRelativeRoot) : undefined;
};

const getBabylonLiteRelativeMarkdownFiles = async () => {
    const docsRoot = await getBabylonLiteDocsRoot();
    if (!docsRoot) {
        return [];
    }

    return getMarkdownFiles(docsRoot).map((filePath) => relative(docsRoot, filePath).replace(/\\/g, "/"));
};

const createPlaceholderPageData = (): IDocumentationPageProps => {
    const content = "Babylon Lite documentation is coming on June 17. Please check back then.";
    return {
        id: ["lite"],
        breadcrumbs: [
            {
                name: docsFlavors.lite.label,
                url: docsFlavors.lite.basePath,
            },
        ],
        metadata: {
            title: docsFlavors.lite.label,
            description: "Babylon Lite documentation is coming on June 17.",
            keywords: "babylon lite, documentation",
            imageUrl: "",
            robots: "noindex, nofollow",
        },
        content,
        childPages: {},
        relatedArticles: {},
        relatedExternalLinks: [],
        lastModified: "",
        gitHubUrl: docsFlavors.lite.documentationGithubUrl,
    };
};

export const getBabylonLiteDocPaths = async () => {
    const paths = (await getBabylonLiteRelativeMarkdownFiles()).map((relativeFile) => ({ params: { id: ["lite", ...idsFromRelativeFile(relativeFile)] } }));
    return [{ params: { id: ["lite"] } }, ...paths];
};

export const getBabylonLiteMenuItems = async (): Promise<IMenuItem[] | undefined> => {
    const relativeFiles = await getBabylonLiteRelativeMarkdownFiles();
    if (!relativeFiles.length) {
        return undefined;
    }

    const rootItems: IMenuItem[] = [];
    const rootItemsByPath = new Map<string, IMenuItem>();

    const ensureItem = (pathParts: string[], name: string, url: string) => {
        const key = pathParts.join("/");
        const existing = rootItemsByPath.get(key);
        if (existing) {
            return existing;
        }

        const item: IMenuItem = { name, url, children: [] };
        rootItemsByPath.set(key, item);

        if (pathParts.length === 1) {
            rootItems.push(item);
        } else {
            const parent = rootItemsByPath.get(pathParts.slice(0, -1).join("/"));
            parent?.children?.push(item);
        }

        return item;
    };

    for (const relativeFile of relativeFiles) {
        const ids = idsFromRelativeFile(relativeFile);
        const displayIds = ids[0] === "porting-guide" ? ["porting-guide"] : ids;
        const urlIds = ids[0] === "porting-guide" ? [] : ids;

        displayIds.forEach((part, index) => {
            const pathParts = displayIds.slice(0, index + 1);
            const url = `${docsFlavors.lite.basePath}${index === displayIds.length - 1 ? (urlIds.length ? `/${urlIds.join("/")}` : "") : `/${ids.slice(0, index + 1).join("/")}`}`;
            ensureItem(pathParts, titleFromSlug(part), url);
        });
    }

    for (const item of rootItems) {
        if (item.children?.length) {
            item.url = item.children[0].url;
        }
    }

    return rootItems.sort((left, right) => {
        if (left.name === "Porting Guide") {
            return -1;
        }
        if (right.name === "Porting Guide") {
            return 1;
        }
        return left.name.localeCompare(right.name);
    });
};

export const getBabylonLitePageData = async (id: string[]): Promise<IDocumentationPageProps> => {
    const docsRoot = await getBabylonLiteDocsRoot();
    if (!docsRoot) {
        return createPlaceholderPageData();
    }

    const liteIds = id.slice(1);
    const effectiveIds = liteIds.length ? liteIds : ["porting-guide"];
    const relativeFile = relativeFileFromIds(effectiveIds);
    const fullPath = join(docsRoot, relativeFile);

    if (!existsSync(fullPath)) {
        throw new Error(`Babylon Lite documentation file not found: ${fullPath}`);
    }

    const fileContents = readFileSync(fullPath, "utf-8");
    const parsed = matter(fileContents);
    const flavorMenuItems = await getBabylonLiteMenuItems();
    const fallbackTitle = titleFromSlug(basename(relativeFile, ".md"));
    const title = typeof parsed.data.title === "string" ? parsed.data.title : getTitleFromContent(parsed.content, fallbackTitle);
    const breadcrumbs = [
        {
            name: docsFlavors.lite.label,
            url: docsFlavors.lite.basePath,
        },
        ...effectiveIds.map((part, index) => ({
            name: titleFromSlug(part),
            url: `${docsFlavors.lite.basePath}/${effectiveIds.slice(0, index + 1).join("/")}`,
        })),
    ];

    return {
        id: id.length === 1 ? ["lite"] : id,
        breadcrumbs,
        metadata: {
            title,
            description: typeof parsed.data.description === "string" ? parsed.data.description : `${title} documentation for Babylon Lite.`,
            keywords: "babylon lite, documentation",
            imageUrl: "",
            robots: "noindex, nofollow",
        },
        content: escapeMdxJsxOutsideCodeBlocks(parsed.content),
        childPages: {},
        relatedArticles: {},
        relatedExternalLinks: [],
        lastModified: statSync(fullPath).mtime.toUTCString(),
        gitHubUrl: `${docsFlavors.lite.githubUrl}/blob/master/docs/lite/${relativeFile}`,
        ...(flavorMenuItems ? { flavorMenuItems } : {}),
    };
};

const normalizeFrontmatterKey = (key: string) => {
    const splits = key.split("-");
    return splits
        .map((part, index) => {
            if (index === 0) {
                return part.toLowerCase();
            }
            return `${part[0].toUpperCase()}${part.substr(1).toLowerCase()}`;
        })
        .join("");
};

const applyFrontmatter = (metadata: MarkdownMetadata, frontmatter: Record<string, unknown>) => {
    Object.keys(frontmatter).forEach((key) => {
        (metadata as unknown as Record<string, unknown>)[normalizeFrontmatterKey(key)] = frontmatter[key];
    });
};

const getStringProp = (source: string, prop: string) => {
    const match = new RegExp(`${prop}="(.*?)"`).exec(source);
    return match ? match[1] : undefined;
};

const extractExampleReferences = (rawMarkdown: string): ContentGraphExampleReference[] => {
    const matches = Array.from(rawMarkdown.matchAll(/(<(Playground|nme|nge|NME|NGE|NRGE|nrge|SFE|sfe).*id="([A-Za-z0-9#]*)".*\/>)/g));

    return matches.map(([, full, type, id]) => {
        const typePlayground = type === "Playground" ? "pg" : type.toLowerCase();
        return {
            type: typePlayground as ContentGraphExampleReference["type"],
            id,
            imageUrl: getStringProp(full, "image"),
            engine: getStringProp(full, "engine") as ContentGraphExampleReference["engine"],
            snapshot: getStringProp(full, "snapshot"),
            title: getStringProp(full, "title"),
            description: getStringProp(full, "description"),
            category: getStringProp(full, "category"),
            isMain: /isMain={true}/.test(full),
        };
    });
};

const extractInternalLinks = (rawMarkdown: string) => {
    return Array.from(rawMarkdown.matchAll(/]\(\/(.*?)\)/g))
        .map((match) => match[1].replace(/\)/g, "").split("#")[0].split(" ")[0])
        .filter((link) => link.indexOf(".") === -1 && link.indexOf("/typedoc") === -1 && link.indexOf("/packages") === -1);
};

const buildDefaultMetadata = (title: string): MarkdownMetadata => ({
    title,
    description: `Documentation page for ${title}`,
    keywords: `babylon lite, documentation, ${title}`,
});

const createBabylonLiteContentGraphFromDocsRoot = (docsRoot: string): ContentGraph => {
    const files = getMarkdownFiles(docsRoot)
        .map((filePath) => relative(docsRoot, filePath).replace(/\\/g, "/"))
        .sort();

    const pages: ContentGraphPage[] = files.map((relativeFile, index) => {
        const fullPath = join(docsRoot, relativeFile);
        const rawMarkdown = readFileSync(fullPath, "utf-8");
        const { content, frontmatter } = parseMarkdownFrontmatter(rawMarkdown);
        const effectiveIds = idsFromRelativeFile(relativeFile);
        const id = routeIdFromRelativeFile(relativeFile);
        const title = getTitleFromContent(content, titleFromSlug(basename(relativeFile, ".md")));
        const metadata = buildDefaultMetadata(title);
        applyFrontmatter(metadata, frontmatter);

        return {
            id,
            route: routeFromId(id),
            docItem: { friendlyName: metadata.title, content: relativeFile.replace(/\.md$/, "") },
            contentPath: relativeFile.replace(/\.md$/, ""),
            sourcePath: fullPath,
            rawContent: content,
            frontmatter,
            metadata,
            breadcrumbs: [
                { name: docsFlavors.lite.label, url: docsFlavors.lite.basePath },
                ...effectiveIds.map((part, breadcrumbIndex) => ({
                    name: titleFromSlug(part),
                    url: `${docsFlavors.lite.basePath}/${effectiveIds.slice(0, breadcrumbIndex + 1).join("/")}`,
                })),
            ],
            childIds: [],
            previousId: index > 0 ? routeIdFromRelativeFile(files[index - 1]) : undefined,
            nextId: index < files.length - 1 ? routeIdFromRelativeFile(files[index + 1]) : undefined,
            furtherReading: metadata.furtherReading,
            internalLinks: extractInternalLinks(content),
            examples: extractExampleReferences(content),
            lastModified: statSync(fullPath).mtime,
            gitHubUrl: `${docsFlavors.lite.githubUrl}/blob/master/docs/lite/${relativeFile}`,
        };
    });

    const pagesByRoute = Object.fromEntries(pages.map((page) => [page.route, page]));
    const pagesByContentPath = pages.reduce<Record<string, ContentGraphPage[]>>((lookup, page) => {
        if (page.contentPath) {
            lookup[page.contentPath] = [...(lookup[page.contentPath] || []), page];
        }
        return lookup;
    }, {});
    const routeManifest: ContentGraphRouteParams[] = pages.map((page) => ({ params: { id: page.id, content: page.contentPath } }));

    return {
        pages,
        pagesByRoute,
        pagesByContentPath,
        routeManifest,
    };
};

export const buildBabylonLiteContentGraphFromDocsRoot = createBabylonLiteContentGraphFromDocsRoot;

export const getBabylonLiteContentGraph = async () => {
    cachedContentGraph ??= (async () => {
        const docsRoot = await getBabylonLiteDocsRoot();
        return docsRoot ? createBabylonLiteContentGraphFromDocsRoot(docsRoot) : undefined;
    })();

    return cachedContentGraph;
};

export const getBabylonLitePackageConfig = () => {
    const packageJsonPath = join("packages", "babylon-lite", "package.json");
    return {
        npmPackage: "babylon-lite",
        repoPath: "packages/babylon-lite",
        entryPoint: "packages/babylon-lite/src/index.ts",
        packageJsonPath,
    };
};

export const getBabylonLitePackageVersion = async () => {
    const repositoryPath = await getBabylonLiteRepositoryPath();
    if (!repositoryPath) {
        return undefined;
    }

    const packageJson = readJson(join(repositoryPath, "packages", "babylon-lite", "package.json"));
    return typeof packageJson.version === "string" ? packageJson.version : undefined;
};

export const clearBabylonLiteTypeDocArtifacts = () => {
    rmSync(babylonLiteTypeDocTempDirectory, { recursive: true, force: true });
    rmSync(babylonLiteTypeDocSearchDirectory, { recursive: true, force: true });
};