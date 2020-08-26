import { IDocMenuItem } from "./interfaces";

// very temporary structure configuration
import structure from "../configuration/structure.json";
import { IMenuItem } from "./pages.interfaces";

// cast for general usage
export const config: IDocMenuItem = structure;

export const docItems: Array<IDocMenuItem & { idArray: string[] }> = [];

export const populateDocItemsArray = () => {
    if (docItems.length) {
        return;
    }
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

export const getAvailableUrls = () => {
    const array = [];

    function traverseChildren(prevKeys: string[], childrenObject: { [key: string]: IDocMenuItem }) {
        Object.keys(childrenObject).forEach((key) => {
            array.push({
                params: {
                    id: [...prevKeys, key],
                },
            });
            if (childrenObject[key].children) {
                traverseChildren([...prevKeys, key], childrenObject[key].children);
            }
        });
    }

    traverseChildren([], config.children);

    return array;
};

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

export const getElementByToIdArray = (ids: string[], skipPrevNext: boolean): { doc: IDocMenuItem; prev?: IDocMenuItem & { idArray: string[] }; next?: IDocMenuItem & { idArray: string[] } } | undefined => {
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
