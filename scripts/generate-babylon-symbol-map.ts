import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

export const SYMBOL_MAP_SCHEMA_VERSION = 3;

export interface PackageDefinition {
    name: string;
    namespace: string;
    priority: number;
    optional?: boolean;
}

export const PACKAGE_DEFINITIONS: readonly PackageDefinition[] = [
    { name: "@babylonjs/core", namespace: "BABYLON", priority: 0 },
    { name: "@babylonjs/materials", namespace: "BABYLON", priority: 10 },
    { name: "@babylonjs/procedural-textures", namespace: "BABYLON", priority: 20 },
    { name: "@babylonjs/post-processes", namespace: "BABYLON", priority: 30 },
    { name: "@babylonjs/loaders", namespace: "BABYLON", priority: 40 },
    { name: "@babylonjs/serializers", namespace: "BABYLON", priority: 50 },
    { name: "@babylonjs/addons", namespace: "BABYLON", priority: 60 },
    { name: "@babylonjs/gui", namespace: "BABYLON.GUI", priority: 0 },
    { name: "@babylonjs/inspector", namespace: "BABYLON.INSPECTOR", priority: 0, optional: true },
    { name: "@babylonjs/inspector-v2", namespace: "BABYLON.INSPECTOR", priority: 10, optional: true },
] as const;

export interface NamespaceAlias {
    parentNamespace: string;
    symbol: string;
    packages: string[];
    targetNamespace: string;
    members?: Record<string, string>;
}

export const CONFIGURED_NAMESPACE_ALIASES: Record<string, NamespaceAlias> = {
    "BABYLON.GUI": {
        parentNamespace: "BABYLON",
        symbol: "GUI",
        packages: ["@babylonjs/gui"],
        targetNamespace: "BABYLON.GUI",
    },
    "BABYLON.INSPECTOR": {
        parentNamespace: "BABYLON",
        symbol: "INSPECTOR",
        packages: ["@babylonjs/inspector", "@babylonjs/inspector-v2"],
        targetNamespace: "BABYLON.INSPECTOR",
    },
};

interface PackageManifest {
    name?: unknown;
    version?: unknown;
    types?: unknown;
}

type ValidPackageManifest = Omit<PackageManifest, "name" | "version"> & {
    name: string;
    version: string;
};

interface ExportOrigin {
    declarationFile: string;
    exportedName: string;
    typeOnly: boolean;
}

interface ModuleExports {
    exports: Map<string, ExportOrigin[]>;
}

export interface SymbolCandidate {
    package: string;
    importPath: string;
    typeOnly: boolean;
    pure: {
        available: boolean;
        importPath?: string;
    };
}

export interface ResolvedSymbol {
    status: "resolved";
    resolution: SymbolCandidate;
}

export interface AmbiguousSymbol {
    status: "ambiguous";
    preferredCandidate: SymbolCandidate;
    candidates: SymbolCandidate[];
}

export interface UnresolvedSymbol {
    status: "unresolved";
    reason: string;
    declarationModules: string[];
}

export type SymbolMapEntry = ResolvedSymbol | AmbiguousSymbol | UnresolvedSymbol;

export interface BabylonSymbolMap {
    schemaVersion: number;
    metadata: {
        generator: string;
        packageVersions: Record<string, string>;
    };
    namespaceAliases: Record<string, NamespaceAlias>;
    namespaces: Record<
        string,
        {
            packagePriority: string[];
            purePackages: Record<string, PurePackageMetadata>;
            symbols: Record<string, SymbolMapEntry>;
        }
    >;
}

export interface PurePackageMetadata {
    importPath: string;
    functions: string[];
    members: Record<string, string[]>;
    registeredMembers: Record<string, string[]>;
}

interface PackageSurface {
    definition: PackageDefinition;
    root: string;
    version: string;
    pure?: PurePackageMetadata;
    symbols: Map<string, SymbolCandidate | UnresolvedSymbol | AmbiguousSymbol>;
}

interface ModuleInfo {
    directRuntimeExports: Set<string>;
    directTypeExports: Set<string>;
    imports: Map<string, { moduleFile: string; importedName: string; typeOnly: boolean }>;
    exportDeclarations: Array<{
        moduleFile?: string;
        isTypeOnly: boolean;
        named?: Array<{ exportedName: string; importedName: string; isTypeOnly: boolean }>;
    }>;
}

const DECLARATION_SUFFIX = /\.d\.(?:c|m)?ts$/;
const IMPLEMENTATION_SUFFIX = /\.(?:c|m)?js$/;

function compareText(left: string, right: string): number {
    return left.localeCompare(right, "en");
}

function sortRecord<T>(entries: Iterable<readonly [string, T]>): Record<string, T> {
    return Object.fromEntries([...entries].sort(([left], [right]) => compareText(left, right)));
}

export function normalizeModuleSpecifier(packageName: string, relativeDeclarationPath: string): string {
    const normalizedPath = relativeDeclarationPath
        .replaceAll(path.sep, "/")
        .replace(DECLARATION_SUFFIX, "")
        .replace(IMPLEMENTATION_SUFFIX, "");
    return normalizedPath ? `${packageName}/${normalizedPath}` : packageName;
}

