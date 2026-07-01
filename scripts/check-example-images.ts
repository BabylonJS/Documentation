import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

import { getContentGraph } from "../lib/contentGraph/buildContentGraph";
import { contentArtifactsDirectory } from "../lib/contentGraph/staticArtifacts";
import { createExampleImageReportWithBlanks, formatExampleImageReport } from "../lib/contentGraph/exampleImages";

const main = async () => {
    const report = await createExampleImageReportWithBlanks(getContentGraph());

    mkdirSync(contentArtifactsDirectory, { recursive: true });
    writeFileSync(join(contentArtifactsDirectory, "example-image-report.json"), `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf-8" });

    console.log(formatExampleImageReport(report));

    if (process.argv.includes("--strict") && (report.missingImages.length > 0 || (report.blankImages?.length ?? 0) > 0)) {
        process.exitCode = 1;
    }
};

void main();
