import { MarkdownMetadata } from "./interfaces";

export interface IMenuItem {
    name: string;
    url: string;
    filtered?: boolean;
    childFoundWithFilter?: boolean;
    // TODO add keywords here for a better filtering experience
    children?: IMenuItem[]
}

export interface IPageProps {
    breadcrumbs: Array<{
        name: string;
        url: string;
    }>
    metadata: MarkdownMetadata;
    id: string[];
    disableMetadataAugmentation?: boolean;
    next?: IPageProps;
    previous?: IPageProps;
}
export interface IDocumentationPageProps extends IPageProps {
    content?: string;
    // this interface should actually contain a lot more than a single string
    childPages?: {
        [key: string]: IDocumentationPageProps;
    };
}