import Head from "next/head";
// import styles from "./layout.module.css";
import Navbar from "react-bulma-components/src/components/navbar";
import Footer from "react-bulma-components/src/components/footer";
import Container from "react-bulma-components/src/components/container";
import Section from "react-bulma-components/src/components/section";
import Content from "react-bulma-components/src/components/content";
import Hero from "react-bulma-components/src/components/hero";
import Breadcrumb from "react-bulma-components/src/components/breadcrumb";

// import Link from "next/link";
import { FunctionComponent, PropsWithChildren } from "react";

export interface ILayoutProps {
    isMarkdown: boolean;
    // title?: string;
    // description?: string;
    // keywords?: string;
    metadata: MarkdownMetadata;
    id: string[];
    disableMetadataAugmentation?: boolean;
}

export const defaultSiteTitle = "Documentation page";
export const defaultDescription = "Babylon.js documentation page";
export const defaultKeywords = ["babylonjs", "documentation", "webgl"].join(", ");

// very temporary structure configuration
import structure from "../configuration/structure.json";
import { MarkdownMetadata } from "../lib/interfaces";

export const Layout: FunctionComponent<PropsWithChildren<ILayoutProps>> = ({ children, isMarkdown, metadata, id, disableMetadataAugmentation = false }) => {
    const { title, description, keywords, imageUrl } = disableMetadataAugmentation
        ? metadata
        : {
              title: `Babylon.js Docs | ${metadata.title}`,
              description: `${metadata.description}. This page is a part of Babylon.js documentation.`,
              keywords: `${metadata.keywords},${defaultKeywords}`,
              imageUrl: metadata.imageUrl || "defaultImageUrl",
          };
    return (
        <div className={/*styles.container*/ ""}>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <title>{title}</title>
                <meta property="og:image" content={imageUrl} />
                <meta name="og:title" content={title} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <Navbar color={"light"} fixed={"top"} active={false} transparent={false}>
                <Navbar.Brand>
                    <Navbar.Item renderAs="a" href="/">
                        <img src="/img/babylonjs_identity_color.svg" alt="Babylon.js documentation page" width="112" height="28" />
                    </Navbar.Item>
                    <Navbar.Burger />
                </Navbar.Brand>
                <Navbar.Menu>
                    <Navbar.Container>
                        {Object.keys(structure).map((key) => {
                            return (
                                <Navbar.Item key={key} dropdown hoverable href={`/${key}`}>
                                    <Navbar.Link>{key.replace(/_/g, " ")}</Navbar.Link>
                                    <Navbar.Dropdown>
                                        {Object.keys(structure[key]).map((secondary) => {
                                            return (
                                                <Navbar.Item key={secondary} href={`/${key}/${secondary}`}>
                                                    {secondary}
                                                </Navbar.Item>
                                            );
                                        })}
                                    </Navbar.Dropdown>
                                </Navbar.Item>
                            );
                        })}
                        <Navbar.Item href="#">API</Navbar.Item>
                    </Navbar.Container>
                    <Navbar.Container position="end">
                        <Navbar.Item>SEARCH?</Navbar.Item>
                    </Navbar.Container>
                </Navbar.Menu>
            </Navbar>
            <Section>
                <Container>
                    <Breadcrumb
                        items={id.map((section, idx) => {
                            return {
                                name: section,
                                url: `/${id.slice(0, idx + 1).join("/")}`,
                            };
                        })}
                    />
                    {children}
                </Container>
            </Section>
            <Hero>
                <Hero.Footer>
                    <Footer>
                        <Container>
                            <Content style={{ textAlign: "center" }}>
                                <p>Babylon.js documentation page (FOOTER)</p>
                            </Content>
                        </Container>
                    </Footer>
                </Hero.Footer>
            </Hero>
        </div>
    );
};

export default Layout;
