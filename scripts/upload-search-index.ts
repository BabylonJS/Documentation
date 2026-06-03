import { existsSync, readFileSync } from "fs";
import { join } from "path";

import { addPlaygroundItem, addSearchItem, clearIndex, clearPlaygroundIndex, IPlaygroundSearchItem, ISearchIndexItem } from "../lib/buildUtils/search.utils";
import { contentArtifactsDirectory } from "../lib/contentGraph/staticArtifacts";
import { docsFlavors, type DocsFlavorId } from "../lib/docsFlavors";

const readJson = <T>(filePath: string) => JSON.parse(readFileSync(filePath, "utf-8")) as T;
const encodeSearchId = (value: string) => Buffer.from(value, "utf-8").toString("base64");

const documentationSearchIndexPath = join(contentArtifactsDirectory, "documentation-search-index.json");
const playgroundSearchIndexPath = join(contentArtifactsDirectory, "playground-search-index.json");
const flavorArg = process.argv.find((arg) => arg.startsWith("--flavor="))?.split("=")[1] as DocsFlavorId | undefined;
const flavorId = flavorArg ?? docsFlavors.babylon.id;

if (!docsFlavors[flavorId]) {
    throw new Error(`Unsupported search index flavor: ${flavorId}`);
}

if (!process.env.SEARCH_API_KEY) {
    throw new Error("SEARCH_API_KEY is required to upload search indexes.");
}

if (!existsSync(documentationSearchIndexPath) || !existsSync(playgroundSearchIndexPath)) {
    throw new Error("Search index artifacts are missing. Run npm run build:search first.");
}

const documentationItems = readJson<ISearchIndexItem[]>(documentationSearchIndexPath).map((item) => ({ ...item, flavor: flavorId }));
const playgroundItems = readJson<IPlaygroundSearchItem[]>(playgroundSearchIndexPath).map((item) => ({
    ...item,
    id: encodeSearchId(`${flavorId}:${item.playgroundId}`),
    flavor: flavorId,
}));

if (process.argv.includes("--clear")) {
    await clearIndex(false, documentationItems.map((item) => item.path).filter((path): path is string => !!path), flavorId);
    await clearPlaygroundIndex(flavorId);
}

for (const item of documentationItems) {
    await addSearchItem(item);
}

for (const item of playgroundItems) {
    await addPlaygroundItem(item);
}

console.log(`Uploaded ${documentationItems.length} documentation search item(s) and ${playgroundItems.length} playground search item(s) for ${flavorId}.`);