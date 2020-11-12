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

export interface IFullImage {
    src: string;
    alt: string;
    width: never;
    height: never;
    layout: "fill";
    unsized: true;
    caption?: string;
}

export interface ISizedImageEmbed {
    src: string;
    alt: string;
    width: ReactText;
    height: ReactText;
    layout: "fixed" | "intrinsic" | "responsive";
    unsized: true;
    caption?: string;
}

export type IImageEmbed = IFullImage | ISizedImageEmbed;

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
    lastModified?: string;
}
export interface IDocumentationPageProps extends IPageProps {
    content?: string;
    // this interface should actually contain a lot more than a single string
    childPages?: {
        [key: string]: IDocumentationPageProps;
    };
    relatedArticles?: {
        [key: string]: IDocumentationPageProps;
    };
    relatedExternalLinks?: { url: string; title: string }[];
}
