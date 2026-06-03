import { GetStaticPaths, GetStaticProps } from "next";
import { FunctionComponent } from "react";
import { Box, Typography, useTheme } from "@mui/material";

import Layout from "../../../components/layout.component";
import { docsFlavors } from "../../../lib/docsFlavors";

const docsFlavor = docsFlavors.lite;

const BabylonLiteApiPlaceholder: FunctionComponent = () => {
    const theme = useTheme();

    return (
        <Layout
            breadcrumbs={[
                {
                    name: docsFlavor.label,
                    url: docsFlavor.basePath,
                },
                {
                    name: "API",
                    url: docsFlavor.apiPath,
                },
            ]}
            metadata={{
                title: `${docsFlavor.label} API`,
                description: "Temporary placeholder for Babylon Lite API documentation.",
                keywords: "babylon lite, api, typedoc",
                imageUrl: "",
                robots: "noindex, nofollow",
            }}
            id={["lite", "typedoc"]}
        >
            <Box
                sx={{
                    flex: 1,
                    padding: theme.spacing(3),
                    maxWidth: 920,
                }}
            >
                <Typography component="h1" variant="h4" gutterBottom>
                    {docsFlavor.label} API
                </Typography>
                <Typography>
                    Babylon Lite API documentation will appear here once the TypeDoc source repository is ready to publish.
                </Typography>
            </Box>
        </Layout>
    );
};

export default BabylonLiteApiPlaceholder;

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: [{ params: { id: [] } }],
    fallback: false,
});