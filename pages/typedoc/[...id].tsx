import { FunctionComponent, useEffect, useRef } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { generateTypeDoc, getAPIPageData } from "../../lib/buildUtils/typedoc.utils";
import { parseNode } from "../../lib/buildUtils/parser.utils";
import { MarkdownMetadata } from "../../lib/interfaces";
import Layout from "../../components/layout.component";
import Head from "next/head";

// import "./apiPage.module.scss";
import { ParsedUrlQuery } from "querystring";

export const ApiPage: FunctionComponent<{
    id: string[];
    metadata: MarkdownMetadata;
    cssArray: any[];
    contentNode: any;
    breadcrumbs: {
        name: string;
        url: string;
    }[]
}> = ({ contentNode, cssArray, metadata, id, breadcrumbs }) => {
    if (!contentNode) {
        return <></>;
    }
    const ref = useRef<HTMLDivElement>();
    const html = parseNode(contentNode).result;
    let children = <></>;
    try {
        children = html.props.children[0].props.children[2].props.children;
    } catch (e) {
    }

    return (
        <Layout breadcrumbs={breadcrumbs} metadata={metadata} id={["typedoc", ...id]}>
            <Head>
                {cssArray.map((css, idx) => {
                    return (
                        <style key={`css-${idx}`} type="text/css">
                            {css}
                        </style>
                    );
                })}
            </Head>
            <div ref={ref} className="api-container">{children}</div>
        </Layout>
    );
};

export default ApiPage;

export interface IAPIParsedUrlQuery extends ParsedUrlQuery {
    id: string[];
}

export const getStaticProps: GetStaticProps<{ [key: string]: any }, IAPIParsedUrlQuery> = async ({ params }) => {
    // HTML content
    const content = await getAPIPageData(params.id);
    return {
        props: {
            ...content,
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    console.log("API - get static paths");
    const paths = await generateTypeDoc();
    return {
        paths,
        fallback: false,
    };
};