function declarationToImplementation(declarationFile: string): string {
    return declarationFile.replace(DECLARATION_SUFFIX, ".js");
}

function isExcludedDeepImport(relativeDeclarationPath: string): boolean {
    const normalized = relativeDeclarationPath.replaceAll(path.sep, "/");
    const withoutSuffix = normalized.replace(DECLARATION_SUFFIX, "");
    const segments = withoutSuffix.split("/");
    const baseName = segments.at(-1)?.toLowerCase() ?? "";

    return (
        segments.some((segment) => {
            const lower = segment.toLowerCase();
            return lower === "internal" || lower === "private" || lower.includes("legacy");
        }) ||
        baseName === "index" ||
        baseName === "pure"
    );
}

function isTypesOnlyModule(relativeDeclarationPath: string): boolean {
    const normalized = relativeDeclarationPath.replaceAll(path.sep, "/");
    return /(?:^|\/)[^/]*\.types\.d\.(?:c|m)?ts$/i.test(normalized);
}

function declarationNameText(name: ts.DeclarationName | undefined): string | undefined {
    if (name && (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name))) {
        return name.text;
    }
    return undefined;
}

function isPublicStaticMember(member: ts.ClassElement): boolean {
    const modifiers = ts.canHaveModifiers(member) ? ts.getModifiers(member) : undefined;
    return (
        modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword) === true &&
        modifiers.every(
            (modifier) => modifier.kind !== ts.SyntaxKind.PrivateKeyword && modifier.kind !== ts.SyntaxKind.ProtectedKeyword,
        )
    );
}

function exportShape(origin: ExportOrigin): { function: boolean; members: string[] } {
    const sourceText = fs.readFileSync(origin.declarationFile, "utf8");
    const sourceFile = ts.createSourceFile(origin.declarationFile, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const declaredFunctions = new Set(
        sourceFile.statements
            .filter((statement): statement is ts.FunctionDeclaration => ts.isFunctionDeclaration(statement))
            .map((statement) => statement.name?.text)
            .filter((name): name is string => Boolean(name)),
    );
    let isFunction = false;
    const members = new Set<string>();

    for (const statement of sourceFile.statements) {
        if (ts.isFunctionDeclaration(statement) && statement.name?.text === origin.exportedName) {
            isFunction = true;
        } else if (ts.isClassDeclaration(statement) && statement.name?.text === origin.exportedName) {
            for (const member of statement.members) {
                if (isPublicStaticMember(member)) {
                    const name = declarationNameText("name" in member ? member.name : undefined);
                    if (name) {
                        members.add(name);
                    }
                }
            }
        } else if (ts.isEnumDeclaration(statement) && statement.name.text === origin.exportedName) {
            for (const member of statement.members) {
                const name = declarationNameText(member.name);
                if (name) {
                    members.add(name);
                }
            }
        } else if (ts.isVariableStatement(statement)) {
            for (const declaration of statement.declarationList.declarations) {
                if (!ts.isIdentifier(declaration.name) || declaration.name.text !== origin.exportedName) {
                    continue;
                }
                if (
                    declaration.type &&
                    (ts.isFunctionTypeNode(declaration.type) ||
                        (ts.isTypeQueryNode(declaration.type) &&
                            ts.isIdentifier(declaration.type.exprName) &&
                            declaredFunctions.has(declaration.type.exprName.text)))
                ) {
                    isFunction = true;
                }
                if (declaration.type && ts.isTypeLiteralNode(declaration.type)) {
                    for (const member of declaration.type.members) {
                        const name = declarationNameText("name" in member ? member.name : undefined);
                        if (name) {
                            members.add(name);
                        }
                    }
                }
            }
        }
    }

    return { function: isFunction, members: [...members].sort(compareText) };
}

function collectNamespaceAugmentations(packageRoot: string, exportedRoots: Set<string>): Map<string, string[]> {
    const collected = new Map<string, Set<string>>();
    const visitDirectory = (directory: string): void => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const entryPath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                visitDirectory(entryPath);
            } else if (entry.isFile() && isTypesOnlyModule(entryPath)) {
                const sourceFile = ts.createSourceFile(
                    entryPath,
                    fs.readFileSync(entryPath, "utf8"),
                    ts.ScriptTarget.Latest,
                    true,
                    ts.ScriptKind.TS,
                );
                const visit = (node: ts.Node): void => {
                    if (
                        ts.isModuleDeclaration(node) &&
                        ts.isIdentifier(node.name) &&
                        exportedRoots.has(node.name.text) &&
                        node.body &&
                        ts.isModuleBlock(node.body)
                    ) {
                        const names = collected.get(node.name.text) ?? new Set<string>();
                        for (const statement of node.body.statements) {
                            if (ts.isVariableStatement(statement)) {
                                for (const declaration of statement.declarationList.declarations) {
                                    for (const name of bindingNames(declaration.name)) {
                                        names.add(name);
                                    }
                                }
                            } else if (
                                ts.isFunctionDeclaration(statement) ||
                                ts.isClassDeclaration(statement) ||
                                ts.isEnumDeclaration(statement)
                            ) {
                                const name = declarationNameText(statement.name);
                                if (name) {
                                    names.add(name);
                                }
                            }
                        }
                        if (names.size > 0) {
                            collected.set(node.name.text, names);
                        }
                    }
                    ts.forEachChild(node, visit);
                };
                visit(sourceFile);
            }
        }
    };
    visitDirectory(packageRoot);
    return new Map([...collected].map(([root, names]) => [root, [...names].sort(compareText)]));
}

