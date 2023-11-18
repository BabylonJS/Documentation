import { Theme, Typography, Link as MaterialLink } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import Layout from "../components/layout.component";
import { FunctionComponent } from "react";

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
export interface NotFoundComponentProps {
    isDarkMode: boolean;
    handleDarkMode: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const NotFoundComponent: FunctionComponent<NotFoundComponentProps> = ({ isDarkMode, handleDarkMode }) => {
    const router = useRouter();
    const classes = useStyles();
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
            isDarkMode={isDarkMode}
            handleDarkMode={handleDarkMode}
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
                                <MaterialLink href={query}>{searchTerm}</MaterialLink>
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
