import { existsSync, readFileSync } from "fs";
import { join } from "path";

import { addPlaygroundItem, addSearchItem, clearIndex, clearPlaygroundIndex, IPlaygroundSearchItem, ISearchIndexItem } from "../lib/buildUtils/search.utils";
import { contentArtifactsDirectory } from "../lib/contentGraph/staticArtifacts";

const readJson = <T>(filePath: string) => JSON.parse(readFileSync(filePath, "utf-8")) as T;

const documentationSearchIndexPath = join(contentArtifactsDirectory, "documentation-search-index.json");
const playgroundSearchIndexPath = join(contentArtifactsDirectory, "playground-search-index.json");

if (!process.env.SEARCH_API_KEY) {
    throw new Error("SEARCH_API_KEY is required to upload search indexes.");
}

if (!existsSync(documentationSearchIndexPath) || !existsSync(playgroundSearchIndexPath)) {
    throw new Error("Search index artifacts are missing. Run npm run build:search first.");
}

const documentationItems = readJson<ISearchIndexItem[]>(documentationSearchIndexPath);
const playgroundItems = readJson<IPlaygroundSearchItem[]>(playgroundSearchIndexPath);

if (process.argv.includes("--clear")) {
    await clearIndex(false, documentationItems.map((item) => item.path).filter((path): path is string => !!path));
    await clearPlaygroundIndex();
}

for (const item of documentationItems) {
    await addSearchItem(item);
}

for (const item of playgroundItems) {
    await addPlaygroundItem(item);
}

console.log(`Uploaded ${documentationItems.length} documentation search item(s) and ${playgroundItems.length} playground search item(s).`);