import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import GithubIcon from "@mui/icons-material/GitHub";
import { Box, IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import { FunctionComponent, useCallback, useEffect, useRef } from "react";

import { BucketContent } from "../../components/bucketContent.component";
import { InlineExampleComponent } from "../../components/contentComponents/inlineExample.component";
import { TableOfContent } from "../../components/contentComponents/tableOfContent.component";
import Layout from "../../components/layout.component";
import { MediaMarkdownComponent } from "../../components/markdownComponents/media.component";
import { VideoCollection } from "../../components/videoCollection.component";
import { IDocumentationPageProps } from "../../lib/content.interfaces";
import styles from "../../pages/documentationPage.module.scss";
import { DocumentationContextProvider } from "./DocumentationContext";
import { DocsExamplesPanel } from "./DocsExamplesProvider";
import { DocsMdxRenderer } from "./DocsMdxRenderer";
import { useDocsTableOfContents } from "./DocsTableOfContentsProvider";
import { useHashScroll } from "./useHashScroll";
import { useExamplePanel } from "./useExamplePanel";

const RedirectNotice: FunctionComponent<{ redirectTo: string }> = ({ redirectTo }) => {
    useEffect(() => {
        const timeout = window.setTimeout(() => {
            location.href = redirectTo;
        }, 5000);

        return () => window.clearTimeout(timeout);
    }, [redirectTo]);

    return (
        <Box sx={{ textAlign: "center", padding: "20px" }}>
            This page has moved to <br />
            <Link href={redirectTo}>{redirectTo}</Link>
            <br />
            You will be redirected shortly.
        </Box>
    );
};

const DocsPageContent: FunctionComponent<IDocumentationPageProps> = ({ breadcrumbs, metadata, mdxContent, childPages, id, previous, next, relatedArticles, relatedExternalLinks, gitHubUrl }) => {
    const markdownRef = useRef<HTMLDivElement>(null);
    const examples = useExamplePanel(markdownRef);
    const tableOfContents = useDocsTableOfContents();
    const tocLevel = typeof metadata.tocLevels === "number" ? metadata.tocLevels : 3;
    const { clearExampleLinks, setActiveExample } = examples;
    const { clearTOCItems } = tableOfContents;

    const resetPageState = useCallback(() => {
        clearExampleLinks();
        setActiveExample(null);
        clearTOCItems();
    }, [clearExampleLinks, clearTOCItems, setActiveExample]);

    const scrollToTop = useHashScroll(markdownRef, id, tableOfContents.tocLinks, resetPageState);

    const editOnGitHub = () => {
        window.open(gitHubUrl, "_blank");
    };

    return (
        <Layout breadcrumbs={breadcrumbs} previous={previous} next={next} metadata={metadata} id={id}>
            <DocumentationContextProvider examples={examples} tableOfContents={tableOfContents}>
                <div className={styles["documentation-container"]}>
                    <div className={styles["markdown-and-playground"]}>
                        <InlineExampleComponent {...examples.activeExample} />
                        <div ref={markdownRef} className={styles["markdown-container"]} id="markdown-container">
                            <h1>{metadata.title}</h1>
                            {tableOfContents.tocLinks.length > 1 && !!tocLevel && (
                                <div className={styles["toc-container"]}>
                                    <TableOfContent tocItems={tableOfContents.tocLinks} levels={tocLevel}></TableOfContent>
                                </div>
                            )}
                            {metadata.videoOverview && (
                                <>
                                    <h2>Video Overview</h2>
                                    <MediaMarkdownComponent url={metadata.videoOverview} type="youtube"></MediaMarkdownComponent>
                                </>
                            )}
                            <DocsMdxRenderer mdxContent={mdxContent} />
                            {metadata.videoContent && <VideoCollection videoLinks={metadata.videoContent}></VideoCollection>}
                            <BucketContent title="Further reading" childPages={relatedArticles} externalLinks={relatedExternalLinks}></BucketContent>
                            <BucketContent childPages={childPages}></BucketContent>
                            <div id="edit-on-github">
                                <Tooltip title={`Edit this page on GitHub`} aria-label="Edit this page on GitHub">
                                    <IconButton size="small" onClick={editOnGitHub}>
                                        <GithubIcon></GithubIcon>
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        <div id="scroll-to-top">
                            <Tooltip title={`Scroll to top`} aria-label="Scroll to top">
                                <IconButton size="medium" onClick={scrollToTop}>
                                    <ExpandLessIcon></ExpandLessIcon>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <DocsExamplesPanel exampleLinks={examples.exampleLinks} examplesCollapsed={examples.examplesCollapsed} setExamplesCollapsed={examples.setExamplesCollapsed} />
                </div>
            </DocumentationContextProvider>
        </Layout>
    );
};

export const DocsPage: FunctionComponent<IDocumentationPageProps> = (props) => {
    return props.redirectTo ? <RedirectNotice redirectTo={props.redirectTo} /> : <DocsPageContent {...props} />;
};

export default DocsPage;
