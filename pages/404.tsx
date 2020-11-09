import { createStyles, makeStyles, Theme, Typography, Link as MaterialLink } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import Layout from "../components/layout.component";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            padding: theme.spacing(2),
            width: "100%",
            "& h2": {
                marginBottom: 0,
                fontSize: 26,
            },
            [theme.breakpoints.up("md")]: {
                "& h2": {
                    fontSize: "2.827rem",
                },
            },
        },
        emptySearchContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            [theme.breakpoints.up("md")]: {
                padding: "0 200px",
            },
        },
    }),
);

export const NotFoundComponent = () => {
    const router = useRouter();
    const classes = useStyles();
    const searchTerm = router.asPath.split("/").join(" ").trim();
    const query = `/search?q=${searchTerm.replace(/ /g, '+')}`;
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
            <div className={classes.container}>
                <div className={classes.emptySearchContainer}>
                    <Typography component="h1" variant="h6">
                        Page Not found...
                    </Typography>
                    <span>
                        search instead for "
                        {
                            <Link href={query}>
                                <MaterialLink href={query}>
                                    {searchTerm}
                                </MaterialLink>
                            </Link>
                        }
                        "
                    </span>
                </div>
            </div>
        </Layout>
    );
};

export default NotFoundComponent;
