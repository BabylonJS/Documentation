import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FunctionComponent } from "react";

import Layout from "../components/layout.component";
import { checkUnusedFiles, getAvailableUrls } from "../lib/buildUtils/content.utils";

import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";

import "./documentationPage.style.scss";

// testing lib instead of src (documentation states to use the src)
import { BucketContent } from "../components/bucketContent.component";
import { IDocumentationPageProps } from "../lib/content.interfaces";
import { getAllFiles, getPageData, markdownDirectory } from "../lib/buildUtils/tools";
import { PlaygroundMarkdownComponent } from "../components/contentComponents/playground.component";

const components = { Playground: PlaygroundMarkdownComponent };

export const DocumentationPage: FunctionComponent<IDocumentationPageProps> = ({ breadcrumbs, metadata, content, childPages, id, previous, next }) => {
    const renderedContent = hydrate(content, { components });
    return (
        <Layout breadcrumbs={breadcrumbs} previous={previous} next={next} metadata={metadata} id={id}>
            {renderedContent && <div className="markdown-container"><div>{renderedContent}</div></div>}
            <BucketContent childPages={childPages}></BucketContent>
        </Layout>
    );
};

export default DocumentationPage;

export interface IDocumentationParsedUrlQuery extends ParsedUrlQuery {
    id: string[];
}

export const getStaticProps: GetStaticProps<{ [key: string]: any }, IDocumentationParsedUrlQuery> = async ({ params }) => {
    const props = getPageData(params.id, true);
    props.content = await renderToString(props.content, { components });
    return {
        props,
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    console.log("main getStaticPages");
    const paths = getAvailableUrls();
    checkUnusedFiles(paths, getAllFiles(markdownDirectory).map(path => path.replace(/\\/g, '/').replace('content/', '')));
    return {
        paths,
        fallback: false,
    };
};
