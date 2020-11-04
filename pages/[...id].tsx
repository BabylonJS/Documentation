import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { createContext, createRef, FunctionComponent, useEffect, useState } from "react";

import Layout from "../components/layout.component";
import { checkUnusedFiles, getAvailableUrls } from "../lib/buildUtils/content.utils";

import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";

import "./documentationPage.style.scss";

// table
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

// testing lib instead of src (documentation states to use the src)
import { BucketContent } from "../components/bucketContent.component";
import { IDocumentationPageProps, IExampleLink, ITableOfContentsItem } from "../lib/content.interfaces";
import { getAllFiles, getPageData, markdownDirectory } from "../lib/buildUtils/tools";
import { ExamplesComponent } from "../components/contentComponents/example.component";
import { InlineExampleComponent } from "../components/contentComponents/inlineExample.component";
import { SyntaxHighlighting } from "../components/markdownComponents/syntaxHighlight.component";
import { NMEMarkdownComponent, PlaygroundMarkdownComponent } from "../components/markdownComponents/example.component";
import { MediaFileComponent, YoutubeComponent } from "../components/markdownComponents/media.component";
import { ImageMarkdownComponent } from "../components/markdownComponents/image.component";
import { H1MarkdownComponent, H2MarkdownComponent, H3MarkdownComponent, H4MarkdownComponent } from "../components/markdownComponents/tableOfContentItem.component";
import { TableOfContent } from "../components/contentComponents/tableOfContent.component";

const components = {
    Youtube: YoutubeComponent,
    Media: MediaFileComponent,
    Playground: PlaygroundMarkdownComponent,
    nme: NMEMarkdownComponent,
    pre: (props) => <div {...props} />,
    code: SyntaxHighlighting,
    table: Table,
    thead: Thead,
    tbody: Tbody,
    tr: Tr,
    th: Th,
    td: Td,
    img: ImageMarkdownComponent,
    h1: H1MarkdownComponent,
    h2: H2MarkdownComponent,
    h3: H3MarkdownComponent,
    h4: H4MarkdownComponent,
};

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
        console.log(tocItem);
        // first make sure we don't have it yet!
        if (tocItem.level < 0 || tmpTOCCache.find((item) => item.id === tocItem.id) || tocLinks.find((item) => item.id === tocItem.id)) {
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
        markdownRef?.current?.scrollTo({ behavior: "auto", top: 0, left: 0 });
        return () => {
            clearExampleLinks();
            setActiveExample(null);
            clearTOCItems();
        };
    }, [id]);

    const renderedContent = hydrate(content, { components });
    return (
        <Layout breadcrumbs={breadcrumbs} previous={previous} next={next} metadata={metadata} id={id}>
            <DocumentationContext.Provider value={{ exampleLinks, addExampleLink, setActiveExample, addTOCItem, setActiveTOCItem, activeTOCItem }}>
                <div className="documentation-container">
                    <div className="markdown-and-playground">
                        <div className="toc-container">
                            <TableOfContent tocItems={tocLinks}></TableOfContent>
                        </div>
                        <InlineExampleComponent {...activeExample} />
                        <div ref={markdownRef} className="markdown-container">
                            {renderedContent}
                        </div>
                    </div>
                    {exampleLinks.length !== 0 && (
                        <div className="examples-container">
                            <ExamplesComponent examples={exampleLinks}></ExamplesComponent>
                        </div>
                    )}
                </div>
            </DocumentationContext.Provider>
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
    const remarkSlug = (await import("remark-slug")).default;
    const remarkLint = (await import("remark-lint")).default;
    props.content = await renderToString(props.content, {
        components,
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
