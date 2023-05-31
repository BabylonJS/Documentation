import { IDocumentSearchResult, ISearchResult } from "../frontendUtils/searchQuery.utils";

export interface ISearchIndexItem {
    id: string;
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

const headers = {
    "Content-type": "application/json; charset=UTF-8",
    "api-key": API_KEY,
};

const getUrl = (type: string, indexName: string = 'documents') => {
    return `https://babylonjs-newdocs.search.windows.net/indexes/${indexName}/docs/${type}?api-version=2020-06-30`;
};

export const addSearchItem = async (searchItem: ISearchIndexItem) => {
    if (!process.env.SEARCH_API_KEY) {
        return;
    }
    const result = await fetch(getUrl("index"), {
        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify({
            value: [
                {
                    "@search.action": "mergeOrUpload",
                    ...searchItem,
                },
            ],
        }),

        // Adding headers to the request
        headers,
    });

    if (!result.ok) {
        console.log(await result.json());
        throw new Error("error indexing document");
    }
    return result;
};

export const addPlaygroundItem = async (item: IPlaygroundSearchItem) => {
    if (!process.env.SEARCH_API_KEY) {
        return;
    }
    const result = await fetch(getUrl("index", "playgrounds"), {
        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify({
            value: [
                {
                    "@search.action": "mergeOrUpload",
                    ...item,
                },
            ],
        }),

        // Adding headers to the request
        headers,
    });

    if (!result.ok) {
        console.log(await result.json());
        throw new Error("error indexing playground");
    }
    return result;
}

export const clearPlaygroundIndex = async () => {
    if (!process.env.SEARCH_API_KEY) {
        console.log("no search API key defined");
        return;
    }
    console.log("clearing playgrounds index.");
    // get all elements
    const getResults = async (params?: { top?: number, skip?: number }) => {
        return await fetch(getUrl("search", "playgrounds"), {
            // Adding method type
            method: "POST",
            
            body: JSON.stringify({
                filter: `isMain eq true`,
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
    let result = (await (await getResults()).json());
    const values = [];
    while (result["@odata.nextLink"]) {
        values.push(...result.value);
        result = (await (await getResults(result["@search.nextPageParameters"])).json());
    }
    values.push(...result.value);
        

    const filtered = values && (values as Array<ISearchResult>);
    while (filtered.length) {
        const toDelete = filtered.splice(0, 50);
        const httpResult = await removeDocuments(toDelete.map((item) => item.id));
        console.log("Removed playground - ", toDelete.length);
        if (!httpResult.ok) {
            throw new Error("error clearing index");
        }
    }
    console.log("search index cleared");
};

export const clearIndex = async (isApi: boolean = false, doNotDelete: string[] = []) => {
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

    const getResults = async (params?: { top?: number, skip?: number }) => {
        return await fetch(getUrl("search"), {
            // Adding method type
            method: "POST",

            body: JSON.stringify({
                filter: `isApi eq ${isApi}`,
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
    let result = (await (await getResults()).json());
    while (result["@odata.nextLink"]) {
        values.push(...result.value);
        result = (await (await getResults(result["@search.nextPageParameters"])).json());
    }
    values.push(...result.value);
    const filtered = values && (values as Array<IDocumentSearchResult>).filter((res) => !doNotDelete.includes(res.path));
    while (filtered.length) {
        const toDelete = filtered.splice(0, 50);
        const httpResult = await removeDocuments(toDelete.map((item) => item.id));
        console.log("Removed documents - ", toDelete.length, "api - ", isApi);
        if (!httpResult.ok) {
            throw new Error("error clearing index");
        }
    }
    console.log("search index cleared. isApi:", isApi);
};
