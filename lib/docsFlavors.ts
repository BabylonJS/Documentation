import { IMenuItem } from "./content.interfaces";

export type DocsFlavorId = "babylon" | "lite";

export interface IDocsFlavor {
    id: DocsFlavorId;
    label: string;
    basePath: string;
    apiPath: string;
    searchPath: string;
    githubUrl: string;
    documentationGithubUrl: string;
    menuItems?: IMenuItem[];
}

export const docsFlavors: Record<DocsFlavorId, IDocsFlavor> = {
    babylon: {
        id: "babylon",
        label: "Babylon.js",
        basePath: "",
        apiPath: "/typedoc",
        searchPath: "/search",
        githubUrl: "https://github.com/BabylonJS/Babylon.js",
        documentationGithubUrl: "https://github.com/BabylonJS/Documentation/blob/master/content",
    },
    lite: {
        id: "lite",
        label: "Babylon Lite",
        basePath: "/lite",
        apiPath: "/lite/typedoc",
        searchPath: "/lite/search",
        githubUrl: "https://github.com/BabylonJS/Babylon.js",
        documentationGithubUrl: "https://github.com/BabylonJS/Documentation/blob/master/content/lite",
        menuItems: [
            {
                name: "Overview",
                url: "/lite",
                children: [],
            },
        ],
    },
};

export const docsFlavorList = Object.values(docsFlavors);

export const getDocsFlavorFromId = (id: string[] = []): IDocsFlavor => {
    return id[0] === docsFlavors.lite.basePath.slice(1) ? docsFlavors.lite : docsFlavors.babylon;
};

export const isLiteDocsPath = (id: string[] = []) => getDocsFlavorFromId(id).id === "lite";