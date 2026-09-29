import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, relative, resolve } from "path";
import { globSync } from "glob";

import { transformBabylonCodeVariants, type CodeVariantDiagnostic } from "../lib/codeVariants/codeVariantTransformer";

type AuditResult = {
    file: string;
    line: number;
    language: string;
    standardEs6: boolean;
    es6Pure: boolean;
    diagnostics: CodeVariantDiagnostic[];
};

const supportedLanguages = new Set(["", "javascript", "js", "typescript", "ts"]);
const codeFencePattern = /^```([^\n]*)\n(.*?)^```\s*$/gms;
const outputArgumentIndex = process.argv.indexOf("--output");
const outputPath = resolve(outputArgumentIndex === -1 ? ".temp/code-variant-audit.json" : process.argv[outputArgumentIndex + 1]);
const strict = process.argv.includes("--strict");
const failures: AuditResult[] = [];
const partialConversions: AuditResult[] = [];
let eligibleBlocks = 0;
let fullVariantBlocks = 0;
let excludedBlocks = 0;

for (const absoluteFile of globSync("content/**/*.md", { absolute: true })) {
    const content = readFileSync(absoluteFile, "utf-8");

    for (const match of content.matchAll(codeFencePattern)) {
        const info = match[1].trim().split(/\s+/).filter(Boolean);
        const language = info[0]?.toLowerCase() ?? "";
        const code = match[2];
        if (!code.includes("BABYLON.") || !supportedLanguages.has(language)) {
            continue;
        }
        if (info.includes("no-code-variants")) {
            excludedBlocks++;
            continue;
        }

        eligibleBlocks++;
        const result = transformBabylonCodeVariants(code, {
            fileName: `snippet.${language === "typescript" || language === "ts" ? "ts" : "js"}`,
        });

        if (result.standardEs6.success && result.es6Pure.success) {
            fullVariantBlocks++;
            continue;
        }

        const auditResult = {
            file: relative(process.cwd(), absoluteFile),
            line: content.slice(0, match.index).split("\n").length,
            language,
            standardEs6: result.standardEs6.success,
            es6Pure: result.es6Pure.success,
            diagnostics: result.diagnostics,
        };
        if (result.standardEs6.success) {
            partialConversions.push(auditResult);
        } else {
            failures.push(auditResult);
        }
    }
}

const diagnosticsByCode = [...failures, ...partialConversions]
    .flatMap(({ diagnostics }) => diagnostics)
    .reduce<Record<string, number>>((counts, { code }) => {
        counts[code] = (counts[code] ?? 0) + 1;
        return counts;
    }, {});
const report = {
    generatedAt: new Date().toISOString(),
    eligibleBlocks,
    renderedBlocks: fullVariantBlocks + partialConversions.length,
    fullVariantBlocks,
    standardOnlyBlocks: partialConversions.length,
    excludedBlocks,
    failedBlocks: failures.length,
    conversionPercent: eligibleBlocks
        ? Number((((fullVariantBlocks + partialConversions.length) / eligibleBlocks) * 100).toFixed(2))
        : 100,
    diagnosticsByCode,
    partialConversions,
    failures,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(report, null, 2) + "\n");
console.log(
    `Babylon code variants: ${report.renderedBlocks}/${eligibleBlocks} eligible blocks rendered (${report.conversionPercent}%); ` +
        `${fullVariantBlocks} have all variants, ${partialConversions.length} omit unsupported pure output, ` +
        `${excludedBlocks} are explicitly excluded, and ${failures.length} require review. Report: ${outputPath}`,
);
for (const [code, count] of Object.entries(diagnosticsByCode).sort(([left], [right]) => left.localeCompare(right))) {
    console.log(`  ${code}: ${count}`);
}

if (strict && failures.length) {
    process.exitCode = 1;
}
