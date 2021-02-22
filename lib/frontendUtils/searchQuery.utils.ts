export interface ISearchResult {
    "@search.score": number;
    id: string;
    title: string;
    imageUrl?: string;
    description?: string;
}
export interface IPlaygroundSearchResult extends ISearchResult {
    playgroundId: string;
    documentationPage?: string;
    isMain?: boolean;
    category?: string;
}

export interface IDocumentSearchResult extends ISearchResult {
    isApi: boolean;
    path: string;
    categories: string[];
    lastModified: Date;
    videoLink: string;
}

export async function queryIndex<T extends ISearchResult>(query: string, type: "playgrounds" | "documents" = "documents") {
    const result = await fetch(`https://babylonjs-newdocs.search.windows.net/indexes/${type}/docs?api-version=2020-06-30&search=${query}`, {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            // read key - can be exposed
            "api-key": "820DCA4087091C0386B0F0A266710390",
        },
    });
    return (await (await result.json()).value) as T[];
}
