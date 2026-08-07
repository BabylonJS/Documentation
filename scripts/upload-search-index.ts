import { existsSync, readFileSync } from "fs";
import { join } from "path";

import { addPlaygroundItems, addSearchItems, clearIndex, clearPlaygroundIndex, IPlaygroundSearchItem, ISearchIndexItem } from "../lib/buildUtils/search.utils";
import { apiSearchIndexPath, isFlavorFullyIndexed, readApiSearchIndex } from "../lib/buildUtils/typedocSearchIndex.utils";
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

const main = async () => {
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
    // The API index is produced by `build:typedoc`, which is not part of every build.
    const apiSearchIndex = readApiSearchIndex(apiSearchIndexPath);
    const apiItems = apiSearchIndex.items
        .map((item) => ({ ...item, isApi: true, flavor: item.flavor ?? flavorArg ?? docsFlavors.babylon.id }))
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

    if (!apiItems.length) {
        console.warn(`No API search items found at ${apiSearchIndexPath}. Run npm run build:typedoc to index the API.`);
    }

    const flavorsToUpload = Array.from(new Set([...documentationItems, ...apiItems, ...playgroundItems].map((item) => item.flavor)));
    const flavorsToClear = flavorArg ? [flavorArg] : flavorsToUpload;

    const getPaths = (items: ISearchIndexItem[], flavor: DocsFlavorId) =>
        items
            .filter((item) => item.flavor === flavor)
            .map((item) => item.path)
            .filter((path): path is string => !!path);

    if (process.argv.includes("--clear")) {
        // Each index is only cleared for a flavor when there are freshly generated records to
        // restore it with. Clearing against an empty or partial set would delete live documents
        // that nothing is going to re-upload.
        for (const flavor of flavorsToClear) {
            const documentationPaths = getPaths(documentationItems, flavor);
            if (documentationPaths.length) {
                await clearIndex(false, documentationPaths, flavor);
            } else {
                console.log(`Skipping documentation index clear for ${flavor}: no documentation items were generated.`);
            }

            const apiPaths = getPaths(apiItems, flavor);
            if (apiPaths.length && isFlavorFullyIndexed(apiSearchIndex, flavor)) {
                await clearIndex(true, apiPaths, flavor);
            } else {
                console.log(`Skipping API index clear for ${flavor}: the generated API index does not fully cover this flavor.`);
            }

            if (playgroundItems.some((item) => item.flavor === flavor)) {
                await clearPlaygroundIndex(flavor);
            } else {
                console.log(`Skipping playground index clear for ${flavor}: no playground items were generated.`);
            }
        }
    }

    await addSearchItems([...documentationItems, ...apiItems]);
    await addPlaygroundItems(playgroundItems);

    console.log(
        `Uploaded ${documentationItems.length} documentation search item(s), ${apiItems.length} API search item(s) and ${playgroundItems.length} playground search item(s) for ${flavorsToUpload.join(", ")}.`,
    );
};

void main();
