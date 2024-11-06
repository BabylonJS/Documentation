import GithubIcon from "@mui/icons-material/GitHub";
import Head from "next/head";
import LeftArrowIcon from "@mui/icons-material/FirstPage";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import RightArrowIcon from "@mui/icons-material/LastPage";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { AppBar, Drawer, alpha, Hidden, IconButton, InputBase, Toolbar, Tooltip, Typography } from "@mui/material";
import Box from "@mui/system/Box";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent, KeyboardEvent, MouseEvent, PropsWithChildren, useState } from "react";
import { generateMenuStructure } from "../lib/buildUtils/content.utils";
import { getImageUrl } from "../lib/frontendUtils/frontendTools";
import { IPageProps } from "../lib/content.interfaces";
import { SideMenu } from "./sideMenu.component";
import { useRouter } from "next/dist/client/router";
import { useContext } from "react";
import { ColorModeContext, BaseUrlContext } from "../pages/_app";

export const defaultKeywords = ["babylonjs", "documentation", "webgl", "engine"].join(", ");
// very temporary structure configuration

const menuStructure = generateMenuStructure();

// TODO default image for documents with no image

export const Layout: FunctionComponent<PropsWithChildren<IPageProps>> = ({ id, previous, next, children, metadata, breadcrumbs, disableMetadataAugmentation = false }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const handleDrawerToggle = (event: MouseEvent | KeyboardEvent) => {
        if (!mobileOpen || (event.target as HTMLElement).tagName === "SPAN" || (event.target as HTMLElement).tagName === "DIV") {
            setMobileOpen(!mobileOpen);
        }
    };
    const router = useRouter();
    const { title, description, keywords, imageUrl, robots } = disableMetadataAugmentation
        ? metadata
        : {
              title: `${metadata.title} | Babylon.js Documentation`,
              description: metadata.description,
              keywords: `${metadata.keywords},${defaultKeywords}`,
              imageUrl: getImageUrl(metadata.imageUrl),
              robots: metadata.robots || "index, follow",
          };

    const baseDomain = useContext(BaseUrlContext);
    const MenuStructure = <SideMenu items={menuStructure} selected={`/${id.join("/")}`}></SideMenu>;
    const indexOfQuery = router.asPath.indexOf("?");
    const url = baseDomain + (id.indexOf("search") !== -1 || id.indexOf("playground") !== -1 ? router.asPath : indexOfQuery !== -1 ? router.asPath.substring(0, indexOfQuery) : router.asPath);
    const setCanonical = id.indexOf("search") === -1 && id.indexOf("playground") === -1 && indexOfQuery !== -1;
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const defaultRobots = "index, follow";
    return (
        <Box
            sx={{
                flexGrow: 1,
                flexDirection: "column",
                height: "100%",
                [theme.breakpoints.up("md")]: {
                    display: "flex",
                },
            }}
        >
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
                <meta name="robots" content={robots} />
            </Head>
            <AppBar
                sx={{
                    zIndex: theme.zIndex.drawer + 1,
                    backgroundColor: `${theme.customPalette.header}`,
                    flex: "0 1",
                    position: "fixed",
                    display: "block",
                    [theme.breakpoints.up("md")]: {
                        position: "relative",
                    },
                }}
            >
                <Toolbar
                    sx={{
                        backgroundColor: `${theme.customPalette.header}`,
                        [theme.breakpoints.up("md")]: {
                            backgroundImage: "url(/img/babylonidentity.svg)",
                            backgroundRepeat: "no-repeat",
                        },
                    }}
                >
                    <Hidden mdUp implementation="css">
                        <IconButton edge="start" onClick={handleDrawerToggle} color="inherit" aria-label="open drawer">
                            <MenuIcon />
                        </IconButton>
                    </Hidden>
                    <Typography
                        sx={{
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
                        }}
                    >
                        <Link href={baseDomain + "/"}>
                            <span></span>
                        </Link>
                    </Typography>
                    <Box
                        sx={{
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
                        }}
                    >
                        <Box
                            sx={{
                                padding: theme.spacing(0, 2),
                                height: "100%",
                                position: "absolute",
                                pointerEvents: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <SearchIcon />
                        </Box>
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
                                sx={{
                                    color: "inherit !important",
                                    "& .MuiInputBase-root": {
                                        color: "inherit !important",
                                    },
                                    "& .MuiInputBase-input": {
                                        padding: theme.spacing(1, 1, 1, 0),
                                        // vertical padding + font size from searchIcon
                                        paddingLeft: `calc(1em + ${theme.spacing(4)}) !important`,
                                        transition: theme.transitions.create("width"),
                                        width: "100%",
                                        [theme.breakpoints.up("md")]: {
                                            width: "12ch !important",
                                            "&:focus": {
                                                width: "20ch !important",
                                            },
                                        },
                                    },
                                }}
                                inputProps={{ "aria-label": "search" }}
                            />
                        </form>
                    </Box>
                    <Link href="https://github.com/BabylonJS/Babylon.js" target={"_blank"} rel={"noopener"}>
                        <IconButton aria-label="Babylon.js Github" size="medium" color="inherit">
                            <GithubIcon />
                        </IconButton>
                    </Link>
                    <IconButton aria-label={"Toggle " + (theme.palette.mode === "dark" ? "light" : "dark") + " mode"} size="medium" color="inherit" onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
                <Box
                    sx={{
                        background: "#6E6259 0% 0% no-repeat padding-box",
                        display: "flex",
                        overflow: "hidden",
                        fontSize: 14,
                        [theme.breakpoints.up("md")]: {
                            paddingLeft: "300px",
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
                    }}
                >
                    <Link href={baseDomain + "/typedoc"}>API</Link>
                    {!!previous && (
                        <Link key="previousArticle" href={baseDomain + "/" + previous.id.join("/")}>
                            <Tooltip title={`Previous article: ${previous.metadata.title}`} aria-label="Previous article">
                                <LeftArrowIcon></LeftArrowIcon>
                            </Tooltip>
                        </Link>
                    )}
                    {!!next && (
                        <Link key="nextArticle" href={baseDomain + "/" + next.id.join("/")}>
                            <Tooltip title={`Next article: ${next.metadata.title}`} aria-label="Next article">
                                <RightArrowIcon></RightArrowIcon>
                            </Tooltip>
                        </Link>
                    )}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            margin: theme.spacing(1, 2),
                            "& span": {
                                marginRight: theme.spacing(1),
                            },
                        }}
                    >
                        {breadcrumbs.map((link, idx) => {
                            return (
                                <div key={`bc-${idx}`}>
                                    <span>
                                        <Link href={baseDomain + link.url}>{link.name}</Link>
                                    </span>
                                    <span>{idx !== breadcrumbs.length - 1 ? "|" : ""}</span>
                                </div>
                            );
                        })}
                    </Box>
                </Box>
            </AppBar>
            <Box
                sx={{
                    display: "flex",
                    overflow: "auto",
                    flex: 1,
                    [theme.breakpoints.up("md")]: {
                        pt: 0,
                    },
                    paddingTop: "100px",
                }}
            >
                <Box
                    component="nav"
                    sx={{
                        backgroundColor: theme.customPalette.sideMenu.backgroundColor,
                        display: "block",
                        // paddingBottom: "40px",
                        [theme.breakpoints.up("md")]: {
                            width: "300px",
                            flexShrink: 0,
                            "& > div": {
                                height: "100%",
                            },
                        },
                    }}
                    aria-label="mailbox folders"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden mdUp implementation="css">
                        <Drawer
                            // container={window.document.body}
                            variant="temporary"
                            anchor={theme.direction === "rtl" ? "right" : "left"}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            style={{ zIndex: 1500 }}
                            sx={{
                                "& .MuiDrawer-paper": {
                                    width: 300,
                                    [theme.breakpoints.up("md")]: {
                                        paddingBottom: 0,
                                        top: "unset",
                                        background: "unset",
                                    },
                                },
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            <Box
                                sx={{
                                    overflow: "auto",
                                    height: "100%",
                                    backgroundColor: theme.customPalette.sideMenu.backgroundColor,
                                    zIndex: 1500,
                                }}
                                onClick={handleDrawerToggle}
                                onKeyDown={handleDrawerToggle}
                            >
                                <Link href={baseDomain + "/"}>
                                    <img src={baseDomain + "/img/babylonidentity.svg"} alt="Babylon.js logo" width="200" height="60" />
                                </Link>
                                {MenuStructure}
                            </Box>
                        </Drawer>
                    </Hidden>
                    <Hidden mdDown implementation="css">
                        <Box
                            sx={{
                                overflow: "auto",
                                height: "100%",
                                backgroundColor: theme.customPalette.sideMenu.backgroundColor,
                                zIndex: 1500,
                            }}
                        >
                            {MenuStructure}
                        </Box>
                    </Hidden>
                </Box>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "100%",
                        [theme.breakpoints.up("md")]: {
                            width: `calc(100% - 300px)`,
                        },
                    }}
                >
                    <Box
                        sx={{
                            overflow: "auto",
                            flex: 1,
                            display: "flex",
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
