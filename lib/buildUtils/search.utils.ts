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

export interface ISearchResult {
    "@search.score": number;
    id: string;
    title: string;
    imageUrl: string;
    description: string;
    isApi: boolean;
    path: string;
    categories: string[];
    lastModified: Date;
    videoLink: string;
}

const headers = {
    "Content-type": "application/json; charset=UTF-8",
    "api-key": process.env.SEARCH_API_KEY,
};

const getUrl = (type: string) => {
    return `https://babylonjs-doc.search.windows.net/indexes/newdocs/docs/${type}?api-version=2020-06-30`;
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

export const clearIndex = async (isApi: boolean = false) => {
    if (!process.env.SEARCH_API_KEY) {
        return;
    }
    console.log("clearing search index. isApi:", isApi);
    // get all elements
    const results = await fetch(getUrl("search"), {
        // Adding method type
        method: "POST",

        body: JSON.stringify({
            filter: `isApi eq ${isApi}`,
            top: 1000,
        }),

        // Adding body or contents to send

        // Adding headers to the request
        headers,
    });
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
    const result = await results.json();
    while (result.value.length) {
        const toDelete = (result.value as Array<ISearchResult>).splice(0, 50);
        const httpResult = await removeDocuments(toDelete.map((item) => item.id));
        console.log("Removed documents - ", toDelete.length, "api - ", isApi);
        if (!httpResult.ok) {
            throw new Error("error clearing index");
        }
    }
    console.log("search index cleared");
};