function buildPurePackageMetadata(
    definition: PackageDefinition,
    packageRoot: string,
    publicExports: Map<string, ExportOrigin[]>,
    pureExports: Map<string, ExportOrigin[]>,
): PurePackageMetadata {
    const functions = new Set<string>();
    const members = new Map<string, string[]>();

    for (const [exportedName, origins] of pureExports) {
        const exportedMembers = new Set<string>();
        for (const origin of origins) {
            const shape = exportShape(origin);
            if (shape.function) {
                functions.add(exportedName);
            }
            for (const member of shape.members) {
                exportedMembers.add(member);
            }
        }
        if (exportedMembers.size > 0) {
            members.set(exportedName, [...exportedMembers].sort(compareText));
        }
    }

    const augmentedMembers = collectNamespaceAugmentations(packageRoot, new Set(pureExports.keys()));
    const registeredMembers = new Map<string, string[]>();
    for (const root of pureExports.keys()) {
        if (!functions.has(`Register${root}`)) {
            continue;
        }
        const pureMembers = new Set(members.get(root) ?? []);
        const standardMembers = new Set(
            [
                ...(publicExports.get(root) ?? []).flatMap((origin) => exportShape(origin).members),
                ...(augmentedMembers.get(root) ?? []),
            ],
        );
        const registrationOnlyMembers = [...standardMembers].filter((member) => !pureMembers.has(member)).sort(compareText);
        if (registrationOnlyMembers.length > 0) {
            registeredMembers.set(root, registrationOnlyMembers);
        }
    }

    return {
        importPath: `${definition.name}/pure`,
        functions: [...functions].sort(compareText),
        members: sortRecord(members),
        registeredMembers: sortRecord(registeredMembers),
    };
}

function bindingNames(name: ts.BindingName): string[] {
    if (ts.isIdentifier(name)) {
        return [name.text];
    }
    return name.elements.flatMap((element) => (ts.isOmittedExpression(element) ? [] : bindingNames(element.name)));
}

function hasExportModifier(node: ts.Node): boolean {
    return ts.canHaveModifiers(node) && ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) === true;
}

function runtimeDeclarationNames(statement: ts.Statement): string[] {
    if (!hasExportModifier(statement)) {
        return [];
    }
    if (
        (ts.isClassDeclaration(statement) ||
            ts.isFunctionDeclaration(statement) ||
            ts.isEnumDeclaration(statement) ||
            ts.isModuleDeclaration(statement)) &&
        statement.name &&
        ts.isIdentifier(statement.name)
    ) {
        return [statement.name.text];
    }
    if (ts.isVariableStatement(statement)) {
        return statement.declarationList.declarations.flatMap((declaration) => bindingNames(declaration.name));
    }
    return [];
}

function typeDeclarationNames(statement: ts.Statement): string[] {
    if (!hasExportModifier(statement)) {
        return [];
    }
    if (
        (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) &&
        statement.name
    ) {
        return [statement.name.text];
    }
    return [];
}

class PackageExportResolver {
    private readonly moduleInfoCache = new Map<string, ModuleInfo>();
    private readonly moduleExportsCache = new Map<string, ModuleExports>();

    public constructor(private readonly packageRoot: string) {}

    public resolveEntry(entryFile: string): ModuleExports {
        return this.resolveModule(entryFile, []);
    }

