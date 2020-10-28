import { FunctionComponent } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { generateTypeDoc, getAPIPageData } from "../../lib/api.utils";
import { parseNode } from "../../lib/unified.utils";
import { MarkdownMetadata } from "../../lib/interfaces";
import Layout from "../../components/layout.component";
import Head from "next/head";

import "./apiPage.style.scss";

export const ApiPage: FunctionComponent<{
    id: string[];
    metadata: MarkdownMetadata;
    cssArray: any[];
    contentNode: any;
}> = ({ contentNode, cssArray, metadata, id }) => {
    const html = parseNode(contentNode).result;
    // remove unneeded tags
    const children = html.props.children[0].props.children[1].props.children;
    return (
        <Layout breadcrumbs={generateBreadcrumbs(id)} metadata={metadata} id={id}>
            <Head>
                {cssArray.map((css, idx) => {
                    return (
                        <style key={`css-${idx}`} type="text/css">
                            {css}
                        </style>
                    );
                })}
            </Head>
            <div className="api-container">{children}</div>
        </Layout>
    );
};

export default ApiPage;

export const getStaticProps: GetStaticProps<{ [key: string]: any }, any> = async ({ params }) => {
    // HTML content
    const content = getAPIPageData(params.id);
    return {
        props: {
            ...content,
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    console.log("get static paths");
    const paths = await generateTypeDoc();
    return {
        paths,
        fallback: false,
    };
};

export const generateBreadcrumbs = (ids: string[]) => {
    
    const breadcrumbs = ids.map((id, idx) => {
        return {
            name: id,
            url: idx ? `/apis/${ids.slice(0, idx + 1).join("/")}` : '',
        };
    });
    breadcrumbs.unshift({
        name: 'API',
        url: '/apis/'
    })

    return breadcrumbs;
};
