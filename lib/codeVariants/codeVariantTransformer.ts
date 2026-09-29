import ts from "typescript";

import generatedSymbolMap from "./babylon-symbol-map.json";

export type CodeVariantKind = "standard-es6" | "es6-pure";

export type CodeVariantDiagnosticCode =
    | "parse-error"
    | "unmapped-symbol"
    | "ambiguous-symbol"
    | "type-only-symbol-used-as-value"
    | "unsupported-pure-symbol"
    | "unsupported-pure-member"
    | "unsupported-lexical-context"
    | "local-namespace-binding"
    | "unconverted-namespace-reference";

export interface CodeVariantSourcePosition {
    /** Zero-based offset in the original source. */
    offset: number;
    /** One-based line in the original source. */
    line: number;
    /** One-based column in the original source. */
    column: number;
}

export interface CodeVariantDiagnostic {
    code: CodeVariantDiagnosticCode;
    message: string;
    variant: CodeVariantKind | "source";
    namespace?: string;
    symbol?: string;
    member?: string;
    start: CodeVariantSourcePosition;
    end: CodeVariantSourcePosition;
}

export interface CodeVariantOutput {
    kind: CodeVariantKind;
    success: boolean;
    /** Present only when the variant converted successfully. */
    code?: string;
}

export interface CodeVariantTransformResult {
    standardEs6: CodeVariantOutput;
    es6Pure: CodeVariantOutput;
    diagnostics: CodeVariantDiagnostic[];
}

export interface CodeVariantTransformOptions {
    /** Used only to select the TypeScript parser's JS/JSX/TS/TSX mode. */
    fileName?: string;
}

interface SymbolCandidate {
    package: string;
    importPath: string;
    typeOnly: boolean;
    pure: {
        available: boolean;
        importPath?: string;
    };
}

interface SymbolMapEntry {
    status: "resolved" | "ambiguous" | "unresolved";
    resolution?: SymbolCandidate;
    preferredCandidate?: SymbolCandidate;
    candidates?: SymbolCandidate[];
}

interface PurePackageMetadata {
    importPath: string;
    functions: string[];
    members: Record<string, string[]>;
    registeredMembers: Record<string, string[]>;
}

interface SymbolNamespace {
    purePackages: Record<string, PurePackageMetadata>;
    symbols: Record<string, SymbolMapEntry>;
}

interface TransformerSymbolMap {
    namespaceAliases: Record<
        string,
        {
            parentNamespace: string;
            symbol: string;
            packages: string[];
            targetNamespace: string;
            members?: Record<string, string>;
        }
    >;
    namespaces: Record<string, SymbolNamespace>;
}

interface BabylonReference {
    namespace: string;
    symbol: string;
    member?: string;
}

interface ParsedBabylonReference {
    reference: BabylonReference;
    lookupNamespace: string;
    consumedPartCount: number;
    trailingNames: string[];
}

interface RequestedImport {
    imported: string;
    local: string;
    typeOnly: boolean;
}

interface ScannerToken {
    kind: ts.SyntaxKind;
    start: number;
    end: number;
    text: string;
}

interface ScannerResult {
    tokens: ScannerToken[];
    errors: Array<{ start: number; message: string }>;
}

interface LexicalBabylonChain {
    startTokenIndex: number;
    endTokenIndex: number;
    partTokenIndexes: number[];
    parts: string[];
    parsed?: ParsedBabylonReference;
}

interface SourceEdit {
    start: number;
    end: number;
    text: string;
}

const symbolMap = generatedSymbolMap as unknown as TransformerSymbolMap;

function scriptKindForFileName(fileName: string): ts.ScriptKind {
    const lower = fileName.toLowerCase();
    if (lower.endsWith(".tsx")) {
        return ts.ScriptKind.TSX;
    }
    if (lower.endsWith(".jsx")) {
        return ts.ScriptKind.JSX;
    }
    if (lower.endsWith(".js") || lower.endsWith(".mjs") || lower.endsWith(".cjs")) {
        return ts.ScriptKind.JS;
    }
    return ts.ScriptKind.TS;
}

function sourcePosition(sourceFile: ts.SourceFile, offset: number): CodeVariantSourcePosition {
    const boundedOffset = Math.max(0, Math.min(offset, sourceFile.text.length));
    const position = sourceFile.getLineAndCharacterOfPosition(boundedOffset);
    return {
        offset: boundedOffset,
        line: position.line + 1,
        column: position.character + 1,
    };
}

function diagnosticForNode(
    sourceFile: ts.SourceFile,
    variant: CodeVariantKind,
    code: CodeVariantDiagnosticCode,
    message: string,
    node: ts.Node,
    reference: BabylonReference,
): CodeVariantDiagnostic {
    return {
        code,
        message,
        variant,
        namespace: reference.namespace,
        symbol: reference.symbol,
        member: reference.member,
        start: sourcePosition(sourceFile, node.getStart(sourceFile)),
        end: sourcePosition(sourceFile, node.getEnd()),
    };
}

function bindingNames(name: ts.BindingName): string[] {
    if (ts.isIdentifier(name)) {
        return [name.text];
    }
    return name.elements.flatMap((element) => (ts.isOmittedExpression(element) ? [] : bindingNames(element.name)));
}

