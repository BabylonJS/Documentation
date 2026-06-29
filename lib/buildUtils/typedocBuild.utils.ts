import { execSync } from "child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import * as path from "path";

import typedocConfig, { TypeDocConfig } from "../../configuration/typedoc.config";
import { buildTypeDocSearchArtifacts, getTypeDocBasePath, getTypeDocFiles } from "./typedoc.utils";

export interface BuildTypeDocArtifactsOptions {
    force?: boolean;
    buildSearchIndex?: boolean;
    buildLegacyRedirects?: boolean;
}

const resolveVersion = (cfg: TypeDocConfig): string => {
    if (cfg.version !== "latest") {
        return cfg.version;
    }
    return execSync(`npm view ${cfg.packages[0].npmPackage} version`, {
        encoding: "utf-8",
    }).trim();
};

const cloneRepo = (tmpPath: string, config: TypeDocConfig, version: string): string => {
    const repoDir = path.join(tmpPath, "repo");
    const firstEntry = path.join(repoDir, config.packages[0].entryPoint);

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
            console.log(`Cloned repo is at ${clonedTag} but need ${version}, re-cloning...`);
        } catch {
            console.log("Cannot determine cloned version, re-cloning...");
        }
        rmSync(repoDir, { recursive: true, force: true });
    }

    const repoUrl = `https://github.com/${config.githubRepo}.git`;
    console.log(`Cloning ${repoUrl} at tag ${version} (shallow + sparse)...`);

    execSync(`git clone --depth 1 --branch ${version} --filter=blob:none --no-checkout ${repoUrl} ${repoDir}`, { stdio: "inherit" });

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

const buildTypeDocArtifactsFromRepoDir = async (repoDir: string, title: string, baseLocation: string, config: TypeDocConfig, options: BuildTypeDocArtifactsOptions = {}) => {
    const basePath = getTypeDocBasePath(baseLocation);
    const tmpPath = path.join(process.cwd(), ".temp", baseLocation);
    const basePathResolved = path.resolve(basePath);

    if (!existsSync(path.join(basePathResolved, "files", "index.html"))) {
        console.log("generating API docs, patience is required");
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
            const relativeToReal = path.relative(wrapperDir, realEntry).replace(/\\/g, "/").replace(/\.(tsx?|jsx?)$/, "");
            const wrapperSource = `/** @module ${pkg.npmPackage} */\nexport * from "${relativeToReal}";\n`;
            writeFileSync(wrapperPath, wrapperSource);
            entryPoints.push(wrapperPath);
        }

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
                include: [...config.packages.map((p) => p.entryPoint), path.relative(repoDir, wrapperDir).replace(/\\/g, "/") + "/*.ts"],
            }),
        );

        try {
            const TypeDoc = await import("typedoc");
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
                basePath: repoDir,
            } as Partial<Record<string, unknown>> as any);

            console.log("API starting", "post bootstrap");

            app.options.addReader(new TypeDoc.TSConfigReader());
            app.options.addReader(new TypeDoc.TypeDocReader());

            const project = await app.convert();

            console.log("API starting", "post convert");

            if (project) {
                const outputDir = path.join(basePathResolved, "files");
                await app.generateDocs(project, outputDir);
            }
        } catch (error) {
            console.error(error);
        }
    }

    console.log("API done");

    if (options.buildSearchIndex !== false) {
        buildTypeDocSearchArtifacts(basePathResolved, baseLocation, { includeLegacyRedirects: options.buildLegacyRedirects !== false });
    }

    return getTypeDocFiles(baseLocation);
};

export const buildTypeDocArtifacts = async (title: string = typedocConfig.title, baseLocation: string = "typedoc", config: TypeDocConfig = typedocConfig, options: BuildTypeDocArtifactsOptions = {}) => {
    const tmpPath = path.join(process.cwd(), ".temp", baseLocation);
    if (options.force || process.env.TYPEDOC_FORCE_REBUILD === "1") {
        console.log("making sure directory is empty", path.resolve(getTypeDocBasePath(baseLocation)));
        rmSync(tmpPath, { recursive: true, force: true });
    }
    const resolvedVersion = resolveVersion(config);
    console.log(`Resolved version: ${resolvedVersion}`);
    const repoDir = cloneRepo(tmpPath, config, resolvedVersion);
    return buildTypeDocArtifactsFromRepoDir(repoDir, title, baseLocation, config, options);
};

export const buildTypeDocArtifactsFromRepository = async (repoDir: string, title: string, baseLocation: string, config: TypeDocConfig, options: BuildTypeDocArtifactsOptions = {}) => {
    if (options.force || process.env.TYPEDOC_FORCE_REBUILD === "1") {
        const tmpPath = path.join(process.cwd(), ".temp", baseLocation);
        console.log("making sure directory is empty", path.resolve(getTypeDocBasePath(baseLocation)));
        rmSync(tmpPath, { recursive: true, force: true });
    }

    return buildTypeDocArtifactsFromRepoDir(repoDir, title, baseLocation, config, options);
};

export const generateTypeDoc = buildTypeDocArtifacts;
