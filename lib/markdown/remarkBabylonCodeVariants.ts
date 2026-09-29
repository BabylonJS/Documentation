import { SKIP, visit } from "unist-util-visit";
import type { Plugin } from "unified";

import { transformBabylonCodeVariants, type CodeVariantDiagnostic } from "../codeVariants/codeVariantTransformer";

type CodeNode = {
    type: "code";
    lang?: string | null;
    meta?: string | null;
    value: string;
    position?: unknown;
};

type ParentNode = {
    type: string;
    name?: string | null;
    children: Array<CodeNode | MdxJsxFlowElement | Record<string, unknown>>;
};

type MdxJsxAttribute = {
    type: "mdxJsxAttribute";
    name: string;
    value: string;
};

type MdxJsxFlowElement = {
    type: "mdxJsxFlowElement";
    name: string;
    attributes: MdxJsxAttribute[];
    children: Array<CodeNode | MdxJsxFlowElement>;
    position?: unknown;
};

type VariantDiagnostic = CodeVariantDiagnostic & {
    language: string;
    snippetLine?: number;
};

type MarkdownFile = {
    data: {
        babylonCodeVariantDiagnostics?: VariantDiagnostic[];
    };
};

const supportedLanguages = new Set(["", "javascript", "js", "typescript", "ts"]);

const createAttribute = (name: string, value: string): MdxJsxAttribute => ({
    type: "mdxJsxAttribute",
    name,
    value,
});

const createVariant = (variant: string, label: string, code: string, language: string, position: unknown): MdxJsxFlowElement => ({
    type: "mdxJsxFlowElement",
    name: "CodeVariant",
    attributes: [createAttribute("variant", variant), createAttribute("label", label)],
    children: [
        {
            type: "code",
            lang: language || "javascript",
            value: code,
            position,
        },
    ],
    position,
});

export const remarkBabylonCodeVariants: Plugin = () => {
    return (tree: unknown, file: MarkdownFile) => {
        visit(tree as Parameters<typeof visit>[0], "code", (node: CodeNode, index, parent: ParentNode | undefined) => {
            if (index === undefined || !parent || !node.value.includes("BABYLON.")) {
                return;
            }
            if (parent.type === "mdxJsxFlowElement" && parent.name === "CodeVariant") {
                return;
            }

            const language = node.lang?.toLowerCase() ?? "";
            if (!supportedLanguages.has(language) || node.meta?.split(/\s+/).includes("no-code-variants")) {
                return;
            }

            const result = transformBabylonCodeVariants(node.value, {
                fileName: `snippet.${language === "typescript" || language === "ts" ? "ts" : "js"}`,
            });

            if (!result.standardEs6.success || !result.standardEs6.code || !result.es6Pure.success || !result.es6Pure.code) {
                const diagnostics = (file.data.babylonCodeVariantDiagnostics ??= []);
                diagnostics.push(
                    ...result.diagnostics.map((diagnostic) => ({
                        ...diagnostic,
                        language,
                        snippetLine: (node.position as { start?: { line?: number } } | undefined)?.start?.line,
                    })),
                );
            }
            if (!result.standardEs6.success || !result.standardEs6.code) {
                return;
            }

            const variants = [createVariant("es6", "ES6", result.standardEs6.code, language, node.position)];
            if (result.es6Pure.success && result.es6Pure.code) {
                variants.push(createVariant("pure-es6", "ES6 pure", result.es6Pure.code, language, node.position));
            }
            variants.push(createVariant("umd", "UMD", node.value, language, node.position));

            const variantNode: MdxJsxFlowElement = {
                type: "mdxJsxFlowElement",
                name: "CodeVariants",
                attributes: [],
                children: variants,
                position: node.position,
            };

            parent.children[index] = variantNode;
            return SKIP;
        });
    };
};