function collectLocalBindings(sourceFile: ts.SourceFile): Set<string> {
    const names = new Set<string>();
    const addBinding = (name: ts.BindingName | undefined): void => {
        if (name) {
            for (const value of bindingNames(name)) {
                names.add(value);
            }
        }
    };
    const visit = (node: ts.Node): void => {
        if (
            ts.isVariableDeclaration(node) ||
            ts.isParameter(node) ||
            ts.isBindingElement(node)
        ) {
            addBinding(node.name);
        } else if (
            ts.isFunctionDeclaration(node) ||
            ts.isFunctionExpression(node) ||
            ts.isClassDeclaration(node) ||
            ts.isClassExpression(node) ||
            ts.isEnumDeclaration(node) ||
            ts.isInterfaceDeclaration(node) ||
            ts.isTypeAliasDeclaration(node) ||
            ts.isModuleDeclaration(node)
        ) {
            if (node.name && ts.isIdentifier(node.name)) {
                names.add(node.name.text);
            }
        } else if (ts.isImportClause(node) && node.name) {
            names.add(node.name.text);
        } else if (ts.isImportSpecifier(node) || ts.isNamespaceImport(node)) {
            names.add(node.name.text);
        } else if (ts.isCatchClause(node) && node.variableDeclaration) {
            addBinding(node.variableDeclaration.name);
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return names;
}

interface ExistingImport {
    local: string;
    typeOnly: boolean;
}

function existingNamedImports(sourceFile: ts.SourceFile): Map<string, ExistingImport[]> {
    const imports = new Map<string, ExistingImport[]>();
    for (const statement of sourceFile.statements) {
        if (
            !ts.isImportDeclaration(statement) ||
            !ts.isStringLiteral(statement.moduleSpecifier) ||
            !statement.importClause ||
            !statement.importClause.namedBindings ||
            !ts.isNamedImports(statement.importClause.namedBindings)
        ) {
            continue;
        }
        for (const element of statement.importClause.namedBindings.elements) {
            const key = `${statement.moduleSpecifier.text}\0${element.propertyName?.text ?? element.name.text}`;
            const existing = imports.get(key) ?? [];
            existing.push({
                local: element.name.text,
                typeOnly: statement.importClause.isTypeOnly || element.isTypeOnly,
            });
            imports.set(key, existing);
        }
    }
    return imports;
}

class ImportCollector {
    private readonly generated = new Map<string, RequestedImport & { moduleName: string }>();

    public constructor(
        private readonly occupied: Set<string>,
        private readonly existing: Map<string, ExistingImport[]>,
    ) {}

    public request(moduleName: string, imported: string, typeOnly: boolean): string {
        const key = `${moduleName}\0${imported}`;
        const generated = this.generated.get(key);
        if (generated) {
            if (!typeOnly) {
                generated.typeOnly = false;
            }
            return generated.local;
        }
        const existing = this.existing.get(key)?.find((value) => typeOnly || !value.typeOnly);
        if (existing) {
            return existing.local;
        }

        const local = this.availableName(imported);
        this.occupied.add(local);
        this.generated.set(key, { moduleName, imported, local, typeOnly });
        return local;
    }

    public entries(typeOnly: boolean): Array<[string, RequestedImport[]]> {
        const grouped = new Map<string, RequestedImport[]>();
        for (const value of this.generated.values()) {
            if (value.typeOnly !== typeOnly) {
                continue;
            }
            const imports = grouped.get(value.moduleName) ?? [];
            imports.push(value);
            grouped.set(value.moduleName, imports);
        }
        return [...grouped]
            .sort(([left], [right]) => left.localeCompare(right, "en"))
            .map(([moduleName, imports]) => [
                moduleName,
                imports.sort(
                    (left, right) => left.imported.localeCompare(right.imported, "en") || left.local.localeCompare(right.local, "en"),
                ),
            ]);
    }

    private availableName(preferred: string): string {
        if (!this.occupied.has(preferred)) {
            return preferred;
        }
        const base = `${preferred}Babylon`;
        if (!this.occupied.has(base)) {
            return base;
        }
        let suffix = 2;
        while (this.occupied.has(`${base}${suffix}`)) {
            suffix += 1;
        }
        return `${base}${suffix}`;
    }
}

function flattenedAccessName(node: ts.PropertyAccessExpression | ts.QualifiedName): string[] | undefined {
    const parts: string[] = [];
    let current: ts.Expression | ts.EntityName = node;
    while (ts.isPropertyAccessExpression(current) || ts.isQualifiedName(current)) {
        if (ts.isPropertyAccessExpression(current)) {
            parts.unshift(current.name.text);
            current = current.expression;
        } else {
            parts.unshift(current.right.text);
            current = current.left;
        }
    }
    if (!ts.isIdentifier(current)) {
        return undefined;
    }
    parts.unshift(current.text);
    return parts;
}

function parsedBabylonReference(parts: string[]): ParsedBabylonReference | undefined {
    if (!parts || parts[0] !== "BABYLON") {
        return undefined;
    }

    const aliases = Object.entries(symbolMap.namespaceAliases)
        .map(([name, alias]) => ({ name, alias, parts: name.split(".") }))
        .sort((left, right) => right.parts.length - left.parts.length);
    for (const alias of aliases) {
        if (
            parts.length <= alias.parts.length ||
            !alias.parts.every((part, index) => parts[index] === part)
        ) {
            continue;
        }
        const sourceSymbol = parts[alias.parts.length]!;
        const targetSymbol = alias.alias.members
            ? alias.alias.members[sourceSymbol]
            : sourceSymbol;
        if (!targetSymbol) {
            continue;
        }
        return {
            reference: {
                namespace: alias.name,
                symbol: targetSymbol,
                member: parts[alias.parts.length + 1],
            },
            lookupNamespace: alias.alias.targetNamespace,
            consumedPartCount: alias.parts.length + 1,
            trailingNames: parts.slice(alias.parts.length + 1),
        };
    }

    if (parts.length >= 2) {
        return {
            reference: {
                namespace: "BABYLON",
                symbol: parts[1]!,
                member: parts[2],
            },
            lookupNamespace: "BABYLON",
            consumedPartCount: 2,
            trailingNames: parts.slice(2),
        };
    }
    return undefined;
}

function withOriginal<T extends ts.Node>(replacement: T, original: ts.Node): T {
    ts.setTextRange(replacement, original);
    return ts.setOriginalNode(replacement, original);
}

function namedImportSpecifier(factory: ts.NodeFactory, value: RequestedImport): ts.ImportSpecifier {
    return factory.createImportSpecifier(
        false,
        value.imported === value.local ? undefined : factory.createIdentifier(value.imported),
        factory.createIdentifier(value.local),
    );
}

function addImportsAndRegistrations(
    sourceFile: ts.SourceFile,
    factory: ts.NodeFactory,
    collector: ImportCollector,
    registrations: Map<string, string>,
): ts.SourceFile {
    const remainingRuntime = new Map(collector.entries(false));
    const statements = sourceFile.statements.map((statement) => {
        if (
            !ts.isImportDeclaration(statement) ||
            !ts.isStringLiteral(statement.moduleSpecifier) ||
            !statement.importClause ||
            statement.importClause.isTypeOnly
        ) {
            return statement;
        }
        const additions = remainingRuntime.get(statement.moduleSpecifier.text);
        const bindings = statement.importClause.namedBindings;
        if (!additions || (bindings && ts.isNamespaceImport(bindings))) {
            return statement;
        }
        remainingRuntime.delete(statement.moduleSpecifier.text);
        const existingElements = bindings && ts.isNamedImports(bindings) ? [...bindings.elements] : [];
        const namedBindings = factory.createNamedImports([
            ...existingElements,
            ...additions.map((value) => namedImportSpecifier(factory, value)),
        ]);
        const importClause = factory.updateImportClause(
            statement.importClause,
            false,
            statement.importClause.name,
            namedBindings,
        );
        return factory.updateImportDeclaration(statement, statement.modifiers, importClause, statement.moduleSpecifier, statement.attributes);
    });

    const generatedRuntimeImports = [...remainingRuntime].map(([moduleName, imports]) =>
        factory.createImportDeclaration(
            undefined,
            factory.createImportClause(
                false,
                undefined,
                factory.createNamedImports(imports.map((value) => namedImportSpecifier(factory, value))),
            ),
            factory.createStringLiteral(moduleName),
            undefined,
        ),
    );
    const generatedTypeImports = collector.entries(true).map(([moduleName, imports]) =>
        factory.createImportDeclaration(
            undefined,
            factory.createImportClause(
                true,
                undefined,
                factory.createNamedImports(imports.map((value) => namedImportSpecifier(factory, value))),
            ),
            factory.createStringLiteral(moduleName),
            undefined,
        ),
    );
    const registrationStatements = [...registrations]
        .sort(([left], [right]) => left.localeCompare(right, "en"))
        .map(([, local]) => factory.createExpressionStatement(factory.createCallExpression(factory.createIdentifier(local), undefined, [])));
    const firstNonImport = statements.findIndex((statement) => !ts.isImportDeclaration(statement));
    const importEnd = firstNonImport === -1 ? statements.length : firstNonImport;

    return factory.updateSourceFile(sourceFile, [
        ...generatedRuntimeImports,
        ...generatedTypeImports,
        ...statements.slice(0, importEnd),
        ...registrationStatements,
        ...statements.slice(importEnd),
    ]);
}

function resolveEntry(
    sourceFile: ts.SourceFile,
    variant: CodeVariantKind,
    node: ts.Node,
    parsed: ParsedBabylonReference,
    typePosition: boolean,
    diagnostics: CodeVariantDiagnostic[],
): { entry: SymbolMapEntry; resolution: SymbolCandidate; namespace: SymbolNamespace } | undefined {
    const { reference } = parsed;
    const namespace = symbolMap.namespaces[parsed.lookupNamespace];
    const entry = namespace?.symbols[reference.symbol];
    if (!entry || entry.status === "unresolved") {
        diagnostics.push(
            diagnosticForNode(
                sourceFile,
                variant,
                "unmapped-symbol",
                `No Babylon ES module mapping exists for ${reference.namespace}.${reference.symbol}.`,
                node,
                reference,
            ),
        );
        return undefined;
    }
    if (entry.status === "ambiguous" || !entry.resolution) {
        diagnostics.push(
            diagnosticForNode(
                sourceFile,
                variant,
                "ambiguous-symbol",
                `Babylon symbol ${reference.namespace}.${reference.symbol} has more than one possible ES module mapping.`,
                node,
                reference,
            ),
        );
        return undefined;
    }
    if (entry.resolution.typeOnly && !typePosition) {
        diagnostics.push(
            diagnosticForNode(
                sourceFile,
                variant,
                "type-only-symbol-used-as-value",
                `${reference.namespace}.${reference.symbol} is exported only as a type and cannot be used at runtime.`,
                node,
                reference,
            ),
        );
        return undefined;
    }
    return { entry, resolution: entry.resolution, namespace };
}

function appendAccessNames(
    factory: ts.NodeFactory,
    base: ts.Identifier,
    names: readonly string[],
    entityName: boolean,
): ts.Expression | ts.EntityName {
    if (entityName) {
        return names.reduce<ts.EntityName>(
            (left, name) => factory.createQualifiedName(left, name),
            base,
        );
    }
    return names.reduce<ts.Expression>(
        (expression, name) => factory.createPropertyAccessExpression(expression, name),
        base,
    );
}

function isTypeQueryEntityName(node: ts.QualifiedName): boolean {
    let current: ts.Node = node;
    while (ts.isQualifiedName(current.parent)) {
        current = current.parent;
    }
    return ts.isTypeQueryNode(current.parent) && current.parent.exprName === current;
}

function isTypeOnlyReference(node: ts.PropertyAccessExpression | ts.QualifiedName): boolean {
    if (ts.isQualifiedName(node)) {
        return !isTypeQueryEntityName(node);
    }
    let current: ts.Node = node;
    while (ts.isPropertyAccessExpression(current.parent)) {
        current = current.parent;
    }
    if (!ts.isExpressionWithTypeArguments(current.parent)) {
        return false;
    }
    const heritage = current.parent.parent;
    if (!ts.isHeritageClause(heritage)) {
        return false;
    }
    return (
        heritage.token === ts.SyntaxKind.ImplementsKeyword ||
        ts.isInterfaceDeclaration(heritage.parent)
    );
}

function addRemainingReferenceDiagnostics(
    sourceFile: ts.SourceFile,
    transformed: ts.SourceFile,
    kind: CodeVariantKind,
    diagnostics: CodeVariantDiagnostic[],
): void {
    const report = (node: ts.Node, parts: string[]): void => {
        const start = node.getStart(sourceFile);
        const end = node.getEnd();
        if (
            diagnostics.some(
                (diagnostic) =>
                    diagnostic.variant === kind &&
                    diagnostic.start.offset <= start &&
                    diagnostic.end.offset >= end,
            )
        ) {
            return;
        }
        const parsed = parsedBabylonReference(parts);
        const reference = parsed?.reference ?? {
            namespace: parts[1] === "GUI" ? "BABYLON.GUI" : "BABYLON",
            symbol: parts[1] === "GUI" ? (parts[2] ?? "GUI") : (parts[1] ?? "BABYLON"),
        };
        diagnostics.push(
            diagnosticForNode(
                sourceFile,
                kind,
                "unconverted-namespace-reference",
                `Babylon namespace reference ${parts.join(".")} remained after ${kind} conversion.`,
                node,
                reference,
            ),
        );
    };

    const visit = (node: ts.Node): void => {
        if (ts.isPropertyAccessExpression(node) || ts.isQualifiedName(node)) {
            const parts = flattenedAccessName(node);
            if (parts?.[0] === "BABYLON") {
                report(node, parts);
                return;
            }
        } else if (
            ts.isElementAccessExpression(node) &&
            ts.isIdentifier(node.expression) &&
            node.expression.text === "BABYLON" &&
            node.argumentExpression &&
            (ts.isStringLiteral(node.argumentExpression) || ts.isNoSubstitutionTemplateLiteral(node.argumentExpression))
        ) {
            report(node, ["BABYLON", node.argumentExpression.text]);
            return;
        }
        ts.forEachChild(node, visit);
    };
    visit(transformed);
}

function isScannerTrivia(kind: ts.SyntaxKind): boolean {
    return (
        kind === ts.SyntaxKind.WhitespaceTrivia ||
        kind === ts.SyntaxKind.NewLineTrivia ||
        kind === ts.SyntaxKind.SingleLineCommentTrivia ||
        kind === ts.SyntaxKind.MultiLineCommentTrivia ||
        kind === ts.SyntaxKind.ShebangTrivia ||
        kind === ts.SyntaxKind.ConflictMarkerTrivia
    );
}

function canPrecedeRegularExpression(kind: ts.SyntaxKind | undefined): boolean {
    return (
        kind === undefined ||
        [
            ts.SyntaxKind.OpenParenToken,
            ts.SyntaxKind.OpenBracketToken,
            ts.SyntaxKind.OpenBraceToken,
            ts.SyntaxKind.CommaToken,
            ts.SyntaxKind.ColonToken,
            ts.SyntaxKind.SemicolonToken,
            ts.SyntaxKind.EqualsToken,
            ts.SyntaxKind.EqualsGreaterThanToken,
            ts.SyntaxKind.ExclamationToken,
            ts.SyntaxKind.AmpersandAmpersandToken,
            ts.SyntaxKind.BarBarToken,
            ts.SyntaxKind.QuestionToken,
            ts.SyntaxKind.ReturnKeyword,
            ts.SyntaxKind.ThrowKeyword,
            ts.SyntaxKind.CaseKeyword,
            ts.SyntaxKind.DeleteKeyword,
            ts.SyntaxKind.VoidKeyword,
            ts.SyntaxKind.TypeOfKeyword,
            ts.SyntaxKind.NewKeyword,
            ts.SyntaxKind.InKeyword,
            ts.SyntaxKind.OfKeyword,
            ts.SyntaxKind.TemplateHead,
            ts.SyntaxKind.TemplateMiddle,
        ].includes(kind)
    );
}

function scanSource(source: string): ScannerResult {
    const errors: ScannerResult["errors"] = [];
    const scanner = ts.createScanner(
        ts.ScriptTarget.Latest,
        false,
        ts.LanguageVariant.Standard,
        source,
        () => {},
    );

    const tokens: ScannerToken[] = [];
    const templateExpressionBraceDepths: number[] = [];
    let previousKind: ts.SyntaxKind | undefined;

    while (true) {
        let kind = scanner.scan();
        if (kind === ts.SyntaxKind.EndOfFileToken) {
            break;
        }

        if (kind === ts.SyntaxKind.SlashToken && canPrecedeRegularExpression(previousKind)) {
            kind = scanner.reScanSlashToken();
        }

        if (kind === ts.SyntaxKind.CloseBraceToken && templateExpressionBraceDepths.length > 0) {
            const lastIndex = templateExpressionBraceDepths.length - 1;
            if (templateExpressionBraceDepths[lastIndex] === 0) {
                kind = scanner.reScanTemplateToken(false);
                if (kind === ts.SyntaxKind.TemplateTail) {
                    templateExpressionBraceDepths.pop();
                } else if (kind !== ts.SyntaxKind.TemplateMiddle) {
                    errors.push({
                        start: scanner.getTokenPos(),
                        message: "Template expression boundaries could not be scanned safely.",
                    });
                }
            } else {
                templateExpressionBraceDepths[lastIndex]--;
            }
        } else if (kind === ts.SyntaxKind.OpenBraceToken && templateExpressionBraceDepths.length > 0) {
            const lastIndex = templateExpressionBraceDepths.length - 1;
            templateExpressionBraceDepths[lastIndex]++;
        }

        if (kind === ts.SyntaxKind.TemplateHead) {
            templateExpressionBraceDepths.push(0);
        }

        const token: ScannerToken = {
            kind,
            start: scanner.getTokenPos(),
            end: scanner.getTextPos(),
            text: scanner.getTokenText(),
        };
        if (!isScannerTrivia(kind)) {
            tokens.push(token);
            previousKind = kind;
        }
    }

    return { tokens, errors };
}

function lexicalBabylonChains(tokens: readonly ScannerToken[]): LexicalBabylonChain[] {
    const chains: LexicalBabylonChain[] = [];
    for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index]!;
        if (
            token.kind !== ts.SyntaxKind.Identifier ||
            token.text !== "BABYLON" ||
            tokens[index - 1]?.kind === ts.SyntaxKind.DotToken ||
            tokens[index - 1]?.kind === ts.SyntaxKind.QuestionDotToken
        ) {
            continue;
        }

        const parts = ["BABYLON"];
        const partTokenIndexes = [index];
        let endTokenIndex = index;
        while (
            tokens[endTokenIndex + 1]?.kind === ts.SyntaxKind.DotToken &&
            tokens[endTokenIndex + 2]?.kind === ts.SyntaxKind.Identifier
        ) {
            endTokenIndex += 2;
            parts.push(tokens[endTokenIndex]!.text);
            partTokenIndexes.push(endTokenIndex);
        }
        chains.push({
            startTokenIndex: index,
            endTokenIndex,
            partTokenIndexes,
            parts,
            parsed: parsedBabylonReference(parts),
        });
        index = endTokenIndex;
    }
    return chains;
}

