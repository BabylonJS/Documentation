import GithubIcon from "@mui/icons-material/GitHub";
import Head from "next/head";
import LeftArrowIcon from "@mui/icons-material/FirstPage";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import RightArrowIcon from "@mui/icons-material/LastPage";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AppBar, Drawer, alpha, Hidden, IconButton, InputBase, Theme, Toolbar, Tooltip, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent, KeyboardEvent, MouseEvent, PropsWithChildren, useState } from "react";
import { generateMenuStructure } from "../lib/buildUtils/content.utils";
import { getImageUrl } from "../lib/frontendUtils/frontendTools";
import { IPageProps } from "../lib/content.interfaces";
import { SideMenu } from "./sideMenu.component";
import { useRouter } from "next/dist/client/router";
import { useContext } from "react"
import { ColorModeContext } from "../pages/_app";

export const defaultKeywords = ["babylonjs", "documentation", "webgl", "engine"].join(", ");

// very temporary structure configuration

const menuStructure = generateMenuStructure();

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            flexDirection: "column",
            height: "100%",
            [theme.breakpoints.up("md")]: {
                display: "flex",
            },
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: `${theme.customPalette.header}`,
            flex: "0 1",
            position: "fixed",
            display: "block",
            [theme.breakpoints.up("md")]: {
                position: "relative",
            },
        },
        appBarToolbar: {
            backgroundColor: `${theme.customPalette.header}`,
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
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
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
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
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
            backgroundColor: theme.customPalette.sideMenu.backgroundColor,
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
                width: `calc(100% - 300px)`,
            },
        },
        contentContainer: {
            overflow: "auto",
            flex: 1,
            display: "flex",
        },
        navAndContentContainer: {
            display: "flex",
            overflow: "auto",
            flex: 1,
            paddingTop: "100px",
            [theme.breakpoints.up("md")]: {
                paddingTop: 0,
            },
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
    const indexOfQuery = router.asPath.indexOf("?");
    const url = baseDomain + (id.indexOf("search") !== -1 || id.indexOf("playground") !== -1 ? router.asPath : indexOfQuery !== -1 ? router.asPath.substring(0, indexOfQuery) : router.asPath);
    const setCanonical = id.indexOf("search") === -1 && id.indexOf("playground") === -1 && indexOfQuery !== -1;
    const theme = useTheme()
    const colorMode = useContext(ColorModeContext);
    return (
        <div className={classes.root}>
            <Head>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <title>{title}</title>
                {imageUrl && <meta property="og:image" content={baseDomain + imageUrl} />}
                <meta name="og:title" content={title} />
                <meta name="og:url" content={url} />
                <meta name="og:description" content={description.substr(0, 150)} />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.css" integrity="sha384-IKOookmJ6jaAbJnGdgrLG5MDmzxJmjkIm6XCFqxnhzuMbfkEhGQalwVq2sYnGyZM" crossOrigin="anonymous" />
                {!!previous && <link rel="prev" href={baseDomain + "/" + previous.id.join("/")} />}
                {!!next && <link rel="next" href={baseDomain + "/" + next.id.join("/")} />}
                {setCanonical && <link rel="canonical" href={url} />}
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
                    <Link href="https://github.com/BabylonJS/Babylon.js" target={"_blank"} rel={"noopener"}>
                        <IconButton aria-label="Babylon.js Github" size="medium" color="inherit">
                            <GithubIcon></GithubIcon>
                        </IconButton>
                    </Link>
                    <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
                <div className={classes.navContainer}>
                    <Link href="/typedoc">API</Link>
                    {!!previous && (
                        <Link key="previousArticle" href={"/" + previous.id.join("/")}>
                            <Tooltip title={`Previous article: ${previous.metadata.title}`} aria-label="Previous article">
                                <LeftArrowIcon></LeftArrowIcon>
                            </Tooltip>
                        </Link>
                    )}
                    {!!next && (
                        <Link key="nextArticle" href={"/" + next.id.join("/")}>
                            <Tooltip title={`Next article: ${next.metadata.title}`} aria-label="Next article">
                                <RightArrowIcon></RightArrowIcon>
                            </Tooltip>
                        </Link>
                    )}
                    <div className={classes.breadcrumbsContainer}>
                        {breadcrumbs.map((link, idx) => {
                            return (
                                <div key={`bc-${idx}`}>
                                    <span>
                                        <Link href={link.url}>{link.name}</Link>
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
                                <Link href="/">
                                    <img src="/img/babylonidentity.svg" alt="Babylon.js logo" width="200" height="60" />
                                </Link>
                                {MenuStructure}
                            </div>
                        </Drawer>
                    </Hidden>
                    <Hidden mdDown implementation="css">
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