    private resolveModule(moduleFile: string, stack: string[]): ModuleExports {
        const cached = this.moduleExportsCache.get(moduleFile);
        if (cached) {
            return cached;
        }
        if (stack.includes(moduleFile)) {
            return { exports: new Map() };
        }

        const info = this.readModuleInfo(moduleFile);
        const resolved = new Map<string, ExportOrigin[]>();
        for (const name of info.directRuntimeExports) {
            resolved.set(name, [{ declarationFile: moduleFile, exportedName: name, typeOnly: false }]);
        }
        for (const name of info.directTypeExports) {
            resolved.set(name, [{ declarationFile: moduleFile, exportedName: name, typeOnly: true }]);
        }

        for (const declaration of info.exportDeclarations) {
            if (!declaration.named) {
                if (!declaration.moduleFile) {
                    throw new Error(`Malformed export-all declaration in ${moduleFile}`);
                }
                const target = this.resolveModule(declaration.moduleFile, [...stack, moduleFile]);
                for (const [name, origins] of target.exports) {
                    this.addOrigins(resolved, name, this.asTypeOnly(origins, declaration.isTypeOnly));
                }
                continue;
            }

            for (const element of declaration.named) {
                let origins: ExportOrigin[] | undefined;
                if (declaration.moduleFile) {
                    origins = this.resolveModule(declaration.moduleFile, [...stack, moduleFile]).exports.get(element.importedName);
                } else {
                    origins = resolved.get(element.importedName);
                    if (!origins) {
                        const imported = info.imports.get(element.importedName);
                        if (imported) {
                            origins = this.resolveModule(imported.moduleFile, [...stack, moduleFile]).exports.get(imported.importedName);
                            if (origins) {
                                origins = this.asTypeOnly(origins, imported.typeOnly);
                            }
                        }
                    }
                }
                if (origins) {
                    this.addOrigins(
                        resolved,
                        element.exportedName,
                        this.asTypeOnly(origins, declaration.isTypeOnly || element.isTypeOnly),
                    );
                }
            }
        }

        const result = { exports: resolved };
        this.moduleExportsCache.set(moduleFile, result);
        return result;
    }

    private asTypeOnly(origins: ExportOrigin[], forceTypeOnly: boolean): ExportOrigin[] {
        return forceTypeOnly ? origins.map((origin) => ({ ...origin, typeOnly: true })) : origins;
    }

    private addOrigins(target: Map<string, ExportOrigin[]>, name: string, origins: ExportOrigin[]): void {
        const existing = target.get(name) ?? [];
        const keys = new Set(existing.map((origin) => `${origin.declarationFile}\0${origin.exportedName}\0${origin.typeOnly}`));
        for (const origin of origins) {
            const key = `${origin.declarationFile}\0${origin.exportedName}\0${origin.typeOnly}`;
            if (!keys.has(key)) {
                existing.push(origin);
                keys.add(key);
            }
        }
        existing.sort((left, right) => compareText(left.declarationFile, right.declarationFile));
        target.set(name, existing);
    }

    private readModuleInfo(moduleFile: string): ModuleInfo {
        const cached = this.moduleInfoCache.get(moduleFile);
        if (cached) {
            return cached;
        }
        if (!fs.existsSync(moduleFile)) {
            throw new Error(`Referenced declaration module does not exist: ${moduleFile}`);
        }
        const sourceText = fs.readFileSync(moduleFile, "utf8");
        const sourceFile = ts.createSourceFile(moduleFile, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        const parseDiagnostics = (sourceFile as ts.SourceFile & { parseDiagnostics?: readonly ts.Diagnostic[] }).parseDiagnostics ?? [];
        if (parseDiagnostics.length > 0) {
            throw new Error(
                `Malformed declaration module ${moduleFile}:\n${ts.formatDiagnostics(parseDiagnostics, {
                    getCanonicalFileName: (fileName) => fileName,
                    getCurrentDirectory: () => this.packageRoot,
                    getNewLine: () => "\n",
                })}`,
            );
        }
        const directRuntimeExports = new Set<string>();
        const directTypeExports = new Set<string>();
        const imports = new Map<string, { moduleFile: string; importedName: string; typeOnly: boolean }>();
        const exportDeclarations: ModuleInfo["exportDeclarations"] = [];

        for (const statement of sourceFile.statements) {
            for (const name of runtimeDeclarationNames(statement)) {
                directRuntimeExports.add(name);
            }
            for (const name of typeDeclarationNames(statement)) {
                directTypeExports.add(name);
            }
            if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier) && statement.importClause) {
                const moduleFileForImport = this.resolveModuleSpecifier(moduleFile, statement.moduleSpecifier.text);
                if (!moduleFileForImport) {
                    continue;
                }
                if (statement.importClause.name) {
                    imports.set(statement.importClause.name.text, {
                        moduleFile: moduleFileForImport,
                        importedName: "default",
                        typeOnly: statement.importClause.isTypeOnly,
                    });
                }
                const bindings = statement.importClause.namedBindings;
                if (bindings && ts.isNamedImports(bindings)) {
                    for (const element of bindings.elements) {
                        imports.set(element.name.text, {
                            moduleFile: moduleFileForImport,
                            importedName: element.propertyName?.text ?? element.name.text,
                            typeOnly: statement.importClause.isTypeOnly || element.isTypeOnly,
                        });
                    }
                }
            }
            if (!ts.isExportDeclaration(statement)) {
                continue;
            }
            const moduleFileForExport =
                statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)
                    ? this.resolveModuleSpecifier(moduleFile, statement.moduleSpecifier.text)
                    : undefined;
            if (statement.moduleSpecifier && !moduleFileForExport) {
                continue;
            }
            if (!statement.exportClause) {
                exportDeclarations.push({ moduleFile: moduleFileForExport, isTypeOnly: statement.isTypeOnly });
            } else if (ts.isNamedExports(statement.exportClause)) {
                exportDeclarations.push({
                    moduleFile: moduleFileForExport,
                    isTypeOnly: statement.isTypeOnly,
                    named: statement.exportClause.elements.map((element) => ({
                        exportedName: element.name.text,
                        importedName: element.propertyName?.text ?? element.name.text,
                        isTypeOnly: element.isTypeOnly,
                    })),
                });
            } else if (moduleFileForExport) {
                directRuntimeExports.add(statement.exportClause.name.text);
            }
        }

        const info = { directRuntimeExports, directTypeExports, imports, exportDeclarations };
        this.moduleInfoCache.set(moduleFile, info);
        return info;
    }

    private resolveModuleSpecifier(containingFile: string, specifier: string): string | undefined {
        if (!specifier.startsWith(".")) {
            return undefined;
        }
        const absoluteBase = path.resolve(path.dirname(containingFile), specifier);
        const candidates = [
            absoluteBase.replace(IMPLEMENTATION_SUFFIX, ".d.ts"),
            absoluteBase,
            `${absoluteBase}.d.ts`,
            path.join(absoluteBase, "index.d.ts"),
        ];
        const resolved = candidates.find((candidate) => DECLARATION_SUFFIX.test(candidate) && fs.existsSync(candidate));
        if (!resolved) {
            throw new Error(`Cannot resolve ${specifier} from ${containingFile}`);
        }
        const relative = path.relative(this.packageRoot, resolved);
        if (relative.startsWith("..") || path.isAbsolute(relative)) {
            throw new Error(`Declaration export escapes package root: ${specifier} from ${containingFile}`);
        }
        return resolved;
    }
}

