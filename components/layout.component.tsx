import GithubIcon from "@material-ui/icons/GitHub";
import Head from "next/head";
import LeftArrowIcon from "@material-ui/icons/FirstPage";
import Link from "next/link";
import MenuIcon from "@material-ui/icons/Menu";
import RightArrowIcon from "@material-ui/icons/LastPage";
import SearchIcon from "@material-ui/icons/Search";
import { AppBar, createStyles, Drawer, fade, Hidden, IconButton, InputBase, makeStyles, Theme, Toolbar, Tooltip, Typography } from "@material-ui/core";
import { colorPalette, theme } from "../styles/theme";
import { FunctionComponent, KeyboardEvent, MouseEvent, PropsWithChildren, useState } from "react";
import { generateMenuStructure } from "../lib/buildUtils/content.utils";
import { getImageUrl } from "../lib/frontendUtils/frontendTools";
import { IPageProps } from "../lib/content.interfaces";
import { SideMenu } from "./sideMenu.component";
import { useRouter } from "next/dist/client/router";

export const defaultKeywords = ["babylonjs", "documentation", "webgl", "engine"].join(", ");

// very temporary structure configuration

const menuStructure = generateMenuStructure();

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: `${colorPalette.header}`,
            flex: "0 1",
            position: "relative",
            display: 'block',
        },
        appBarToolbar: {
            backgroundColor: `${colorPalette.header}`,
            [theme.breakpoints.up("md")]: {
                backgroundImage: "url(/img/babylonidentity.svg)",
                backgroundRepeat: "no-repeat",
            },
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up("md")]: {
                display: "none",
            },
        },
        title: {
            flexGrow: 1,
            display: "none",
            [theme.breakpoints.up("md")]: {
                display: "block",
            },
            "& span": {
                display: "inline-block",
                width: 170,
                height: 40,
                marginLeft: 20,
                cursor: "pointer",
            },
        },
        search: {
            position: "relative",
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            "&:hover": {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: "100%",
            [theme.breakpoints.up("md")]: {
                marginLeft: theme.spacing(1),
                width: "auto",
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: "100%",
            position: "absolute",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        inputRoot: {
            color: "inherit",
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create("width"),
            width: "100%",
            [theme.breakpoints.up("md")]: {
                width: "12ch",
                "&:focus": {
                    width: "20ch",
                },
            },
        },
        drawer: {
            backgroundColor: `${colorPalette.sidebarBackground}`,
            display: "block",
            paddingBottom: 40,
            [theme.breakpoints.up("md")]: {
                width: 300,
                flexShrink: 0,
                "& > div": {
                    height: "100%",
                },
            },
        },
        drawerContainer: {
            overflow: "auto",
            height: "100%",
        },
        // toolbar: theme.mixins.toolbar,
        drawerPaper: {
            width: 300,
            paddingBottom: 40,
            [theme.breakpoints.up("md")]: {
                paddingBottom: 0,
                top: "unset",
                background: "unset",
            },
        },
        content: {
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            [theme.breakpoints.up("md")]: {
                width: `calc(100% - ${300}px)`,
            },
        },
        contentContainer: {
            overflow: "auto",
            // padding: theme.spacing(2),
            flex: 1,
            display: "flex",
        },
        navAndContentContainer: {
            display: "flex",
            overflow: "auto",
            flex: 1,
        },
        navContainer: {
            background: "#6E6259 0% 0% no-repeat padding-box",
            display: "flex",
            overflow: "hidden",
            fontSize: 14,
            [theme.breakpoints.up("md")]: {
                paddingLeft: 300,
            },
            "& > a": {
                padding: theme.spacing(1),
                borderRight: "1px solid #707070",
                display: "flex",
                alignItems: "center",
            },
            "& > a:first-child": {
                padding: theme.spacing(1, 2),
                borderRight: "1px solid #707070",
                borderLeft: "1px solid #707070",
            },
            "& > a.linkNoBorder": {
                borderRight: "unset",
            },
        },
        breadcrumbsContainer: {
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            margin: theme.spacing(1, 2),
            "& span": {
                marginRight: theme.spacing(1),
            },
        },
    }),
);

// TODO default image for documents with no image