export function hasBabylonNamespaceReference(source: string): boolean {
    return lexicalBabylonChains(scanSource(source).tokens).some((chain) => Boolean(chain.parsed));
}

function fallbackDiagnostic(
    sourceFile: ts.SourceFile,
    variant: CodeVariantDiagnostic["variant"],
    code: CodeVariantDiagnosticCode,
    message: string,
    start: number,
    end: number,
    reference?: BabylonReference,
): CodeVariantDiagnostic {
    return {
        code,
        message,
        variant,
        namespace: reference?.namespace,
        symbol: reference?.symbol,
        member: reference?.member,
        start: sourcePosition(sourceFile, start),
        end: sourcePosition(sourceFile, end),
    };
}

function resolveFallbackEntry(
    sourceFile: ts.SourceFile,
    kind: CodeVariantKind,
    chain: LexicalBabylonChain,
    tokens: readonly ScannerToken[],
    typePosition: boolean,
    diagnostics: CodeVariantDiagnostic[],
): { resolution: SymbolCandidate; namespace: SymbolNamespace } | undefined {
    const parsed = chain.parsed!;
    const reference = parsed.reference;
    const namespace = symbolMap.namespaces[parsed.lookupNamespace];
    const entry = namespace?.symbols[reference.symbol];
    const start = tokens[chain.startTokenIndex]!.start;
    const end = tokens[chain.endTokenIndex]!.end;
    if (!entry || entry.status === "unresolved") {
        diagnostics.push(
            fallbackDiagnostic(
                sourceFile,
                kind,
                "unmapped-symbol",
                `No Babylon ES module mapping exists for ${reference.namespace}.${reference.symbol}.`,
                start,
                end,
                reference,
            ),
        );
        return undefined;
    }
    if (entry.status === "ambiguous" || !entry.resolution) {
        diagnostics.push(
            fallbackDiagnostic(
                sourceFile,
                kind,
                "ambiguous-symbol",
                `Babylon symbol ${reference.namespace}.${reference.symbol} has more than one possible ES module mapping.`,
                start,
                end,
                reference,
            ),
        );
        return undefined;
    }
    if (entry.resolution.typeOnly && !typePosition) {
        diagnostics.push(
            fallbackDiagnostic(
                sourceFile,
                kind,
                "type-only-symbol-used-as-value",
                `${reference.namespace}.${reference.symbol} is exported only as a type and cannot be used at runtime.`,
                start,
                end,
                reference,
            ),
        );
        return undefined;
    }
    return { resolution: entry.resolution, namespace };
}

