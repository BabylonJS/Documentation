import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FunctionComponent } from "react";

import Layout from "../components/layout.component";
import { getAvailableUrls } from "../lib/page.utils";

import "./documentationPage.style.scss";
import { parseMDFile } from "../lib/unified.utils";

// testing lib instead of src (documentation states to use the src)
import { BucketContent } from "../components/bucketContent.component";
import { IDocumentationPageProps } from "./pages.interfaces";
import { getPageData } from "../lib/build.utils";

export const DocumentationPage: FunctionComponent<IDocumentationPageProps> = ({ breadcrumbs, metadata, content, childPages, id, previous, next }) => {
    return (
        <Layout breadcrumbs={breadcrumbs} previous={previous} next={next} metadata={metadata} id={id}>
            {content && <div className="markdown-container">{parseMDFile(content).result}</div>}
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
    return {
        props,
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAvailableUrls();
    return {
        paths,
        fallback: false,
    };
};