function findPackageRoots(packagesRoot: string): Map<string, { root: string; manifest: ValidPackageManifest }> {
    if (!fs.statSync(packagesRoot, { throwIfNoEntry: false })?.isDirectory()) {
        throw new Error(`Packages root is not a directory: ${packagesRoot}`);
    }
    const found = new Map<string, { root: string; manifest: ValidPackageManifest }>();
    const directories = fs.readdirSync(packagesRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());

    for (const directory of directories) {
        for (const candidateRoot of [path.join(packagesRoot, directory.name, "package"), path.join(packagesRoot, directory.name)]) {
            const manifestPath = path.join(candidateRoot, "package.json");
            if (!fs.existsSync(manifestPath)) {
                continue;
            }
            let manifest: PackageManifest;
            try {
                manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as PackageManifest;
            } catch (error) {
                throw new Error(`Malformed package.json at ${manifestPath}: ${error instanceof Error ? error.message : String(error)}`);
            }
            if (typeof manifest.name !== "string" || typeof manifest.version !== "string") {
                throw new Error(`Package manifest must contain string name and version: ${manifestPath}`);
            }
            if (found.has(manifest.name)) {
                throw new Error(`Duplicate extracted package ${manifest.name}`);
            }
            found.set(manifest.name, {
                root: candidateRoot,
                manifest: manifest as ValidPackageManifest,
            });
            break;
        }
    }
    return found;
}

function preferredDeclarationFile(packageRoot: string, origin: ExportOrigin): string | undefined {
    const standardMirror = origin.declarationFile.replace(/\.pure(\.d\.(?:c|m)?ts)$/, "$1");
    const candidates = standardMirror !== origin.declarationFile ? [standardMirror, origin.declarationFile] : [origin.declarationFile];
    const validCandidates = candidates.filter((candidate) => {
        if (
            !fs.existsSync(candidate) ||
            (!origin.typeOnly && !fs.existsSync(declarationToImplementation(candidate)))
        ) {
            return false;
        }
        return !isExcludedDeepImport(path.relative(packageRoot, candidate));
    });
    if (validCandidates.length === 0) {
        return undefined;
    }

    return validCandidates.sort((left, right) => {
        const leftRelative = path.relative(packageRoot, left);
        const rightRelative = path.relative(packageRoot, right);
        const leftTypesPenalty = /(?:^|\/)[^/]*types(?:\.d\.(?:c|m)?ts)$/i.test(leftRelative) ? 1 : 0;
        const rightTypesPenalty = /(?:^|\/)[^/]*types(?:\.d\.(?:c|m)?ts)$/i.test(rightRelative) ? 1 : 0;
        return leftTypesPenalty - rightTypesPenalty || compareText(leftRelative, rightRelative);
    })[0];
}

