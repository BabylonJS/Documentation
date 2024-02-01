import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { GetStaticProps } from "next";
import Layout from "../../components/layout.component";
import { useRouter } from "next/dist/client/router";
import { Checkbox, FormControlLabel, FormGroup, InputAdornment, TextField, Theme, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { SearchResult } from "../../components/contentComponents/searchResult.component";

import SearchIcon from "@mui/icons-material/Search";
import { IDocumentSearchResult, IPlaygroundSearchResult, queryIndex } from "../../lib/frontendUtils/searchQuery.utils";
import { InlineExampleComponent } from "../../components/contentComponents/inlineExample.component";
import { ExamplesComponent } from "../../components/contentComponents/example.component";
import { IExampleLink } from "../../lib/content.interfaces";

import styles from "../documentationPage.module.scss";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        searchContainer: {
            padding: theme.spacing(2),
            width: "100%",
            "& h2": {
                marginBottom: 0,
                fontSize: 26,
            },
            [theme.breakpoints.up("md")]: {
                "& h2": {
                    fontSize: "1.4rem",
                },
                "& form": {
                    maxWidth: "50%",
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
            "& form": {
                width: "100%",
            },
        },
        resultsContainer: {
            display: "flex",
            flexWrap: "wrap",
        },
        resultContainer: {
            flex: 1,
            width: "50%",
        },
        itemsHovered: {
            overflow: "auto",
            transition: "max-height 0.2s",
            maxHeight: 200,
            height: "auto",
            paddingBottom: 16,
        },
        examplesContainer: {
            backgroundColor: theme.customPalette.examples.backgroundColor
        }
    }),
);
export const SearchResults: FunctionComponent<{}> = () => {
    const router = useRouter();
    const query = router.query.q as string || router.query.bjsq as string;
    const [results, setResults] = useState<IDocumentSearchResult[]>([]);
    const [pgResults, setPGResults] = useState<IPlaygroundSearchResult[]>([]);
    const [activeExample, setActiveExample] = useState<IExampleLink>();
    const [loading, setLoading] = useState<boolean>(false);
    const [apiOnly, setApiOnly] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const classes = useStyles();

    useEffect(() => {
        setResults([]);
        setPGResults([]);
        if (!query || query === "undefined") {
            return;
        }
        setSearchTerm(query);
        setLoading(true);
        queryIndex<IDocumentSearchResult>(query)
            .then((results) => {
                setResults(results);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
        queryIndex<IPlaygroundSearchResult>(query, "playgrounds")
            .then((results) => {
                // console.log('results');
                setPGResults(results);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [query]);

    const handleApiChange = (event: ChangeEvent<HTMLInputElement>) => {
        setApiOnly(event.target.checked);
    };

    const searchForm = (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                router.push("/search?q=" + searchTerm);
                return false;
            }}
            noValidate
            autoComplete="off"
        >
            <FormGroup row>
                <TextField
                    id="standard-search"
                    style={{ margin: 8, flex: 1 }}
                    placeholder="Search..."
                    variant="outlined"
                    value={searchTerm}
                    margin="dense"
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControlLabel control={<Checkbox checked={apiOnly} onChange={handleApiChange} name="apiOnly" color="primary" />} label="API Only" />
            </FormGroup>
        </form>
    );

    return (
        <Layout
            breadcrumbs={generateBreadcrumbs()}
            metadata={{
                title: "Search page",
                description: "Search page for Babylon.js documentation site",
                imageUrl: "",
                keywords: "search, documentation, query",
            }}
            id={["search"]}
        >
            <div className={classes.searchContainer}>
                <InlineExampleComponent {...activeExample} />
                {!results.length && !loading && (
                    <div className={classes.emptySearchContainer}>
                        <Typography component="h2" variant="h2" gutterBottom>
                            Search
                        </Typography>
                        {searchForm}
                    </div>
                )}
                {loading && (
                    <Typography component="h2" variant="h2">
                        Searching for {query}...
                    </Typography>
                )}
                {!!results.length && (
                    <div>
                        <div>
                            <Typography component="h2" variant="h2">
                                Search results for {query}
                            </Typography>
                            {searchForm}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {results
                                    .filter((res) => (apiOnly ? res.isApi : true))
                                    .map((res) => {
                                        return <SearchResult key={res.id} searchResult={res}></SearchResult>;
                                    })}
                            </div>
                        </div>
                        {pgResults.length !== 0 && (
                            <div className={[styles["examples-container"], classes.examplesContainer].join(" ")}>
                                TEST
                                <ExamplesComponent onExamplePressed={setActiveExample} examples={pgResults}></ExamplesComponent>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default SearchResults;

export const getStaticProps: GetStaticProps<{ [key: string]: any }, any> = async ({ params }) => {
    return { props: {} };
};

export const generateBreadcrumbs = () => {
    return [
        {
            name: "Search",
            url: "/search",
        },
    ];
};
