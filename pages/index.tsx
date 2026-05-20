import { GetStaticProps } from "next";
import Head from "next/head";
import { FunctionComponent, useCallback, useEffect, useRef } from "react";

import { BucketContent } from "../components/bucketContent.component";
import { InlineExampleComponent } from "../components/contentComponents/inlineExample.component";
import Layout from "../components/layout.component";
import { DocumentationContextProvider } from "../features/docs/DocumentationContext";
import { DocsMdxRenderer } from "../features/docs/DocsMdxRenderer";
import { useDocsTableOfContents } from "../features/docs/DocsTableOfContentsProvider";
import { useExamplePanel } from "../features/docs/useExamplePanel";
import { getPageData } from "../lib/buildUtils/tools";
import { IDocumentationPageProps } from "../lib/content.interfaces";
import { MarkdownMetadata } from "../lib/interfaces";
import { compileMarkdown } from "../lib/markdown/compileMarkdown";
import styles from "./documentationPage.module.scss";
import type { IDocumentationParsedUrlQuery } from "./[...id]";

export interface HomeProps {
    metadata: MarkdownMetadata;
    mdxContent: IDocumentationPageProps["mdxContent"];
    childPages: {
        [key: string]: IDocumentationPageProps;
    };
    id: string[];
}

export const Home: FunctionComponent<HomeProps> = ({ metadata, mdxContent, childPages, id }) => {
    const markdownRef = useRef<HTMLDivElement>(null);
    const examples = useExamplePanel(markdownRef);
    const tableOfContents = useDocsTableOfContents();
    const { clearExampleLinks, setActiveExample } = examples;
    const { clearTOCItems } = tableOfContents;
    const routeKey = id.join("/");

    const scrollToTop = useCallback(() => {
        markdownRef.current?.scrollTo({ behavior: "auto", top: 0, left: 0 });
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(scrollToTop);
        return () => {
            window.clearTimeout(timeout);
            clearExampleLinks();
            setActiveExample(null);
            clearTOCItems();
        };
    }, [clearExampleLinks, clearTOCItems, routeKey, scrollToTop, setActiveExample]);

    return (
        <Layout
            breadcrumbs={[]}
            metadata={{
                title: "Home",
                description: "The homepage of Babylon.js' documentation page. Start here and get to know the best 3D framework on the web.",
                keywords: "babylonjs, documentation, typedoc, api",
            }}
            id={[]}
        >
            <Head>
                <meta name="google-site-verification" content="wcRjktXhF6DAjmhneKS7UatweBIkEF6QfqsNhAYbUgg" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: `{"@context": "https://schema.org","@type": "WebSite","url": "https://docs.babylonjs.com/","potentialAction": {"@type": "SearchAction","target": "https://docs.babylonjs.com/search?q={search_term_string}","query-input": "required name=search_term_string"}}`,
                    }}
                ></script>
            </Head>
            <DocumentationContextProvider examples={examples} tableOfContents={tableOfContents}>
                <div className={styles["documentation-container"]}>
                    <div className={styles["markdown-and-playground"]}>
                        <InlineExampleComponent {...examples.activeExample} />
                        <div ref={markdownRef} className={styles["markdown-container"]} id="markdown-container">
                            <h1>{metadata.title}</h1>
                            <DocsMdxRenderer mdxContent={mdxContent} />
                            <BucketContent childPages={childPages}></BucketContent>
                        </div>
                    </div>
                </div>
            </DocumentationContextProvider>
        </Layout>
    );
};

export default Home;

export const getStaticProps: GetStaticProps<{ [key: string]: any }, IDocumentationParsedUrlQuery> = async () => {
    const props = await getPageData([], true);
    props.mdxContent = await compileMarkdown(props.content ?? "");
    return {
        props,
    };
};