function buildPackageSurface(
    definition: PackageDefinition,
    extracted: { root: string; manifest: ValidPackageManifest },
): PackageSurface {
    const typesEntry = typeof extracted.manifest.types === "string" ? extracted.manifest.types : "index.d.ts";
    const entryFile = path.join(extracted.root, typesEntry);
    if (!fs.existsSync(entryFile)) {
        throw new Error(`${definition.name} types entry does not exist: ${typesEntry}`);
    }
    const resolver = new PackageExportResolver(extracted.root);
    const publicExports = resolver.resolveEntry(entryFile).exports;
    const pureEntry = path.join(extracted.root, "pure.d.ts");
    const pureExports = fs.existsSync(pureEntry) ? resolver.resolveEntry(pureEntry).exports : new Map<string, ExportOrigin[]>();
    const symbols = new Map<string, SymbolCandidate | UnresolvedSymbol | AmbiguousSymbol>();

    for (const [symbol, origins] of publicExports) {
        const runtime = origins.some((origin) => !origin.typeOnly);
        const preferredOrigins = runtime ? origins.filter((origin) => !origin.typeOnly) : origins;
        let declarations = preferredOrigins
            .map((origin) => ({ origin, file: preferredDeclarationFile(extracted.root, origin) }))
            .filter((item): item is { origin: ExportOrigin; file: string } => Boolean(item.file));
        if (runtime) {
            const runtimeDeclarations = declarations.filter(
                ({ file }) => !isTypesOnlyModule(path.relative(extracted.root, file)),
            );
            if (runtimeDeclarations.length > 0) {
                declarations = runtimeDeclarations;
            }
        }
        declarations = declarations.filter(
            ({ file }, index, all) => all.findIndex((other) => other.file === file) === index,
        );
        if (declarations.length === 0) {
            symbols.set(symbol, {
                status: "unresolved",
                reason: `No public ${runtime ? "runtime " : ""}deep-import declaration remained after path filtering`,
                declarationModules: origins.map((origin) => normalizeModuleSpecifier(definition.name, path.relative(extracted.root, origin.declarationFile))).sort(compareText),
            });
            continue;
        }

        const candidates = declarations.map<SymbolCandidate>(({ file: declarationFile }) => ({
            package: definition.name,
            importPath: normalizeModuleSpecifier(definition.name, path.relative(extracted.root, declarationFile)),
            typeOnly: !runtime,
            pure: pureExports.has(symbol)
                ? {
                      available: true,
                      importPath: `${definition.name}/pure`,
                  }
                : { available: false },
        }));
        if (candidates.length === 1) {
            symbols.set(symbol, candidates[0]);
        } else {
            symbols.set(symbol, {
                status: "ambiguous",
                preferredCandidate: candidates[0],
                candidates,
            });
        }
    }

    return {
        definition,
        root: extracted.root,
        version: extracted.manifest.version,
        pure: fs.existsSync(pureEntry) ? buildPurePackageMetadata(definition, extracted.root, publicExports, pureExports) : undefined,
        symbols,
    };
}

function candidateKey(candidate: SymbolCandidate): string {
    return `${candidate.package}\0${candidate.importPath}`;
}

function candidatesForPackageEntry(entry: SymbolCandidate | UnresolvedSymbol | AmbiguousSymbol): SymbolCandidate[] {
    if ("package" in entry) {
        return [entry];
    }
    return entry.status === "ambiguous" ? entry.candidates : [];
}

function entityNameParts(name: ts.EntityName): string[] {
    if (ts.isIdentifier(name)) {
        return [name.text];
    }
    return [...entityNameParts(name.left), name.right.text];
}

function collectCompatibilityAliases(surface: PackageSurface): Map<string, NamespaceAlias> {
    const aliases = new Map<string, NamespaceAlias>();
    const legacyRoot = path.join(surface.root, "Legacy");
    if (!fs.statSync(legacyRoot, { throwIfNoEntry: false })?.isDirectory()) {
        return aliases;
    }

    for (const declarationFile of globDeclarationFiles(legacyRoot)) {
        const sourceFile = ts.createSourceFile(
            declarationFile,
            fs.readFileSync(declarationFile, "utf8"),
            ts.ScriptTarget.Latest,
            true,
            ts.ScriptKind.TS,
        );
        for (const statement of sourceFile.statements) {
            if (!ts.isVariableStatement(statement) || !hasExportModifier(statement)) {
                continue;
            }
            for (const declaration of statement.declarationList.declarations) {
                if (!ts.isIdentifier(declaration.name) || !declaration.type || !ts.isTypeLiteralNode(declaration.type)) {
                    continue;
                }
                const members = new Map<string, string>();
                for (const member of declaration.type.members) {
                    if (
                        !ts.isPropertySignature(member) ||
                        !member.type ||
                        !ts.isTypeQueryNode(member.type)
                    ) {
                        continue;
                    }
                    const memberName = declarationNameText(member.name);
                    const targetParts = entityNameParts(member.type.exprName);
                    const targetSymbol = targetParts.length === 2 && targetParts[0] === "BABYLON" ? targetParts[1] : undefined;
                    const target = targetSymbol ? surface.symbols.get(targetSymbol) : undefined;
                    const targetCandidates = target ? candidatesForPackageEntry(target) : [];
                    if (
                        memberName &&
                        targetSymbol &&
                        targetCandidates.some((candidate) => candidate.package === surface.definition.name)
                    ) {
                        members.set(memberName, targetSymbol);
                    }
                }
                if (members.size === 0) {
                    continue;
                }
                const aliasName = `${surface.definition.namespace}.${declaration.name.text}`;
                aliases.set(aliasName, {
                    parentNamespace: surface.definition.namespace,
                    symbol: declaration.name.text,
                    packages: [surface.definition.name],
                    targetNamespace: surface.definition.namespace,
                    members: sortRecord(members),
                });
            }
        }
    }
    return aliases;
}

