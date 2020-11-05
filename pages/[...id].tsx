import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { createContext, createRef, FunctionComponent, useEffect, useState } from "react";

import Layout from "../components/layout.component";
import { checkUnusedFiles, getAvailableUrls } from "../lib/buildUtils/content.utils";

import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";

import "./documentationPage.style.scss";

import { markdownComponents } from "../components/markdownComponents/markdownComponents";

// testing lib instead of src (documentation states to use the src)
import { BucketContent } from "../components/bucketContent.component";
import { IDocumentationPageProps, IExampleLink, ITableOfContentsItem } from "../lib/content.interfaces";
import { getAllFiles, getPageData, markdownDirectory } from "../lib/buildUtils/tools";
import { ExamplesComponent } from "../components/contentComponents/example.component";
import { InlineExampleComponent } from "../components/contentComponents/inlineExample.component";
import { TableOfContent } from "../components/contentComponents/tableOfContent.component";
import { MediaMarkdownComponent, YoutubeComponent } from "../components/markdownComponents/media.component";

interface DocumentationPageContext {
    exampleLinks: IExampleLink[];
    addExampleLink: (_link: IExampleLink) => void;
    setActiveExample: (_link: IExampleLink) => void;
    addTOCItem: (_tocItem: ITableOfContentsItem) => void;
    activeTOCItem: ITableOfContentsItem | null;
    setActiveTOCItem: (_tocItem: ITableOfContentsItem) => void;
}

export const DocumentationContext = createContext<DocumentationPageContext>({
    exampleLinks: [],
    addExampleLink: (_link: IExampleLink) => {},
    setActiveExample: (_link: IExampleLink) => {},
    addTOCItem: (_tocItem: ITableOfContentsItem) => {},
    activeTOCItem: null,
    setActiveTOCItem: (_tocItem: ITableOfContentsItem) => {},
});

export const DocumentationPage: FunctionComponent<IDocumentationPageProps> = ({ breadcrumbs, metadata, content, childPages, id, previous, next }) => {
    const [exampleLinks, setExampleLinks] = useState<IExampleLink[]>([]);
    const [activeExample, setActiveExample] = useState<IExampleLink | null>(null);
    const [tocLinks, setTocLinks] = useState<ITableOfContentsItem[]>([]);
    const [activeTOCItem, setActiveTOCItem] = useState<ITableOfContentsItem | null>(null);

    // console.log(metadata);

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
        })
        return () => {
            clearExampleLinks();
            setActiveExample(null);
            clearTOCItems();
        };
    }, [id]);

    const components = markdownComponents;
    const renderedContent = hydrate(content, { components });
    return (
        <Layout breadcrumbs={breadcrumbs} previous={previous} next={next} metadata={metadata} id={id}>
            <DocumentationContext.Provider value={{ exampleLinks, addExampleLink, setActiveExample, addTOCItem, setActiveTOCItem, activeTOCItem }}>
                <div className="documentation-container">
                    <div className="markdown-and-playground">
                        <InlineExampleComponent {...activeExample} />
                        <div ref={markdownRef} className="markdown-container">
                            <h1>{metadata.title}</h1>
                            <div className="toc-container">
                                <TableOfContent tocItems={tocLinks}></TableOfContent>
                            </div>
                            {metadata.videoOverview && (
                                <>
                                    <h2>Video Overview</h2>
                                    {/* Assuming video overview is always youtube! Can be changed */}
                                    <MediaMarkdownComponent url={metadata.videoOverview} type="youtube"></MediaMarkdownComponent>
                                </>
                            )}
                            {renderedContent}
                            <BucketContent childPages={childPages}></BucketContent>
                        </div>
                    </div>
                    {exampleLinks.length !== 0 && (
                        <div className="examples-container">
                            <ExamplesComponent examples={exampleLinks}></ExamplesComponent>
                        </div>
                    )}
                </div>
            </DocumentationContext.Provider>
        </Layout>
    );
};

export default DocumentationPage;

export interface IDocumentationParsedUrlQuery extends ParsedUrlQuery {
    id: string[];
}

export const getStaticProps: GetStaticProps<{ [key: string]: any }, IDocumentationParsedUrlQuery> = async ({ params }) => {
    const props = getPageData(params.id, true);
    const remarkSlug = (await import("remark-slug")).default;
    const remarkLint = (await import("remark-lint")).default;
    props.content = await renderToString(props.content, {
        components: markdownComponents,
        mdxOptions: {
            remarkPlugins: [remarkSlug, remarkLint],
        },
    });
    return {
        props,
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    console.log("main getStaticPages");
    const paths = getAvailableUrls();
    checkUnusedFiles(
        paths,
        getAllFiles(markdownDirectory).map((path) => path.replace(/\\/g, "/").replace("content/", "")),
    );
    return {
        paths,
        fallback: false,
    };
};
