import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

import { getContentGraph } from "../lib/contentGraph/buildContentGraph";
import { apiSearchDirectory, contentArtifactsDirectory, createDocumentationSearchIndex, createPlaygroundSearchIndex, createSitemapEntries, createSitemapXml } from "../lib/contentGraph/staticArtifacts";
import { formatContentValidationReport, validateDocumentationContent } from "../lib/contentGraph/validateContentGraph";

const writeJson = (filePath: string, value: unknown) => writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf-8" });

const graph = getContentGraph();
const validationReport = validateDocumentationContent({ graph });

mkdirSync(contentArtifactsDirectory, { recursive: true });
writeJson(join(contentArtifactsDirectory, "validation-report.json"), validationReport);

console.log(formatContentValidationReport(validationReport));

if (!validationReport.isValid) {
    process.exitCode = 1;
} else {
    mkdirSync(apiSearchDirectory, { recursive: true });
    const documentationSearchIndex = createDocumentationSearchIndex(graph);
    const playgroundSearchIndex = createPlaygroundSearchIndex(graph);

    writeJson(join(contentArtifactsDirectory, "content-graph.json"), graph);
    writeJson(join(contentArtifactsDirectory, "route-manifest.json"), graph.routeManifest);
    writeJson(join(contentArtifactsDirectory, "sitemap-entries.json"), createSitemapEntries(graph));
    writeFileSync(join(contentArtifactsDirectory, "sitemap.xml"), `${createSitemapXml(graph)}\n`, { encoding: "utf-8" });
    writeJson(join(contentArtifactsDirectory, "documentation-search-index.json"), documentationSearchIndex);
    writeJson(join(contentArtifactsDirectory, "playground-search-index.json"), playgroundSearchIndex);
    writeJson(join(apiSearchDirectory, "documentation-search-index.json"), documentationSearchIndex);
    writeJson(join(apiSearchDirectory, "playground-search-index.json"), playgroundSearchIndex);
}