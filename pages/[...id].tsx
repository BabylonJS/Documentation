import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { FunctionComponent } from "react";

import Layout from "../components/layout.component";
import { getAllDocumentationIds, getPageData } from "../lib/page.utils";

import "./documentationPage.style.scss";
import { parseMDFile } from "../lib/unified.plugins";

// testing lib instead of src (documentation states to use the src)
import Card from "react-bulma-components/lib/components/card";
import Media from "react-bulma-components/src/components/media";
import Image from "react-bulma-components/src/components/image";
import Columns from "react-bulma-components/src/components/columns";
import Heading from "react-bulma-components/src/components/heading";
import { MarkdownMetadata } from "../lib/interfaces";

export interface IDocumentationPageProps {
    metadata: MarkdownMetadata;
    content?: string;
    // this interface should actually contain a lot more than a single string
    childPages?: {
        [key: string]: {
            metadata?: MarkdownMetadata;
            link: string;
            isBucket: boolean;
        };
    };
    id: string[];
}
export const DocumentationPage: FunctionComponent<IDocumentationPageProps> = ({ metadata, content, childPages, id }) => {
    return (
        <Layout isMarkdown={true} metadata={metadata} id={id}>
            <Columns breakpoint="tablet">
                {childPages &&
                    Object.keys(childPages).map((child) => {
                        const childData = childPages[child].metadata;
                        const link = childPages[child].link.replace('.md', '');
                        return (
                            <Columns.Column
                                tablet={{
                                    size: "half",
                                }}
                                desktop={{
                                    size: "half",
                                }}
                                widescreen={{
                                    size: "one-third",
                                }}
                                fullhd={{
                                    size: "one-quarter",
                                }}
                                key={child}
                            >
                                <Link href={link}>
                                    <Card className="document-card">
                                        {/* <Card.Image size="4by3" src="http://bulma.io/images/placeholders/1280x960.png" /> */}
                                        <Card.Content>
                                            <Media>
                                                <Media.Item renderAs="figure" position="left">
                                                    <Image size={64} alt={childData.title} src={childData.imageUrl || "http://bulma.io/images/placeholders/128x128.png"} />
                                                </Media.Item>
                                                <Media.Item>
                                                    <Heading size={4}>{childData.title}</Heading>
                                                    <Heading subtitle size={6}>
                                                        {childData.description}
                                                    </Heading>
                                                </Media.Item>
                                            </Media>
                                            {/* <Content>This is the description of this file, will be taken from the metadata</Content> */}
                                        </Card.Content>
                                    </Card>
                                </Link>
                            </Columns.Column>
                        );
                    })}
            </Columns>
            {content && <div className="markdown-container">{parseMDFile(content).result}</div>}
        </Layout>
    );
};

export default DocumentationPage;

export interface IDocumentationParsedUrlQuery extends ParsedUrlQuery {
    id: string[];
}

export const getStaticProps: GetStaticProps<{ [key: string]: any }, IDocumentationParsedUrlQuery> = async ({ params }) => {
    const props = await getPageData(params.id);
    return {
        props,
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllDocumentationIds();
    return {
        paths,
        fallback: false,
    };
};
