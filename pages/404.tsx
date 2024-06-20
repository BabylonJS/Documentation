import { Typography, Link as MaterialLink, Box, useTheme } from "@mui/material";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import Layout from "../components/layout.component";
import { FunctionComponent } from "react";

export const NotFoundComponent: FunctionComponent<{}> = () => {
    const router = useRouter();
    const theme = useTheme();
    const searchTerm = router.asPath.split("/").join(" ").trim();
    const query = `/search?q=${searchTerm.replace(/ /g, "+")}`;
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
