import Head from "next/head";
// import styles from "./layout.module.css";
import Navbar from "react-bulma-components/src/components/navbar";
import Footer from "react-bulma-components/src/components/footer";
import Container from "react-bulma-components/src/components/container";
import Section from "react-bulma-components/src/components/section";
import Content from "react-bulma-components/src/components/content";
import Hero from "react-bulma-components/src/components/hero";
import Breadcrumb from "react-bulma-components/src/components/breadcrumb";
import Level from "react-bulma-components/src/components/level";
import Columns from "react-bulma-components/src/components/columns";
import Button from "react-bulma-components/src/components/button";
import Box from "react-bulma-components/src/components/box";

// import Link from "next/link";
import { FunctionComponent, PropsWithChildren } from "react";

export const defaultSiteTitle = "Documentation page";
export const defaultDescription = "Babylon.js documentation page";
export const defaultKeywords = ["babylonjs", "documentation", "webgl"].join(", ");

// very temporary structure configuration
import { IPageProps } from "../lib/content.interfaces";
import Link from "next/link";
import { generateMenuStructure } from "../lib/buildUtils/content.utils";
import { SideMenu } from "./sideMenu.component";

const menuStructure = generateMenuStructure();

export const Layout: FunctionComponent<PropsWithChildren<IPageProps>> = ({ id, previous, next, children, metadata, breadcrumbs, disableMetadataAugmentation = false }) => {
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
                <meta name="og:description" content={description} />
                <meta name="twitter:card" content="summary_large_image" />
                {previous && <link rel="prev" href={previous.id.join("/")} />}
                {next && <link rel="next" href={next.id.join("/")} />}
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
                        {/* {menuStructure.map((menuItem) => {
                            return (
                                <Navbar.Item key={menuItem.url} dropdown hoverable href={menuItem.url}>
                                    <Navbar.Link>{menuItem.name}</Navbar.Link>
                                    <Navbar.Dropdown>
                                        {menuItem.children.map((secondary) => {
                                            return (
                                                <Navbar.Item key={secondary.url} href={secondary.url}>
                                                    {secondary.name}
                                                </Navbar.Item>
                                            );
                                        })}
                                    </Navbar.Dropdown>
                                </Navbar.Item>
                            );
                        })} */}
                        <Navbar.Item href="/typedoc">API</Navbar.Item>
                    </Navbar.Container>
                    <Navbar.Container position="end">
                        <Navbar.Item>SEARCH?</Navbar.Item>
                    </Navbar.Container>
                </Navbar.Menu>
            </Navbar>
            <Section>
                <Columns>
                    <Columns.Column
                        tablet={{
                            size: "half",
                        }}
                        desktop={{
                            size: "one-third",
                        }}
                        widescreen={{
                            size: "one-quarter",
                        }}
                        fullhd={{
                            size: "one-fifth",
                        }}
                    >
                        <SideMenu items={menuStructure} selected={`/${id.join("/")}`}></SideMenu>
                    </Columns.Column>
                    <Columns.Column
                    tablet={{
                        size: "half",
                    }}
                    desktop={{
                        size: "two-thirds",
                    }}
                    widescreen={{
                        size: "three-quarters",
                    }}
                    fullhd={{
                        size: "four-fifths",
                    }}>
                        {/* <Container> */}
                            <Box>
                                <Level renderAs="nav">
                                    <Level.Side align="left">
                                        <Level.Item>
                                            {previous && (
                                                <Link href={previous.id.join("/")}>
                                                    <a className="button is-primary" title={previous.metadata.title}>
                                                        Previous
                                                    </a>
                                                </Link>
                                            )}
                                        </Level.Item>
                                        <Level.Item>
                                            <Breadcrumb items={breadcrumbs} />
                                        </Level.Item>
                                        <Level.Item>{/* <Heading size={5} subtitle>
                                        {metadata.title}
                                    </Heading> */}</Level.Item>
                                    </Level.Side>

                                    <Level.Side align="right">
                                        <Level.Item>
                                            {next && (
                                                <Link href={next.id.join("/")}>
                                                    <a className="button is-primary" title={next.metadata.title}>
                                                        Next
                                                    </a>
                                                </Link>
                                            )}
                                        </Level.Item>
                                    </Level.Side>
                                </Level>
                            </Box>
                            {children}
                        {/* </Container> */}
                    </Columns.Column>
                </Columns>

                <Button style={{ display: "none" }} />
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
