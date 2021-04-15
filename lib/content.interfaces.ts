import { ReactText } from "react";
import { MarkdownMetadata } from "./interfaces";
import { MdxRemote } from "next-mdx-remote/types";

export interface IMenuItem {
    name: string;
    url: string;
    filtered?: boolean;
    childFoundWithFilter?: boolean;
    // TODO add keywords here for a better filtering experience
    children?: IMenuItem[];
}

export interface IExampleLink {
    type?: "pg" | "nme";
    id?: string; // both are accepted
    playgroundId?: string; // both are accepted. This one has priority
    title?: string;
    description?: string;
    image?: string; // both are accepted. This one has priority
    imageUrl?: string; // both are accepted
    isMain?: boolean;
    category?: string;
    documentationPage?: string; // optional, only for examples coming from search results!
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
    caption?: string;
    width?: ReactText;
    height?: ReactText;
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
    lastModified?: string;
}
export interface IDocumentationPageProps extends IPageProps {
    content?: string;
    mdxContent?: MdxRemote.Source;
    // this interface should actually contain a lot more than a single string
    childPages?: {
        [key: string]: IDocumentationPageProps;
    };
    relatedArticles?: {
        [key: string]: IDocumentationPageProps;
    };
    relatedExternalLinks?: { url: string; title: string }[];
}
