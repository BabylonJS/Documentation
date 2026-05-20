import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

import { getContentGraph } from "../lib/contentGraph/buildContentGraph";
import { contentArtifactsDirectory } from "../lib/contentGraph/staticArtifacts";
import { createExampleImageReport, formatExampleImageReport } from "../lib/contentGraph/exampleImages";

const report = createExampleImageReport(getContentGraph());

mkdirSync(contentArtifactsDirectory, { recursive: true });
writeFileSync(join(contentArtifactsDirectory, "example-image-report.json"), `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf-8" });

console.log(formatExampleImageReport(report));

if (process.argv.includes("--strict") && report.missingImages.length > 0) {
    process.exitCode = 1;
}