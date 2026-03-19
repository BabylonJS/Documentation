/**
 * Configuration for TypeDoc API documentation generation.
 *
 * We shallow-clone the GitHub repo at the published version tag and run
 * TypeDoc against the real .ts source files. TypeDoc's native git
 * integration then produces correct GitHub links with accurate line numbers.
 */

export interface TypeDocPackageConfig {
    /** npm package name — used only to resolve the latest published version */
    npmPackage: string;
    /** Path to the package directory inside the monorepo (for sparse checkout) */
    repoPath: string;
    /** Path to the TypeScript entry point inside the monorepo */
    entryPoint: string;
}

export interface TypeDocConfig {
    /** GitHub repository in "owner/repo" form */
    githubRepo: string;
    /** Packages to document */
    packages: TypeDocPackageConfig[];
    /** Version tag to clone. If "latest", resolves via npm registry. */
    version: string;
    /** Title shown in generated documentation */
    title: string;
}

const config: TypeDocConfig = {
    githubRepo: "BabylonJS/Babylon.js",
    version: "latest",
    title: "Babylon.js API documentation",
    packages: [
        {
            npmPackage: "@babylonjs/core",
            repoPath: "packages/dev/core",
            entryPoint: "packages/dev/core/src/index.ts",
        },
        {
            npmPackage: "@babylonjs/loaders",
            repoPath: "packages/dev/loaders",
            entryPoint: "packages/dev/loaders/src/index.ts",
        },
    ],
};

export const viewerConfig: TypeDocConfig = {
    githubRepo: "BabylonJS/Babylon.js",
    version: "latest",
    title: "Babylon.js Viewer",
    packages: [
        {
            npmPackage: "@babylonjs/viewer",
            repoPath: "packages/tools/viewer",
            entryPoint: "packages/tools/viewer/src/index.ts",
        },
    ],
};

export default config;
