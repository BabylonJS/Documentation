import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

import { getContentGraph } from "../lib/contentGraph/buildContentGraph";
import { apiSearchDirectory, contentArtifactsDirectory, createDocumentationSearchIndex, createPlaygroundSearchIndex } from "../lib/contentGraph/staticArtifacts";

const writeJson = (filePath: string, value: unknown) => writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf-8" });

const graph = getContentGraph();
const documentationSearchIndex = createDocumentationSearchIndex(graph);
const playgroundSearchIndex = createPlaygroundSearchIndex(graph);

mkdirSync(contentArtifactsDirectory, { recursive: true });
mkdirSync(apiSearchDirectory, { recursive: true });

writeJson(join(contentArtifactsDirectory, "documentation-search-index.json"), documentationSearchIndex);
writeJson(join(contentArtifactsDirectory, "playground-search-index.json"), playgroundSearchIndex);
writeJson(join(apiSearchDirectory, "documentation-search-index.json"), documentationSearchIndex);
writeJson(join(apiSearchDirectory, "playground-search-index.json"), playgroundSearchIndex);

console.log(`Wrote ${documentationSearchIndex.length} documentation search item(s) and ${playgroundSearchIndex.length} playground search item(s).`);