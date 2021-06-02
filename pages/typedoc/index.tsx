import { FunctionComponent } from "react";
import { GetStaticProps } from "next";
import { getAPIPageData } from "../../lib/buildUtils/typedoc.utils";
import { parseNode } from "../../lib/buildUtils/parser.utils";
import { MarkdownMetadata } from "../../lib/interfaces";
import Layout from "../../components/layout.component";
import Head from "next/head";

// import styles from "./apiPage.module.scss";

export const ApiPage: FunctionComponent<{
    id: string[];
    metadata: MarkdownMetadata;
    cssArray: any[];
    contentNode: any;
}> = ({ contentNode, cssArray, metadata }) => {
    const html = parseNode(contentNode).result;
    // remove unneeded tags
    const children = html.props.children[0].props.children[2].props.children;
    return (
        <Layout breadcrumbs={generateBreadcrumbs()} metadata={metadata} id={['typedoc']}>
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
    const content = await getAPIPageData(['globals']);
    return {
        props: {
            ...content,
        },
    };
};

export const generateBreadcrumbs = () => {
    return [{
        name: 'BABYLON',
        url: '/typedoc'
    }];
};
