import { ReactText } from "react";
import { MarkdownMetadata } from "./interfaces";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export interface IMenuItem {
    name: string;
    url: string;
    filtered?: boolean;
    childFoundWithFilter?: boolean;
    // TODO add keywords here for a better filtering experience
    children?: IMenuItem[];
}

export interface IExampleLink {
    type?: "pg" | "nme" | "nge";
    id?: string; // both are accepted
    playgroundId?: string; // both are accepted. This one has priority
    title?: string;
    description?: string;
    image?: string; // both are accepted. This one has priority
    imageUrl?: string; // both are accepted
    isMain?: boolean;
    category?: string;
    documentationPage?: string; // optional, only for examples coming from search results!
    engine?: "webgpu" | "webgl2" | "webgl1";
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
    unsized: true;
    caption?: string;
    fill?: boolean;
}

export interface ISizedImageEmbed {
    src: string;
    alt: string;
    width: number;
    height: number;
    layout: "fixed" | "intrinsic" | "responsive";
    unsized: true;
    caption?: string;
    fill?: boolean;
}

export type IImageEmbed = IFullImage | ISizedImageEmbed;

export interface ITableOfContentsItem {
    level: number;
    id: string;
    title: string;
    image?: string;
    alt?: string;
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
    gitHubUrl?: string;
}
export interface IDocumentationPageProps extends IPageProps {
    content?: string;
    mdxContent?: MDXRemoteSerializeResult;
    // this interface should actually contain a lot more than a single string
    childPages?: {
        [key: string]: IDocumentationPageProps;
    };
    relatedArticles?: {
        [key: string]: IDocumentationPageProps;
    };
    relatedExternalLinks?: { url: string; title: string }[];
}
