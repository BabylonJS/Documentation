import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { createContext, createRef, FunctionComponent, useEffect, useState } from "react";

import Layout from "../components/layout.component";
import { checkUnusedFiles, getAvailableUrls } from "../lib/buildUtils/content.utils";

import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";

import "./documentationPage.style.scss";

// table
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

// testing lib instead of src (documentation states to use the src)
import { BucketContent } from "../components/bucketContent.component";
import { IDocumentationPageProps, IExampleLink } from "../lib/content.interfaces";
import { getAllFiles, getPageData, markdownDirectory } from "../lib/buildUtils/tools";
import { ExamplesComponent } from "../components/contentComponents/example.component";
import { InlineExampleComponent } from "../components/contentComponents/inlineExample.component";
import { SyntaxHighlighting } from "../components/markdownComponents/syntaxHighlight.component";
import { NMEMarkdownComponent, PlaygroundMarkdownComponent } from "../components/markdownComponents/example.component";
import { MediaFileComponent, YoutubeComponent } from "../components/markdownComponents/media.component";
import { ImageMarkdownComponent } from "../components/markdownComponents/image.component";

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
    img: ImageMarkdownComponent
};

export const DocumentationContext = createContext({
    exampleLinks: [],
    addExampleLink: (_link: IExampleLink) => {},
    setActiveExample: (_link: IExampleLink) => {},
});

export const DocumentationPage: FunctionComponent<IDocumentationPageProps> = ({ breadcrumbs, metadata, content, childPages, id, previous, next }) => {
    const [exampleLinks, setExampleLinks] = useState<IExampleLink[]>([]);
    const [activeExample, setActiveExample] = useState<IExampleLink | null>();

    const markdownRef = createRef<HTMLDivElement>();

    // To avoid context empty when adding more than one example in one time
    const tmpCache = [];

    const addExampleLink = (link: IExampleLink) => {
        // first make sure we don't have it yet!
        if (tmpCache.find((item) => item.id === link.id) || exampleLinks.find((item) => item.id === link.id)) {
            return;
        }
        tmpCache.push(link);
        setExampleLinks([...exampleLinks, ...tmpCache]);
    };

    const clearExampleLinks = () => {
        tmpCache.length = 0;
        setExampleLinks([]);
    };

    useEffect(() => {
        markdownRef?.current?.scrollTo({behavior: "auto", top: 0, left: 0})
        return () => {
            clearExampleLinks();
            setActiveExample(null);
        };
    }, [id]);

    const renderedContent = hydrate(content, { components });
    return (
        <Layout breadcrumbs={breadcrumbs} previous={previous} next={next} metadata={metadata} id={id}>
            <DocumentationContext.Provider value={{ exampleLinks, addExampleLink, setActiveExample }}>
                <div className="documentation-container">
                    <div className="markdown-and-playground">
                        <InlineExampleComponent {...activeExample} />
                        <div ref={markdownRef} className="markdown-container">{renderedContent}</div>
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
    props.content = await renderToString(props.content, { components });
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
