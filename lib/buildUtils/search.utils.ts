import { IDocumentSearchResult, ISearchResult } from "../frontendUtils/searchQuery.utils";
import { type DocsFlavorId } from "../docsFlavors";

export interface ISearchIndexItem {
    id: string;
    flavor: DocsFlavorId;
    title: string;
    imageUrl?: string;
    description?: string;
    content?: string;
    isApi?: boolean;
    keywords?: string[];
    path?: string;
    categories?: string[];
    lastModified?: Date;
    videoLink?: string;
}

export interface IPlaygroundSearchItem {
    id: string;
    flavor: DocsFlavorId;
    playgroundId: string;
    title: string;
    imageUrl?: string;
    description?: string;
    keywords?: string[];
    documentationPage?: string;
    isMain?: boolean;
    category?: string;
}

const API_KEY = process.env.SEARCH_API_KEY;

const headers: Record<string, string> = {
    "Content-type": "application/json; charset=UTF-8",
    "api-key": API_KEY ?? "",
};

const getUrl = (type: string, indexName: string = 'documents') => {
    return `https://babylonjs-newdocs.search.windows.net/indexes/${indexName}/docs/${type}?api-version=2020-06-30`;
};

export const addSearchItem = async (searchItem: ISearchIndexItem) => {
    return addSearchItems([searchItem]);
};

/**
 * Uploads documents in batches. The API index contains thousands of pages, so uploading
 * one document per request is prohibitively slow.
 */
export const addSearchItems = async (searchItems: ISearchIndexItem[], batchSize: number = 100) => {
    if (!process.env.SEARCH_API_KEY) {
        return;
    }
    for (let index = 0; index < searchItems.length; index += batchSize) {
        const batch = searchItems.slice(index, index + batchSize);
        const result = await fetch(getUrl("index"), {
            method: "POST",
            body: JSON.stringify({
                value: batch.map((searchItem) => ({
                    "@search.action": "mergeOrUpload",
                    ...searchItem,
                })),
            }),
            headers,
        });

        if (!result.ok) {
            console.log(await result.json());
            throw new Error("error indexing document");
        }
    }
};

export const addPlaygroundItem = async (item: IPlaygroundSearchItem) => {
    return addPlaygroundItems([item]);
};

export const addPlaygroundItems = async (items: IPlaygroundSearchItem[], batchSize: number = 100) => {
    if (!process.env.SEARCH_API_KEY) {
        return;
    }
    for (let index = 0; index < items.length; index += batchSize) {
        const batch = items.slice(index, index + batchSize);
        const result = await fetch(getUrl("index", "playgrounds"), {
            method: "POST",
            body: JSON.stringify({
                value: batch.map((item) => ({
                    "@search.action": "mergeOrUpload",
                    ...item,
                })),
            }),
            headers,
        });

        if (!result.ok) {
            console.log(await result.json());
            throw new Error("error indexing playground");
        }
    }
}