function isLexicalTypePosition(tokens: readonly ScannerToken[], chain: LexicalBabylonChain): boolean {
    const previous = tokens[chain.startTokenIndex - 1]?.kind;
    if (
        previous !== undefined &&
        [
            ts.SyntaxKind.ColonToken,
            ts.SyntaxKind.LessThanToken,
            ts.SyntaxKind.BarToken,
            ts.SyntaxKind.AmpersandToken,
            ts.SyntaxKind.ExtendsKeyword,
            ts.SyntaxKind.ImplementsKeyword,
            ts.SyntaxKind.AsKeyword,
            ts.SyntaxKind.SatisfiesKeyword,
        ].includes(previous)
    ) {
        return true;
    }

    let statementStart = 0;
    for (let index = chain.startTokenIndex - 1; index >= 0; index--) {
        const kind = tokens[index]!.kind;
        if (
            kind === ts.SyntaxKind.SemicolonToken ||
            kind === ts.SyntaxKind.OpenBraceToken ||
            kind === ts.SyntaxKind.CloseBraceToken
        ) {
            statementStart = index + 1;
            break;
        }
    }
    const declarationStartKinds = new Set([
        ts.SyntaxKind.ExportKeyword,
        ts.SyntaxKind.DeclareKeyword,
        ts.SyntaxKind.DefaultKeyword,
    ]);
    let firstDeclarationToken = statementStart;
    while (
        firstDeclarationToken < chain.startTokenIndex &&
        declarationStartKinds.has(tokens[firstDeclarationToken]!.kind)
    ) {
        firstDeclarationToken++;
    }
    return (
        tokens[firstDeclarationToken]?.kind === ts.SyntaxKind.TypeKeyword ||
        tokens[firstDeclarationToken]?.kind === ts.SyntaxKind.InterfaceKeyword
    );
}

