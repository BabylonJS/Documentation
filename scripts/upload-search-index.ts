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

if (flavorArg && !docsFlavors[flavorArg]) {
    throw new Error(`Unsupported search index flavor: ${flavorArg}`);
}

if (!process.env.SEARCH_API_KEY) {
    throw new Error("SEARCH_API_KEY is required to upload search indexes.");
}

if (!existsSync(documentationSearchIndexPath) || !existsSync(playgroundSearchIndexPath)) {
    throw new Error("Search index artifacts are missing. Run npm run build:search first.");
}

const matchesRequestedFlavor = (item: { flavor?: DocsFlavorId }) => !flavorArg || item.flavor === flavorArg;
const documentationItems = readJson<ISearchIndexItem[]>(documentationSearchIndexPath)
    .map((item) => ({ ...item, flavor: item.flavor ?? flavorArg ?? docsFlavors.babylon.id }))
    .filter(matchesRequestedFlavor);
const playgroundItems = readJson<IPlaygroundSearchItem[]>(playgroundSearchIndexPath)
    .map((item) => {
        const flavor = item.flavor ?? flavorArg ?? docsFlavors.babylon.id;
        return {
            ...item,
            id: encodeSearchId(`${flavor}:${item.playgroundId}`),
            flavor,
        };
    })
    .filter(matchesRequestedFlavor);
const flavorsToUpload = Array.from(new Set([...documentationItems, ...playgroundItems].map((item) => item.flavor)));
const flavorsToClear = flavorArg ? [flavorArg] : flavorsToUpload;

if (process.argv.includes("--clear")) {
    for (const flavor of flavorsToClear) {
        await clearIndex(false, documentationItems.filter((item) => item.flavor === flavor).map((item) => item.path).filter((path): path is string => !!path), flavor);
        await clearPlaygroundIndex(flavor);
    }
}

for (const item of documentationItems) {
    await addSearchItem(item);
}

for (const item of playgroundItems) {
    await addPlaygroundItem(item);
}

console.log(`Uploaded ${documentationItems.length} documentation search item(s) and ${playgroundItems.length} playground search item(s) for ${flavorsToUpload.join(", ")}.`);