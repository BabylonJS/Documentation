import { ReactText } from "react";
import { MarkdownMetadata } from "./interfaces";

export interface IMenuItem {
    name: string;
    url: string;
    filtered?: boolean;
    childFoundWithFilter?: boolean;
    // TODO add keywords here for a better filtering experience
    children?: IMenuItem[];
}

export interface IExampleLink {
    type: "pg" | "nme";
    id?: string;
    title?: string;
    description?: string;
    image?: string;
}

export interface IMediaEmbed {
    type: "youtube" | "file";
    url?: string;
    id?: string;
    noControls?: boolean;
}

export interface IImageEmbed {
    src: string;
    alt: string;
    width?: ReactText;
    height?: ReactText;
    layout: "fill" | "fixed" | "intrinsic" | "responsive";
    unsized: true;
}

export interface ITableOfContentsItem {
    level: number;
    id: string;
    title: string;
}

export interface IPageProps {
    breadcrumbs: Array<{
        name: string;
        url: string;
    }>;
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