function addChainReplacementEdits(
    edits: SourceEdit[],
    tokens: readonly ScannerToken[],
    chain: LexicalBabylonChain,
    local: string,
    consumedPartCount: number,
): void {
    const first = tokens[chain.startTokenIndex]!;
    edits.push({ start: first.start, end: first.end, text: local });
    const lastConsumedTokenIndex = chain.partTokenIndexes[consumedPartCount - 1]!;
    for (let index = chain.startTokenIndex + 1; index <= lastConsumedTokenIndex; index++) {
        const token = tokens[index]!;
        edits.push({ start: token.start, end: token.end, text: "" });
    }
}

function applySourceEdits(source: string, edits: readonly SourceEdit[]): string {
    let result = source;
    for (const edit of [...edits].sort((left, right) => right.start - left.start || right.end - left.end)) {
        result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
    }
    return result;
}

function renderFallbackPrefix(imports: ImportCollector, registrations: ReadonlyMap<string, string>): string {
    const renderImports = (typeOnly: boolean) =>
        imports.entries(typeOnly).map(([moduleName, requested]) => {
            const specifiers = requested
                .map(({ imported, local }) => (imported === local ? imported : `${imported} as ${local}`))
                .join(", ");
            return `import${typeOnly ? " type" : ""} { ${specifiers} } from ${JSON.stringify(moduleName)};`;
        });
    const lines = [...renderImports(false), ...renderImports(true)];
    for (const [, local] of [...registrations].sort(([left], [right]) => left.localeCompare(right, "en"))) {
        lines.push(`${local}();`);
    }
    return lines.length > 0 ? `${lines.join("\n")}\n` : "";
}

