import { Typography, Link as MaterialLink, Box, useTheme } from "@mui/material";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import Layout from "../components/layout.component";
import { FunctionComponent, useEffect, useState } from "react";

/**
 * Attempt to resolve an old-style BABYLON.* TypeDoc URL to the new
 * @babylonjs/* URL.  Returns null if the current path is not an old
 * TypeDoc link or if no match is found in the redirect map.
 */
function useLegacyTypedocRedirect(): string | null {
    const router = useRouter();
    const [redirect, setRedirect] = useState<string | null>(null);

    useEffect(() => {
        const path = router.asPath.split("?")[0].split("#")[0];
        // Match /typedoc/<kind>/BABYLON.<Name> or /typedoc/<kind>/BABYLON.GUI.<Name> etc.
        const match = path.match(/^\/typedoc\/(classes|interfaces|enums|functions|types|variables|modules)\/BABYLON\.(.+?)$/);
        if (!match) return;

        const kind = match[1];
        // "GUI.Button" → name is "Button"; "Scene" → name is "Scene"
        const rest = match[2];
        const lastDot = rest.lastIndexOf(".");
        const name = lastDot !== -1 ? rest.substring(lastDot + 1) : rest;

        fetch("/api-search/typedoc/legacy-redirects.json")
            .then((res) => (res.ok ? res.json() : null))
            .then((map: Record<string, string> | null) => {
                if (!map) return;
                const newUrl = map[`${kind}/${name}`];
                if (newUrl) {
                    const hash = window.location.hash || "";
                    setRedirect(newUrl + hash);
                }
            })
            .catch(() => {});
    }, [router.asPath]);

    useEffect(() => {
        if (redirect) {
            router.replace(redirect);
        }
    }, [redirect]);

    return redirect;
}

export const NotFoundComponent: FunctionComponent<{}> = () => {
    const router = useRouter();
    const theme = useTheme();
    const searchTerm = router.asPath.split("/").join(" ").trim();
    const query = `/search?q=${searchTerm.replace(/ /g, "+")}`;
    const legacyRedirect = useLegacyTypedocRedirect();

    if (legacyRedirect) {
        return (
            <Layout breadcrumbs={[]} metadata={{ title: "Redirecting…", description: "", imageUrl: "", keywords: "" }} id={["redirect"]}>
                <Box sx={{ padding: theme.spacing(4), textAlign: "center" }}>
                    <Typography variant="body1">Redirecting to the new API documentation…</Typography>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout
            breadcrumbs={[]}
            metadata={{
                title: "Not found",
                description: "",
                imageUrl: "",
                keywords: "",
            }}
            id={["notFOund"]}
        >
            <Box
                sx={{
                    padding: theme.spacing(2),
                    width: "100%",
                    "& h2": {
                        marginBottom: 0,
                        fontSize: "26px",
                    },
                    [theme.breakpoints.up("md")]: {
                        "& h2": {
                            fontSize: "2.827rem",
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        [theme.breakpoints.up("md")]: {
                            padding: "0 200px",
                        },
                    }}
                >
                    <Typography component="h1" variant="h6">
                        Page Not found...
                    </Typography>
                    <span>
                        search instead for "
                        {
                            <Link href={query}>
                                <MaterialLink href={query}>{searchTerm}</MaterialLink>
                            </Link>
                        }
                        "
                    </span>
                </Box>
            </Box>
        </Layout>
    );
};

export default NotFoundComponent;
