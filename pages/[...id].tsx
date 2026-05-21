import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";

import { DocsPage } from "../features/docs/DocsPage";
import { getRedirect, getRedirects, isRedirect } from "../lib/buildUtils/redirects";
import { getPageData } from "../lib/buildUtils/tools";
import { compileMarkdown } from "../lib/markdown/compileMarkdown";

export const DocumentationPage = DocsPage;

export default DocumentationPage;

export interface IDocumentationParsedUrlQuery extends ParsedUrlQuery {
    id: string[];
    redirectTo?: string;
}

export const getStaticProps: GetStaticProps<{ [key: string]: any }, IDocumentationParsedUrlQuery> = async ({ params }) => {
    if (isRedirect(params!.id)) {
        return {
            props: {
                id: params!.id,
                redirectTo: getRedirect(params!.id),
            },
        };
    }

    const props = await getPageData(params!.id, true);
    props.mdxContent = await compileMarkdown(props.content ?? "");
    return {
        props,
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const { getContentGraph } = await import("../lib/contentGraph/buildContentGraph");
    const paths = [...getContentGraph().routeManifest];

    const redirects = getRedirects();
    // This is done since index is not a part of this dynamic URL mapping.
    paths.shift();
    return {
        paths: [...paths, ...redirects],
        fallback: false,
    };
};