export const Layout: FunctionComponent<PropsWithChildren<IPageProps>> = ({ id, previous, next, children, metadata, breadcrumbs, disableMetadataAugmentation = false }) => {
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const handleDrawerToggle = (event: MouseEvent | KeyboardEvent) => {
        if (!mobileOpen || (event.target as HTMLElement).tagName === "SPAN" || (event.target as HTMLElement).tagName === "DIV") {
            setMobileOpen(!mobileOpen);
        }
    };
    const router = useRouter();
    const baseDomain = "https://doc.babylonjs.com";
    const { title, description, keywords, imageUrl } = disableMetadataAugmentation
        ? metadata
        : {
              title: `${metadata.title} | Babylon.js Documentation`,
              description: metadata.description,
              keywords: `${metadata.keywords},${defaultKeywords}`,
              imageUrl: getImageUrl(metadata.imageUrl),
          };

    const MenuStructure = <SideMenu items={menuStructure} selected={`/${id.join("/")}`}></SideMenu>;
    return (
        <div className={classes.root}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <title>{title}</title>
                {imageUrl && <meta property="og:image" content={baseDomain + imageUrl} />}
                <meta name="og:title" content={title} />
                <meta name="og:url" content={baseDomain + "/" + router.asPath} />
                <meta name="og:description" content={description.substr(0, 150)} />
                <meta name="twitter:card" content="summary_large_image" />
                {!!previous && <link rel="prev" href={baseDomain + "/" + previous.id.join("/")} />}
                {!!next && <link rel="next" href={baseDomain + "/" + next.id.join("/")} />}
            </Head>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.appBarToolbar}>
                    <Hidden mdUp implementation="css">
                        <IconButton edge="start" onClick={handleDrawerToggle} color="inherit" aria-label="open drawer">
                            <MenuIcon />
                        </IconButton>
                    </Hidden>
                    <Typography className={classes.title}>
                        <Link href="/">
                            <span></span>
                        </Link>
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.push("/search?q=" + searchTerm);
                                return false;
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <InputBase
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                }}
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ "aria-label": "search" }}
                            />
                        </form>
                    </div>
                    <Link href="https://github.com/BabylonJS/Babylon.js">
                        <a target="_blank">
                            <IconButton aria-label="Babylon.js Github" size="medium" color="inherit">
                                <GithubIcon></GithubIcon>
                            </IconButton>
                        </a>
                    </Link>
                </Toolbar>
                <div className={classes.navContainer}>
                    <Link href="/typedoc">
                        <a>API</a>
                    </Link>
                    {!!previous && (
                        <Link key="previousArticle" href={"/" + previous.id.join("/")}>
                            <a>
                                <Tooltip title={`Previous article: ${previous.metadata.title}`} aria-label="Previous article">
                                    <LeftArrowIcon></LeftArrowIcon>
                                </Tooltip>
                            </a>
                        </Link>
                    )}
                    {!!next && (
                        <Link key="nextArticle" href={"/" + next.id.join("/")}>
                            <a>
                                <Tooltip title={`Next article: ${next.metadata.title}`} aria-label="Next article">
                                    <RightArrowIcon></RightArrowIcon>
                                </Tooltip>
                            </a>
                        </Link>
                    )}
                    <div className={classes.breadcrumbsContainer}>
                        {breadcrumbs.map((link, idx) => {
                            return (
                                <div key={`bc-${idx}`}>
                                    <span>
                                        <Link href={link.url}>
                                            <a>{link.name}</a>
                                        </Link>
                                    </span>
                                    <span>{idx !== breadcrumbs.length - 1 ? "|" : ""}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </AppBar>
            <div className={classes.navAndContentContainer}>
                <nav className={classes.drawer} aria-label="mailbox folders">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden mdUp implementation="css">
                        <Drawer
                            // container={window.document.body}
                            variant="temporary"
                            anchor={theme.direction === "rtl" ? "right" : "left"}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            <div onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle} className={classes.drawerContainer}>
                                <img src="/img/babylonidentity.svg" alt="Babylon.js logo" width="200" height="60" />
                                {MenuStructure}
                            </div>
                        </Drawer>
                    </Hidden>
                    <Hidden smDown implementation="css">
                        <div className={classes.drawerContainer}>{MenuStructure}</div>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <div className={classes.contentContainer}>{children}</div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