function hasLexicalNamespaceReference(tokens: readonly ScannerToken[]): boolean {
    return tokens.some(
        (token, index) =>
            token.kind === ts.SyntaxKind.Identifier &&
            token.text === "BABYLON" &&
            tokens[index - 1]?.kind !== ts.SyntaxKind.DotToken &&
            (tokens[index + 1]?.kind === ts.SyntaxKind.DotToken ||
                tokens[index + 1]?.kind === ts.SyntaxKind.OpenBracketToken),
    );
}

function transformFallbackVariant(
    sourceFile: ts.SourceFile,
    source: string,
    scan: ScannerResult,
    kind: CodeVariantKind,
    supportsTypeSyntax: boolean,
): { output: CodeVariantOutput; diagnostics: CodeVariantDiagnostic[] } {
    const diagnostics: CodeVariantDiagnostic[] = [];
    if (scan.errors.length > 0) {
        for (const error of scan.errors) {
            diagnostics.push(
                fallbackDiagnostic(
                    sourceFile,
                    kind,
                    "unsupported-lexical-context",
                    error.message,
                    error.start,
                    error.start,
                ),
            );
        }
        return { output: { kind, success: false }, diagnostics };
    }

    const chains = lexicalBabylonChains(scan.tokens);
    const chainTokenIndexes = new Set(chains.flatMap((chain) => {
        const indexes: number[] = [];
        for (let index = chain.startTokenIndex; index <= chain.endTokenIndex; index++) {
            indexes.push(index);
        }
        return indexes;
    }));
    const occupied = new Set(
        scan.tokens
            .map((token, index) => ({ token, index }))
            .filter(({ token, index }) => token.kind === ts.SyntaxKind.Identifier && !chainTokenIndexes.has(index))
            .map(({ token }) => token.text),
    );
    const imports = new ImportCollector(occupied, new Map());
    const registrations = new Map<string, string>();
    const edits: SourceEdit[] = [];
    const convertedStarts = new Set<number>();

    for (const chain of chains) {
        const firstToken = scan.tokens[chain.startTokenIndex]!;
        const lastToken = scan.tokens[chain.endTokenIndex]!;
        if (!chain.parsed) {
            diagnostics.push(
                fallbackDiagnostic(
                    sourceFile,
                    kind,
                    "unconverted-namespace-reference",
                    `Babylon namespace reference ${chain.parts.join(".")} could not be converted.`,
                    firstToken.start,
                    lastToken.end,
                ),
            );
            continue;
        }

        const { reference, trailingNames } = chain.parsed;
        const typePosition = supportsTypeSyntax && isLexicalTypePosition(scan.tokens, chain);
        const resolved = resolveFallbackEntry(sourceFile, kind, chain, scan.tokens, typePosition, diagnostics);
        if (!resolved) {
            continue;
        }

        const rootPartCount = chain.parsed.consumedPartCount;
        if (kind === "standard-es6") {
            const local = imports.request(resolved.resolution.importPath, reference.symbol, typePosition);
            addChainReplacementEdits(edits, scan.tokens, chain, local, rootPartCount);
            convertedStarts.add(firstToken.start);
            continue;
        }

        if (!resolved.resolution.pure.available || !resolved.resolution.pure.importPath) {
            diagnostics.push(
                fallbackDiagnostic(
                    sourceFile,
                    kind,
                    "unsupported-pure-symbol",
                    `${reference.namespace}.${reference.symbol} is not exported by a Babylon pure entry point.`,
                    firstToken.start,
                    lastToken.end,
                    reference,
                ),
            );
            continue;
        }
        const pureMetadata = resolved.namespace.purePackages?.[resolved.resolution.package];
        if (!pureMetadata) {
            diagnostics.push(
                fallbackDiagnostic(
                    sourceFile,
                    kind,
                    "unsupported-pure-symbol",
                    `Pure export metadata is unavailable for ${reference.namespace}.${reference.symbol}.`,
                    firstToken.start,
                    lastToken.end,
                    reference,
                ),
            );
            continue;
        }

        if (trailingNames.length === 0 || typePosition) {
            const local = imports.request(pureMetadata.importPath, reference.symbol, typePosition);
            addChainReplacementEdits(edits, scan.tokens, chain, local, rootPartCount);
            convertedStarts.add(firstToken.start);
            continue;
        }

        const member = trailingNames[0]!;
        if ((pureMetadata.members[reference.symbol] ?? []).includes(member)) {
            const local = imports.request(pureMetadata.importPath, reference.symbol, false);
            addChainReplacementEdits(edits, scan.tokens, chain, local, rootPartCount);
            convertedStarts.add(firstToken.start);
            continue;
        }

        const rootMemberFunction = `${reference.symbol}${member}`;
        const freeFunction = pureMetadata.functions.includes(rootMemberFunction)
            ? rootMemberFunction
            : pureMetadata.functions.includes(member)
              ? member
              : undefined;
        if (freeFunction) {
            const local = imports.request(pureMetadata.importPath, freeFunction, false);
            addChainReplacementEdits(edits, scan.tokens, chain, local, rootPartCount + 1);
            convertedStarts.add(firstToken.start);
            continue;
        }

        const registrationFunction = `Register${reference.symbol}`;
        if (
            pureMetadata.functions.includes(registrationFunction) &&
            (pureMetadata.registeredMembers[reference.symbol] ?? []).includes(member)
        ) {
            const rootLocal = imports.request(pureMetadata.importPath, reference.symbol, false);
            const registerLocal = imports.request(pureMetadata.importPath, registrationFunction, false);
            registrations.set(`${pureMetadata.importPath}\0${registrationFunction}`, registerLocal);
            addChainReplacementEdits(edits, scan.tokens, chain, rootLocal, rootPartCount);
            convertedStarts.add(firstToken.start);
            continue;
        }

        diagnostics.push(
            fallbackDiagnostic(
                sourceFile,
                kind,
                "unsupported-pure-member",
                `${reference.namespace}.${reference.symbol}.${member} is not a declared pure member and has no pure free-function or registration rewrite.`,
                firstToken.start,
                lastToken.end,
                { ...reference, member },
            ),
        );
    }

    for (const chain of chains) {
        const start = scan.tokens[chain.startTokenIndex]!.start;
        if (
            !convertedStarts.has(start) &&
            !diagnostics.some(
                (diagnostic) =>
                    diagnostic.start.offset <= start &&
                    diagnostic.end.offset >= scan.tokens[chain.endTokenIndex]!.end,
            )
        ) {
            diagnostics.push(
                fallbackDiagnostic(
                    sourceFile,
                    kind,
                    "unconverted-namespace-reference",
                    `Babylon namespace reference ${chain.parts.join(".")} remained after ${kind} conversion.`,
                    start,
                    scan.tokens[chain.endTokenIndex]!.end,
                    chain.parsed?.reference,
                ),
            );
        }
    }

    const convertedSource = applySourceEdits(source, edits);
    const postconditionScan = scanSource(convertedSource);
    if (hasLexicalNamespaceReference(postconditionScan.tokens) && diagnostics.length === 0) {
        const remaining = postconditionScan.tokens.find(
            (token, index) =>
                token.kind === ts.SyntaxKind.Identifier &&
                token.text === "BABYLON" &&
                postconditionScan.tokens[index - 1]?.kind !== ts.SyntaxKind.DotToken,
        )!;
        diagnostics.push(
            fallbackDiagnostic(
                sourceFile,
                kind,
                "unconverted-namespace-reference",
                `A Babylon namespace reference remained after ${kind} fallback conversion.`,
                Math.min(remaining.start, source.length),
                Math.min(remaining.end, source.length),
            ),
        );
    }

    const uniqueDiagnostics = diagnostics.filter(
        (diagnostic, index, all) =>
            all.findIndex(
                (other) =>
                    other.code === diagnostic.code &&
                    other.variant === diagnostic.variant &&
                    other.start.offset === diagnostic.start.offset &&
                    other.symbol === diagnostic.symbol &&
                    other.member === diagnostic.member,
            ) === index,
    );
    const success = uniqueDiagnostics.length === 0;
    return {
        output: {
            kind,
            success,
            ...(success
                ? {
                      code: renderFallbackPrefix(imports, registrations) + convertedSource,
                  }
                : {}),
        },
        diagnostics: uniqueDiagnostics,
    };
}