function globDeclarationFiles(root: string): string[] {
    const files: string[] = [];
    const visit = (directory: string): void => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const entryPath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                visit(entryPath);
            } else if (entry.isFile() && DECLARATION_SUFFIX.test(entry.name)) {
                files.push(entryPath);
            }
        }
    };
    visit(root);
    return files.sort(compareText);
}

export function generateBabylonSymbolMap(packagesRoot: string): BabylonSymbolMap {
    const extractedPackages = findPackageRoots(path.resolve(packagesRoot));
    const surfaces = PACKAGE_DEFINITIONS.flatMap((definition) => {
        const extracted = extractedPackages.get(definition.name);
        if (!extracted) {
            if (definition.optional) {
                return [];
            }
            throw new Error(`Required Babylon package is missing: ${definition.name}`);
        }
        return [buildPackageSurface(definition, extracted)];
    });

    const namespaces: BabylonSymbolMap["namespaces"] = {};
    for (const namespace of [...new Set(surfaces.map((surface) => surface.definition.namespace))].sort(compareText)) {
        const namespaceSurfaces = surfaces
            .filter((surface) => surface.definition.namespace === namespace)
            .sort((left, right) => left.definition.priority - right.definition.priority || compareText(left.definition.name, right.definition.name));
        const symbolNames = [...new Set(namespaceSurfaces.flatMap((surface) => [...surface.symbols.keys()]))].sort(compareText);
        const symbols = new Map<string, SymbolMapEntry>();

        for (const symbol of symbolNames) {
            const packageEntries = namespaceSurfaces
                .map((surface) => ({ surface, entry: surface.symbols.get(symbol) }))
                .filter((item): item is { surface: PackageSurface; entry: NonNullable<typeof item.entry> } => Boolean(item.entry));
            const candidates = packageEntries
                .flatMap(({ entry }) => candidatesForPackageEntry(entry))
                .filter((candidate, index, all) => all.findIndex((other) => candidateKey(other) === candidateKey(candidate)) === index);
            if (candidates.length === 1 && packageEntries.length === 1 && !("status" in packageEntries[0].entry)) {
                symbols.set(symbol, { status: "resolved", resolution: candidates[0] });
            } else if (candidates.length > 0) {
                symbols.set(symbol, {
                    status: "ambiguous",
                    preferredCandidate: candidates[0],
                    candidates,
                });
            } else {
                const unresolvedEntries = packageEntries
                    .map(({ entry }) => entry)
                    .filter((entry): entry is UnresolvedSymbol => "status" in entry && entry.status === "unresolved");
                symbols.set(symbol, {
                    status: "unresolved",
                    reason: unresolvedEntries.map((entry) => entry.reason).join("; ") || "No runtime export candidate",
                    declarationModules: [...new Set(unresolvedEntries.flatMap((entry) => entry.declarationModules))].sort(compareText),
                });
            }
        }

        namespaces[namespace] = {
            packagePriority: namespaceSurfaces.map((surface) => surface.definition.name),
            purePackages: sortRecord(
                namespaceSurfaces
                    .filter((surface): surface is PackageSurface & { pure: PurePackageMetadata } => Boolean(surface.pure))
                    .map((surface) => [surface.definition.name, surface.pure] as const),
            ),
            symbols: sortRecord(symbols),
        };
    }

    const availablePackages = new Set(surfaces.map((surface) => surface.definition.name));
    const namespaceAliases = new Map<string, NamespaceAlias>(
        Object.entries(CONFIGURED_NAMESPACE_ALIASES).flatMap(([name, alias]) => {
            const packages = alias.packages.filter((packageName) => availablePackages.has(packageName));
            return packages.length > 0 ? [[name, { ...alias, packages }] as const] : [];
        }),
    );
    for (const surface of surfaces) {
        for (const [name, alias] of collectCompatibilityAliases(surface)) {
            const existing = namespaceAliases.get(name);
            if (!existing) {
                namespaceAliases.set(name, alias);
                continue;
            }
            namespaceAliases.set(name, {
                ...existing,
                packages: [...new Set([...existing.packages, ...alias.packages])].sort(compareText),
                members: sortRecord([
                    ...Object.entries(existing.members ?? {}),
                    ...Object.entries(alias.members ?? {}),
                ]),
            });
        }
    }

    return {
        schemaVersion: SYMBOL_MAP_SCHEMA_VERSION,
        metadata: {
            generator: "scripts/generate-babylon-symbol-map.ts",
            packageVersions: sortRecord(surfaces.map((surface) => [surface.definition.name, surface.version] as const)),
        },
        namespaceAliases: sortRecord(namespaceAliases),
        namespaces: sortRecord(Object.entries(namespaces)),
    };
}

interface InventoryEntry {
    file?: unknown;
    symbols?: unknown;
}