export const clearPlaygroundIndex = async (flavorId: DocsFlavorId = "babylon") => {
    if (!process.env.SEARCH_API_KEY) {
        console.log("no search API key defined");
        return;
    }
    console.log("clearing playgrounds index.");
    // Legacy playground documents were indexed before the `flavor` field existed and used an
    // un-prefixed id (`base64(playgroundId)`), so a plain `flavor eq 'babylon'` filter never
    // matched them and left duplicates behind. When clearing the default babylon flavor, also
    // remove those legacy documents (flavor missing/null).
    const filter = flavorId === "babylon" ? `flavor eq '${flavorId}' or flavor eq null` : `flavor eq '${flavorId}'`;
    // get all elements
    const getResults = async (params?: { top?: number, skip?: number }) => {
        return await fetch(getUrl("search", "playgrounds"), {
            // Adding method type
            method: "POST",
            
            body: JSON.stringify({
                filter,
                top: 10000,
                ...params
            }),
            // Adding headers to the request
            headers,
        });
    }
    const removeDocuments = async (ids: string[]) => {
        return await fetch(getUrl("index", "playgrounds"), {
            // Adding method type
            method: "POST",

            // Adding body or contents to send
            body: JSON.stringify({
                value: ids.map((id) => {
                    return {
                        "@search.action": "delete",
                        id,
                    };
                }),
            }),

            // Adding headers to the request
            headers,
        });
    };
    let response = await getResults();
    let result = await response.json();
    if (!response.ok || !Array.isArray(result.value)) {
        console.log("Could not read playgrounds index, skipping clear.", result);
        return;
    }
    const values = [];
    while (result["@odata.nextLink"]) {
        values.push(...result.value);
        response = await getResults(result["@search.nextPageParameters"]);
        result = await response.json();
        if (!response.ok || !Array.isArray(result.value)) {
            break;
        }
    }
    if (Array.isArray(result.value)) {
        values.push(...result.value);
    }

    const filtered = values && (values as Array<ISearchResult>);
    while (filtered.length) {
        const toDelete = filtered.splice(0, 1000);
        const httpResult = await removeDocuments(toDelete.map((item) => item.id));
        console.log("Removed playground - ", toDelete.length);
        if (!httpResult.ok) {
            throw new Error("error clearing index");
        }
    }
    console.log("search index cleared");
};

export const clearIndex = async (isApi: boolean = false, doNotDelete: string[] = [], flavorId: DocsFlavorId = "babylon") => {
    if (!process.env.SEARCH_API_KEY) {
        console.log("no search API key defined");
        return;
    }
    // option to clear the entire index on a production build. Needs to be set server-side.
    if(process.env.OVERRIDE_DONOTDELETE) {
        doNotDelete.length = 0;
        console.log("OVERRIDE_DONOTDELETE is set. Clearing entire index.");
    }
    console.log("clearing search index. isApi:", isApi);

    // Documents indexed before the `flavor` field existed have no flavor value, so a plain
    // `flavor eq 'babylon'` filter never matches them. Include those when clearing the
    // default babylon flavor, otherwise stale documents are never removed.
    const filter = flavorId === "babylon" ? `isApi eq ${isApi} and (flavor eq '${flavorId}' or flavor eq null)` : `isApi eq ${isApi} and flavor eq '${flavorId}'`;

    const getResults = async (params?: { top?: number, skip?: number }) => {
        return await fetch(getUrl("search"), {
            // Adding method type
            method: "POST",

            body: JSON.stringify({
                filter,
                top: 10000,
                ...params
            }),
            // Adding headers to the request
            headers,
        });
    }
    const removeDocuments = async (ids: string[]) => {
        return await fetch(getUrl("index"), {
            // Adding method type
            method: "POST",

            // Adding body or contents to send
            body: JSON.stringify({
                value: ids.map((id) => {
                    return {
                        "@search.action": "delete",
                        id,
                    };
                }),
            }),

            // Adding headers to the request
            headers,
        });
    };
    const values = [];
    let response = await getResults();
    let result = await response.json();
    if (!response.ok || !Array.isArray(result.value)) {
        console.log("Could not read documents index, skipping clear.", result);
        return;
    }
    while (result["@odata.nextLink"]) {
        values.push(...result.value);
        response = await getResults(result["@search.nextPageParameters"]);
        result = await response.json();
        if (!response.ok || !Array.isArray(result.value)) {
            break;
        }
    }
    if (Array.isArray(result.value)) {
        values.push(...result.value);
    }
    const filtered = values && (values as Array<IDocumentSearchResult>).filter((res) => !doNotDelete.includes(res.path));
    while (filtered.length) {
        const toDelete = filtered.splice(0, 1000);
        const httpResult = await removeDocuments(toDelete.map((item) => item.id));
        console.log("Removed documents - ", toDelete.length, "api - ", isApi);
        if (!httpResult.ok) {
            throw new Error("error clearing index");
        }
    }
    console.log("search index cleared. isApi:", isApi);
};
