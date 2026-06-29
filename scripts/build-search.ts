import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

import { getContentGraph } from "../lib/contentGraph/buildContentGraph";
import { apiSearchDirectory, contentArtifactsDirectory, createDocumentationSearchIndex, createPlaygroundSearchIndex } from "../lib/contentGraph/staticArtifacts";
import { getBabylonLiteContentGraph } from "../lib/babylonLiteDocs";
import { docsFlavors } from "../lib/docsFlavors";

const writeJson = (filePath: string, value: unknown) => writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf-8" });

async function main() {
	const graph = getContentGraph();
	const liteGraph = await getBabylonLiteContentGraph();
	const documentationSearchIndex = [
		...createDocumentationSearchIndex(graph, docsFlavors.babylon.id),
		...(liteGraph ? createDocumentationSearchIndex(liteGraph, docsFlavors.lite.id) : []),
	];
	const playgroundSearchIndex = [
		...createPlaygroundSearchIndex(graph, docsFlavors.babylon.id),
		...(liteGraph ? createPlaygroundSearchIndex(liteGraph, docsFlavors.lite.id) : []),
	];

	mkdirSync(contentArtifactsDirectory, { recursive: true });
	mkdirSync(apiSearchDirectory, { recursive: true });

	writeJson(join(contentArtifactsDirectory, "documentation-search-index.json"), documentationSearchIndex);
	writeJson(join(contentArtifactsDirectory, "playground-search-index.json"), playgroundSearchIndex);
	writeJson(join(apiSearchDirectory, "documentation-search-index.json"), documentationSearchIndex);
	writeJson(join(apiSearchDirectory, "playground-search-index.json"), playgroundSearchIndex);

	console.log(`Wrote ${documentationSearchIndex.length} documentation search item(s) and ${playgroundSearchIndex.length} playground search item(s).`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});