export interface CoverageReport {
    schemaVersion: number;
    inventory: {
        blocks: number;
        files: number;
        uniqueSymbols: number;
    };
    summary: {
        mapped: number;
        unmapped: number;
        ambiguous: number;
    };
    mapped: string[];
    unmapped: string[];
    ambiguous: Array<{ symbol: string; candidates: SymbolCandidate[] }>;
}

export function createCoverageReport(symbolMap: BabylonSymbolMap, inventory: unknown): CoverageReport {
    if (!Array.isArray(inventory)) {
        throw new Error("Snippet inventory must be a JSON array");
    }
    const entries = inventory as InventoryEntry[];
    const files = new Set<string>();
    const inventorySymbols = new Set<string>();
    for (const [index, entry] of entries.entries()) {
        if (!entry || !Array.isArray(entry.symbols) || !entry.symbols.every((symbol) => typeof symbol === "string")) {
            throw new Error(`Snippet inventory entry ${index} has an invalid symbols array`);
        }
        if (typeof entry.file === "string") {
            files.add(entry.file);
        }
        for (const symbol of entry.symbols) {
            inventorySymbols.add(symbol);
        }
    }

    const aliases = new Map<string, (typeof symbolMap.namespaceAliases)[keyof typeof symbolMap.namespaceAliases]>(
        Object.values(symbolMap.namespaceAliases).map((alias) => [`${alias.parentNamespace}\0${alias.symbol}`, alias] as const),
    );
    const mapped: string[] = [];
    const unmapped: string[] = [];
    const ambiguous: CoverageReport["ambiguous"] = [];

    for (const symbol of [...inventorySymbols].sort(compareText)) {
        if (aliases.has(`BABYLON\0${symbol}`)) {
            mapped.push(symbol);
            continue;
        }
        const entry = symbolMap.namespaces.BABYLON?.symbols[symbol];
        if (!entry || entry.status === "unresolved") {
            unmapped.push(symbol);
        } else if (entry.status === "ambiguous") {
            ambiguous.push({ symbol, candidates: entry.candidates });
        } else {
            mapped.push(symbol);
        }
    }

    return {
        schemaVersion: 1,
        inventory: {
            blocks: entries.length,
            files: files.size,
            uniqueSymbols: inventorySymbols.size,
        },
        summary: {
            mapped: mapped.length,
            unmapped: unmapped.length,
            ambiguous: ambiguous.length,
        },
        mapped,
        unmapped,
        ambiguous,
    };
}

function parseArguments(arguments_: string[]): {
    packagesRoot: string;
    output: string;
    inventory?: string;
    coverageOutput?: string;
} {
    const positional: string[] = [];
    const options = new Map<string, string>();
    for (let index = 0; index < arguments_.length; index += 1) {
        const argument = arguments_[index];
        if (!argument.startsWith("--")) {
            positional.push(argument);
            continue;
        }
        const value = arguments_[index + 1];
        if (!value || value.startsWith("--")) {
            throw new Error(`Option ${argument} requires a value`);
        }
        options.set(argument, value);
        index += 1;
    }
    if (positional.length !== 1) {
        throw new Error(
            "Usage: tsx scripts/generate-babylon-symbol-map.ts <packages-root> [--output <file>] [--inventory <file> --coverage-output <file>]",
        );
    }
    const inventory = options.get("--inventory");
    const coverageOutput = options.get("--coverage-output");
    if (Boolean(inventory) !== Boolean(coverageOutput)) {
        throw new Error("--inventory and --coverage-output must be provided together");
    }
    for (const option of options.keys()) {
        if (!["--output", "--inventory", "--coverage-output"].includes(option)) {
            throw new Error(`Unknown option: ${option}`);
        }
    }
    return {
        packagesRoot: positional[0]!,
        output: options.get("--output") ?? path.resolve("lib/codeVariants/babylon-symbol-map.json"),
        inventory,
        coverageOutput,
    };
}

function writeJson(outputPath: string, value: unknown): void {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(value, null, 2)}\n`);
}

function main(): void {
    const options = parseArguments(process.argv.slice(2));
    const symbolMap = generateBabylonSymbolMap(options.packagesRoot);
    writeJson(options.output, symbolMap);
    const namespaceSummary = Object.entries(symbolMap.namespaces)
        .map(([namespace, value]) => `${namespace}: ${Object.keys(value.symbols).length}`)
        .join(", ");
    console.log(`Wrote ${options.output} (${namespaceSummary})`);

    if (options.inventory && options.coverageOutput) {
        const inventory = JSON.parse(fs.readFileSync(options.inventory, "utf8")) as unknown;
        const coverage = createCoverageReport(symbolMap, inventory);
        writeJson(options.coverageOutput, coverage);
        console.log(
            `Coverage: ${coverage.summary.mapped} mapped, ${coverage.summary.unmapped} unmapped, ${coverage.summary.ambiguous} ambiguous`,
        );
    }
}

const invokedScript = process.argv[1] ? path.resolve(process.argv[1]) : undefined;
if (invokedScript === path.resolve(fileURLToPath(import.meta.url))) {
    main();
}
