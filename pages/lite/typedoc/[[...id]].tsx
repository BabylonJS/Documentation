import { GetStaticPaths, GetStaticProps } from "next";

import { getAPIPageData, getTypeDocStaticPaths, hasTypeDocArtifacts } from "../../../lib/buildUtils/typedoc.utils";
import { getBabylonLiteMenuItems } from "../../../lib/babylonLiteDocs";
import { docsFlavors } from "../../../lib/docsFlavors";
import { createApiPage } from "../../typedoc/[[...id]]";

const baseLocation = "lite/typedoc";
const docsFlavor = docsFlavors.lite;

export default createApiPage(baseLocation, ["lite", "typedoc"]);

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const routeParams = params as { id?: string[] } | undefined;
    const id = routeParams?.id?.length ? routeParams.id : ["index"];
    const flavorMenuItems = await getBabylonLiteMenuItems();
    if (!hasTypeDocArtifacts(baseLocation)) {
        return {
            props: {
                id,
                cssArray: [],
                contentNode: `<div class="col-content"><h1>${docsFlavor.label} API</h1><p>Babylon Lite API documentation will appear here once the Babylon Lite repository is public.</p></div>`,
                breadcrumbs: [
                    { name: docsFlavor.label, url: docsFlavor.basePath },
                    { name: "API", url: docsFlavor.apiPath },
                ],
                metadata: {
                    title: `${docsFlavor.label} API`,
                    description: "Temporary placeholder for Babylon Lite API documentation.",
                    keywords: "babylon lite, api, typedoc",
                    imageUrl: "",
                    robots: "noindex, nofollow",
                },
                ...(flavorMenuItems ? { flavorMenuItems } : {}),
            },
        };
    }

    const content = await getAPIPageData(id, baseLocation);
    if (content.redirect) {
        return {
            props: {
                redirect: content.redirect,
                id,
            },
        };
    }
    return {
        props: {
            ...content,
            ...(flavorMenuItems ? { flavorMenuItems } : {}),
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = hasTypeDocArtifacts(baseLocation) ? getTypeDocStaticPaths(baseLocation) : [];
    paths.push({ params: { id: [] } });
    return {
        paths,
        fallback: false,
    };
};