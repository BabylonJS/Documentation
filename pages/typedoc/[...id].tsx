import { FunctionComponent, useRef, useEffect } from "react";
import { GetStaticPaths } from "next";
import { generateTypeDoc, getAPIPageData } from "../../lib/buildUtils/typedoc.utils";
import { parseNode } from "../../lib/buildUtils/parser.utils";
import { MarkdownMetadata } from "../../lib/interfaces";
import Layout from "../../components/layout.component";
import Head from "next/head";
import { useRouter } from "next/router";

// import "./apiPage.module.scss";
import { ParsedUrlQuery } from "querystring";

export const ApiPage: FunctionComponent<{
    id: string[];
    metadata: MarkdownMetadata;
    cssArray: any[];
    contentNode: any;
    redirect?: string;
    breadcrumbs: {
        name: string;
        url: string;
    }[];
}> = ({ contentNode, cssArray = [], metadata, id, breadcrumbs, redirect }) => {
    if (!contentNode && !redirect) {
        return <></>;
    }
    const ref = useRef<HTMLDivElement>();
    const html = redirect ? "" : parseNode(contentNode).result;
    let children = <></>;
    try {
        children = html.props.children[0].props.children[1].props.children;
    } catch (e) {}
    const router = useRouter();
    useEffect(() => {
        if (redirect) {
            router.replace(redirect + window.location.hash);
        } else {
            const onhashchange = () => {
                if (location.hash === "") {
                    document.querySelector(".col-content")?.scrollTo({ behavior: "auto", top: 0, left: 0 });
                }
            };
            window.addEventListener("hashchange", onhashchange);
            return () => {
                window.removeEventListener("hashchange", onhashchange);
            };
        }
    }, [id]);

    // do not render if redirecting
    if (redirect) {
        return <></>;
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
            <div ref={ref} className="api-container">
                {children}
            </div>
        </Layout>
    );
};

export default ApiPage;

export interface IAPIParsedUrlQuery extends ParsedUrlQuery {
    id: string[];
}

export const getStaticProps /*: GetStaticProps<{ [key: string]: any }, IAPIParsedUrlQuery>*/ = async ({ params }) => {
    const content = await getAPIPageData(params.id);
    if (content.redirect) {
        return {
            props: {
                redirect: content.redirect,
                id: params.id,
            },
        };
    }
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
