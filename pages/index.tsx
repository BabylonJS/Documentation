import { GetStaticProps } from "next";
import { createRef, useEffect, useState } from "react";

import Layout from "../components/layout.component";

import {serialize} from "next-mdx-remote/serialize";
import { MDXRemote } from 'next-mdx-remote'

import styles from "./documentationPage.module.scss";

import { markdownComponents } from "../components/markdownComponents/markdownComponents";

// testing lib instead of src (documentation states to use the src)
import { BucketContent } from "../components/bucketContent.component";
import { IExampleLink, ITableOfContentsItem } from "../lib/content.interfaces";
import { getPageData } from "../lib/buildUtils/tools";
import { InlineExampleComponent } from "../components/contentComponents/inlineExample.component";
import Head from "next/head";
import { DocumentationContext, IDocumentationParsedUrlQuery } from "./[...id]";

export default function Home({ metadata, mdxContent, childPages, id }) {
    const [exampleLinks, setExampleLinks] = useState<IExampleLink[]>([]);
    const [activeExample, setActiveExample] = useState<IExampleLink | null>(null);
    const [tocLinks, setTocLinks] = useState<ITableOfContentsItem[]>([]);
    const [activeTOCItem, setActiveTOCItem] = useState<ITableOfContentsItem | null>(null);

    const markdownRef = createRef<HTMLDivElement>();

    // To avoid context empty when adding more than one example in one time
    const tmpExamplesCache = [];
    const tmpTOCCache = [];

    const addExampleLink = (link: IExampleLink) => {
        // first make sure we don't have it yet!
        if (tmpExamplesCache.find((item) => item.id === link.id) || exampleLinks.find((item) => item.id === link.id)) {
            return;
        }
        tmpExamplesCache.push(link);
        setExampleLinks([...exampleLinks, ...tmpExamplesCache]);
    };

    const addTOCItem = (tocItem: ITableOfContentsItem) => {
        // first make sure we don't have it yet!
        if (tocItem.level < 1 || tmpTOCCache.find((item) => item.id === tocItem.id) || tocLinks.find((item) => item.id === tocItem.id)) {
            return;
        }
        tmpTOCCache.push(tocItem);
        setTocLinks([...tocLinks, ...tmpTOCCache]);
    };

    const clearExampleLinks = () => {
        tmpExamplesCache.length = 0;
        setExampleLinks([]);
    };

    const clearTOCItems = () => {
        setTocLinks([]);
        tmpTOCCache.length = 0;
    };

    useEffect(() => {
        setTimeout(() => {
            markdownRef?.current?.scrollTo({ behavior: "auto", top: 0, left: 0 });
        });
        return () => {
            clearExampleLinks();
            setActiveExample(null);
            clearTOCItems();
        };
    }, [id]);

    const components = markdownComponents;
    const renderedContent = <MDXRemote {...mdxContent} components={components} />
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
            <DocumentationContext.Provider value={{ exampleLinks, addExampleLink, setActiveExample, addTOCItem, setActiveTOCItem, activeTOCItem }}>
                <div className={styles['documentation-container']}>
                    <div className={styles["markdown-and-playground"]}>
                        <InlineExampleComponent {...activeExample} />
                        <div ref={markdownRef} className={styles["markdown-container"]}>
                            <h1>{metadata.title}</h1>
                            {renderedContent}
                            <BucketContent childPages={childPages}></BucketContent>
                        </div>
                    </div>
                </div>
            </DocumentationContext.Provider>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps<{ [key: string]: any }, IDocumentationParsedUrlQuery> = async ({ params }) => {
    const props = await getPageData([], true);
    const remarkSlug = (await import("remark-slug")).default;
    const remarkLint = (await import("remark-lint")).default;
    props.mdxContent = await serialize(props.content, {
        // components: markdownComponents,
        mdxOptions: {
            remarkPlugins: [remarkSlug, remarkLint],
        },
    });
    return {
        props,
    };
};
