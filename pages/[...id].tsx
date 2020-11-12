import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import hydrate from "next-mdx-remote/hydrate";
import Layout from "../components/layout.component";
import renderToString from "next-mdx-remote/render-to-string";
import { BucketContent } from "../components/bucketContent.component";
import { checkUnusedFiles, getAvailableUrls } from "../lib/buildUtils/content.utils";
import { createContext, FunctionComponent, useEffect, useRef, useState } from "react";
import { ExamplesComponent } from "../components/contentComponents/example.component";
import { getAllFiles, getPageData, markdownDirectory } from "../lib/buildUtils/tools";
import { GetStaticPaths, GetStaticProps } from "next";
import { IconButton, Tooltip } from "@material-ui/core";
import { IDocumentationPageProps, IExampleLink, ITableOfContentsItem } from "../lib/content.interfaces";
import { InlineExampleComponent } from "../components/contentComponents/inlineExample.component";
import { markdownComponents } from "../components/markdownComponents/markdownComponents";
import { MediaMarkdownComponent } from "../components/markdownComponents/media.component";
import { ParsedUrlQuery } from "querystring";
import { TableOfContent } from "../components/contentComponents/tableOfContent.component";
import "./documentationPage.style.scss";

// testing lib instead of src (documentation states to use the src)

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

export const DocumentationPage: FunctionComponent<IDocumentationPageProps> = ({ breadcrumbs, metadata, content, childPages, id, previous, next, relatedArticles, relatedExternalLinks }) => {
    const [exampleLinks, setExampleLinks] = useState<IExampleLink[]>([]);
    const [activeExample, setActiveExample] = useState<IExampleLink | null>(null);
    const [tocLinks, setTocLinks] = useState<ITableOfContentsItem[]>([]);
    const [activeTOCItem, setActiveTOCItem] = useState<ITableOfContentsItem | null>(null);

    const tocLevel = typeof metadata.tocLevels === "number" ? metadata.tocLevels : 3;

    const markdownRef = useRef<HTMLDivElement>();

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
        markdownRef?.current?.scrollTo({ behavior: "auto", top: 0, left: 0 });
        setTimeout(() => {
            markdownRef?.current?.scrollTo({ behavior: "auto", top: 0, left: 0 });
        }, 100);
        return () => {
            clearExampleLinks();
            setActiveExample(null);
            clearTOCItems();
        };
    }, [id]);

    useEffect(() => {
        if (!activeExample) {
            markdownRef?.current?.classList.add("closed");
            if (markdownRef?.current?.classList.contains("opened")) {
                markdownRef?.current?.classList.remove("opened");
                markdownRef?.current?.scrollTo({ behavior: "auto", top: markdownRef?.current?.scrollTop - 400, left: 0 });
            }
        } else if (markdownRef?.current?.classList.contains("closed")) {
            markdownRef?.current?.classList.remove("closed");
            markdownRef?.current?.classList.add("opened");
            markdownRef?.current?.scrollTo({ behavior: "auto", top: markdownRef?.current?.scrollTop + 400, left: 0 });
        }
    }, [activeExample]);

    const scrollToTop = () => {
        markdownRef?.current?.scrollTo({ behavior: "auto", top: 0, left: 0 });
    };

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
                            {tocLinks.length > 1 && !!tocLevel && (
                                <div className="toc-container">
                                    <TableOfContent tocItems={tocLinks} levels={tocLevel}></TableOfContent>
                                </div>
                            )}
                            {metadata.videoOverview && (
                                <>
                                    <h2>Video Overview</h2>
                                    {/* Assuming video overview is always youtube! Can be changed */}
                                    <MediaMarkdownComponent url={metadata.videoOverview} type="youtube"></MediaMarkdownComponent>
                                </>
                            )}
                            {renderedContent}
                            <BucketContent title="Further reading" childPages={relatedArticles} externalLinks={relatedExternalLinks}></BucketContent>
                            <BucketContent childPages={childPages}></BucketContent>
                        </div>
                        <div id="scroll-to-top">
                            <Tooltip title={`Scroll to top`} aria-label="Scroll to top">
                                <IconButton size="medium" onClick={scrollToTop}>
                                    <ExpandLessIcon></ExpandLessIcon>
                                </IconButton>
                            </Tooltip>
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
    const props = await getPageData(params.id, true);
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
    const paths = await getAvailableUrls();
    checkUnusedFiles(
        paths,
        getAllFiles(markdownDirectory).map((path) => path.replace(/\\/g, "/").replace("content/", "")),
    );
    // TODO solve this more elegantly.
    // This is done since index is not a part of this dynamic url mapping (next.js issue)
    paths.shift();
    return {
        paths,
        fallback: false,
    };
};
