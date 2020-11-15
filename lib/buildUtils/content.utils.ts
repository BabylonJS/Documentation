import { IDocMenuItem } from "../interfaces";

// very temporary structure configuration
import structure from "../../configuration/structure.json";
import { IMenuItem } from "../content.interfaces";
import { clearIndex, clearPlaygroundIndex } from "./search.utils";

// cast for general usage
export const config: IDocMenuItem = structure;

export const docItems: Array<IDocMenuItem & { idArray: string[] }> = [];

export const populateDocItemsArray = () => {
    if (docItems.length) {
        return;
    }
    docItems.push({
        idArray: [],
        ...config
    })
    function traverseChildren(prevKeys: string[], childrenObject: { [key: string]: IDocMenuItem }) {
        Object.keys(childrenObject).forEach((key) => {
            docItems.push({ ...childrenObject[key], idArray: [...prevKeys, key] });
            if (childrenObject[key].children) {
                traverseChildren([...prevKeys, key], childrenObject[key].children);
            }
        });
    }

    traverseChildren([], config.children);
};

export const getAvailableUrls = async (): Promise<{ params: { id: string[]; content?: string } }[]> => {
    const array = [{
        params: {
            id: [] as string[],
            ...config
        }
    }];

    function traverseChildren(prevKeys: string[], childrenObject: { [key: string]: IDocMenuItem }) {
        Object.keys(childrenObject).forEach((key) => {
            if (childrenObject[key].content || (childrenObject[key].children && childrenObject[key].children.length))
                array.push({
                    params: {
                        ...childrenObject[key],
                        id: [...prevKeys, key],
                    },
                });
            if (childrenObject[key].children) {
                traverseChildren([...prevKeys, key], childrenObject[key].children);
            }
        });
    }

    traverseChildren([], config.children);

    if (process.env.PRODUCTION) {
        console.log("clearing search index");
        const existingDocs = array.map(({ params }) => `/${params.id.join("/")}`);
        await clearIndex(false, existingDocs);
        // await clearPlaygroundIndex();
    }

    return array;
};

export const checkUnusedFiles = (contentArray: { params: { id: string[]; content?: string } }[], allMarkdownFiles: string[]) => {
    contentArray.forEach((contentFile) => {
        if (contentFile.params.content) {
            const idx = allMarkdownFiles.indexOf(contentFile.params.content + ".md");
            if (idx !== -1) {
                allMarkdownFiles.splice(idx, 1);
            } else {
            }
        }
    });
    if (allMarkdownFiles.length) {
        allMarkdownFiles.forEach((file) => {
            console.log("Missing in structure.json: ", file);
        });
        throw new Error("Orphan markdown files detected");
    }
};

export const checkDuplicates = (contentArray: { params: { id: string[]; content?: string } }[]) => {
    const map = {};
    contentArray.forEach((contentFile) => {
        if(map[contentFile.params.content]) {
            console.log('duplicate content in id', contentFile.params.id, map[contentFile.params.content])
        } else {
            map[contentFile.params.content] = contentFile.params.id;
        }
    });
}

export const generateBreadcrumbs = (ids: string[]) => {
    let currentChildren = config.children;
    return ids.map((id, idx) => {
        const { friendlyName } = currentChildren[id];
        currentChildren = currentChildren[id].children;
        return {
            name: friendlyName,
            url: `/${ids.slice(0, idx + 1).join("/")}`,
        };
    });
};

export const getElementByIdArray = (ids: string[], skipPrevNext: boolean): { doc: IDocMenuItem; prev?: IDocMenuItem & { idArray: string[] }; next?: IDocMenuItem & { idArray: string[] } } | undefined => {
    populateDocItemsArray();
    const found = docItems.findIndex(({ idArray }) => ids.length === idArray.length && ids.every((value, index) => value === idArray[index]));
    if (found !== -1) {
        const prev = skipPrevNext || found === 0 ? undefined : docItems[found - 1];
        const next = skipPrevNext || found === docItems.length - 1 ? undefined : docItems[found + 1];
        return {
            doc: docItems[found],
            prev,
            next,
        };
    }
};

export const generateMenuStructure = (docMenuItem: IDocMenuItem = config): IMenuItem[] => {
    const array: IMenuItem[] = [];

    function traverseChildren(itemsArray: IMenuItem[], prevKeys: string[], childrenObject: { [key: string]: IDocMenuItem }) {
        Object.keys(childrenObject).forEach((key) => {
            const menuItem = {
                name: childrenObject[key].friendlyName,
                url: `/${[...prevKeys, key].join("/")}`,
                children: [],
            };
            itemsArray.push(menuItem);
            if (childrenObject[key].children) {
                traverseChildren(menuItem.children, [...prevKeys, key], childrenObject[key].children);
            }
        });
    }

    traverseChildren(array, [], docMenuItem.children || {});

    return array;
};