function transformVariant(sourceFile: ts.SourceFile, kind: CodeVariantKind): { output: CodeVariantOutput; diagnostics: CodeVariantDiagnostic[] } {
    const diagnostics: CodeVariantDiagnostic[] = [];
    const imports = new ImportCollector(collectLocalBindings(sourceFile), existingNamedImports(sourceFile));
    const registrations = new Map<string, string>();

    const result = ts.transform(sourceFile, [
        (context) => {
            const visit: ts.Visitor = (node) => {
                if (!ts.isPropertyAccessExpression(node) && !ts.isQualifiedName(node)) {
                    return ts.visitEachChild(node, visit, context);
                }
                const parts = flattenedAccessName(node);
                const parsed = parts ? parsedBabylonReference(parts) : undefined;
                if (!parsed) {
                    return ts.visitEachChild(node, visit, context);
                }
                const { reference, trailingNames } = parsed;
                const typePosition = isTypeOnlyReference(node);
                const resolved = resolveEntry(sourceFile, kind, node, parsed, typePosition, diagnostics);
                if (!resolved) {
                    return node;
                }

                const entityName = ts.isQualifiedName(node);
                if (kind === "standard-es6") {
                    const local = imports.request(resolved.resolution.importPath, reference.symbol, typePosition);
                    return withOriginal(
                        appendAccessNames(
                            context.factory,
                            context.factory.createIdentifier(local),
                            trailingNames,
                            entityName,
                        ),
                        node,
                    );
                }

                if (!resolved.resolution.pure.available || !resolved.resolution.pure.importPath) {
                    diagnostics.push(
                        diagnosticForNode(
                            sourceFile,
                            kind,
                            "unsupported-pure-symbol",
                            `${reference.namespace}.${reference.symbol} is not exported by a Babylon pure entry point.`,
                            node,
                            reference,
                        ),
                    );
                    return node;
                }
                const pureMetadata = resolved.namespace.purePackages?.[resolved.resolution.package];
                if (!pureMetadata) {
                    diagnostics.push(
                        diagnosticForNode(
                            sourceFile,
                            kind,
                            "unsupported-pure-symbol",
                            `Pure export metadata is unavailable for ${reference.namespace}.${reference.symbol}.`,
                            node,
                            reference,
                        ),
                    );
                    return node;
                }
                if (typePosition || trailingNames.length === 0) {
                    const rootLocal = imports.request(pureMetadata.importPath, reference.symbol, typePosition);
                    return withOriginal(
                        appendAccessNames(
                            context.factory,
                            context.factory.createIdentifier(rootLocal),
                            trailingNames,
                            entityName,
                        ),
                        node,
                    );
                }

                const member = trailingNames[0]!;
                const remainingNames = trailingNames.slice(1);
                const rootMembers = new Set(pureMetadata.members[reference.symbol] ?? []);
                if (rootMembers.has(member)) {
                    const rootLocal = imports.request(pureMetadata.importPath, reference.symbol, false);
                    return withOriginal(
                        appendAccessNames(
                            context.factory,
                            context.factory.createIdentifier(rootLocal),
                            trailingNames,
                            entityName,
                        ),
                        node,
                    );
                }

                const rootMemberFunction = `${reference.symbol}${member}`;
                const freeFunction = pureMetadata.functions.includes(rootMemberFunction)
                    ? rootMemberFunction
                    : pureMetadata.functions.includes(member)
                      ? member
                      : undefined;
                if (freeFunction) {
                    const local = imports.request(pureMetadata.importPath, freeFunction, false);
                    return withOriginal(
                        appendAccessNames(
                            context.factory,
                            context.factory.createIdentifier(local),
                            remainingNames,
                            entityName,
                        ),
                        node,
                    );
                }

                const registrationFunction = `Register${reference.symbol}`;
                if (
                    pureMetadata.functions.includes(registrationFunction) &&
                    (pureMetadata.registeredMembers[reference.symbol] ?? []).includes(member)
                ) {
                    const rootLocal = imports.request(pureMetadata.importPath, reference.symbol, false);
                    const registerLocal = imports.request(pureMetadata.importPath, registrationFunction, false);
                    registrations.set(`${pureMetadata.importPath}\0${registrationFunction}`, registerLocal);
                    return withOriginal(
                        appendAccessNames(
                            context.factory,
                            context.factory.createIdentifier(rootLocal),
                            trailingNames,
                            entityName,
                        ),
                        node,
                    );
                }

                const memberReference = { ...reference, member };
                diagnostics.push(
                    diagnosticForNode(
                        sourceFile,
                        kind,
                        "unsupported-pure-member",
                        `${reference.namespace}.${reference.symbol}.${member} is not a declared pure member and has no pure free-function or registration rewrite.`,
                        node,
                        memberReference,
                    ),
                );
                return node;
            };
            return (rootNode) => ts.visitNode(rootNode, visit) as ts.SourceFile;
        },
    ]);

    try {
        const transformed = addImportsAndRegistrations(result.transformed[0] as ts.SourceFile, ts.factory, imports, registrations);
        addRemainingReferenceDiagnostics(sourceFile, transformed, kind, diagnostics);
        const uniqueDiagnostics = diagnostics.filter(
            (diagnostic, index, all) =>
                all.findIndex(
                    (other) =>
                        other.code === diagnostic.code &&
                        other.variant === diagnostic.variant &&
                        other.start.offset === diagnostic.start.offset &&
                        other.symbol === diagnostic.symbol &&
                        other.member === diagnostic.member,
                ) === index,
        );
        const success = uniqueDiagnostics.length === 0;
        return {
            output: {
                kind,
                success,
                ...(success
                    ? {
                          code: ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: false }).printFile(transformed),
                      }
                    : {}),
            },
            diagnostics: uniqueDiagnostics,
        };
    } finally {
        result.dispose();
    }
}

/**
 * Converts Babylon global-namespace references to standard deep imports and
 * side-effect-free package imports. Unsupported references are diagnostics,
 * never partially successful output.
 */
export function transformBabylonCodeVariants(
    source: string,
    options: CodeVariantTransformOptions = {},
): CodeVariantTransformResult {
    const fileName = options.fileName ?? "snippet.ts";
    const scriptKind = scriptKindForFileName(fileName);
    const sourceFile = ts.createSourceFile(
        fileName,
        source,
        ts.ScriptTarget.Latest,
        true,
        scriptKind,
    );
    if (collectLocalBindings(sourceFile).has("BABYLON")) {
        const start = Math.max(0, source.indexOf("BABYLON"));
        return {
            standardEs6: { kind: "standard-es6", success: false },
            es6Pure: { kind: "es6-pure", success: false },
            diagnostics: [
                fallbackDiagnostic(
                    sourceFile,
                    "source",
                    "local-namespace-binding",
                    "This snippet binds BABYLON locally and must retain its original package initialization.",
                    start,
                    start + "BABYLON".length,
                ),
            ],
        };
    }
    const parseDiagnostics =
        (sourceFile as ts.SourceFile & { parseDiagnostics?: readonly ts.DiagnosticWithLocation[] }).parseDiagnostics ?? [];
    if (parseDiagnostics.length > 0) {
        const scan = scanSource(source);
        const supportsTypeSyntax = scriptKind === ts.ScriptKind.TS || scriptKind === ts.ScriptKind.TSX;
        const standard = transformFallbackVariant(sourceFile, source, scan, "standard-es6", supportsTypeSyntax);
        const pure = transformFallbackVariant(sourceFile, source, scan, "es6-pure", supportsTypeSyntax);
        return {
            standardEs6: standard.output,
            es6Pure: pure.output,
            diagnostics: [...standard.diagnostics, ...pure.diagnostics],
        };
    }

    const standard = transformVariant(sourceFile, "standard-es6");
    const pure = transformVariant(sourceFile, "es6-pure");
    return {
        standardEs6: standard.output,
        es6Pure: pure.output,
        diagnostics: [...standard.diagnostics, ...pure.diagnostics],
    };
}
