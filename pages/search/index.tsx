import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { GetStaticProps } from "next";
import Layout from "../../components/layout.component";
import { useRouter } from "next/dist/client/router";
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputAdornment, TextField, Typography, useTheme } from "@mui/material";
import { SearchResult } from "../../components/contentComponents/searchResult.component";

import SearchIcon from "@mui/icons-material/Search";
import { IDocumentSearchResult, IPlaygroundSearchResult, queryIndex } from "../../lib/frontendUtils/searchQuery.utils";
import { InlineExampleComponent } from "../../components/contentComponents/inlineExample.component";
import { ExamplesComponent } from "../../components/contentComponents/example.component";
import { IExampleLink } from "../../lib/content.interfaces";

import styles from "../documentationPage.module.scss";

export const SearchResults: FunctionComponent<{}> = () => {
    const router = useRouter();
    const query = (router.query.q as string) || (router.query.bjsq as string);
    const [results, setResults] = useState<IDocumentSearchResult[]>([]);
    const [pgResults, setPGResults] = useState<IPlaygroundSearchResult[]>([]);
    const [activeExample, setActiveExample] = useState<IExampleLink | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [apiOnly, setApiOnly] = useState<boolean>(false);
    const [filterApi, setFilterApi] = useState<boolean>(false);
    const [noResults, setNoResults] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const theme = useTheme();

    useEffect(() => {
        setResults([]);
        setPGResults([]);
        setActiveExample(null);
        if (!query || query === "undefined") {
            return;
        }
        setSearchTerm(query);
        setLoading(true);
        setNoResults(false);
        queryIndex<IDocumentSearchResult>(query)
            .then((results) => {
                setResults(results);
                if (results.length === 0) {
                    setNoResults(true);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
        queryIndex<IPlaygroundSearchResult>(query, "playgrounds")
            .then((results) => {
                setPGResults(results);
            })
            .catch(() => {});
    }, [query]);

    const handleApiOnly = (event: ChangeEvent<HTMLInputElement>) => {
        setApiOnly(event.target.checked);
        setFilterApi(false);
    };

    const handleFilterApi = (event: ChangeEvent<HTMLInputElement>) => {
        setFilterApi(event.target.checked);
        setApiOnly(false);
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
                <FormControlLabel control={<Checkbox checked={apiOnly} onChange={handleApiOnly} name="apiOnly" color="primary" />} label="API Only" />
                <FormControlLabel control={<Checkbox checked={filterApi} onChange={handleFilterApi} name="filterApi" color="primary" />} label="Filter API" />
                <FormControl margin="dense" variant="outlined">
                    <Button sx={{
                        margin: 1,
                    }} type="submit" variant="contained">
                        Search
                    </Button>
                </FormControl>
            </FormGroup>
        </form>
    );

    return (
        <Layout
            breadcrumbs={generateBreadcrumbs()}
            metadata={{
                title: query ? "Search results: " + query : "Search Page",
                description: "Search page for Babylon.js documentation site. Search for documents and code examples",
                imageUrl: "",
                keywords: "search, documentation, query, examples, playground",
                robots: query || results.length ? "noindex, nofollow" : "index, follow",
            }}
            id={["search"]}
        >
            <>
                {!results.length && !loading && (
                    <Box
                        sx={{
                            display: "flex",
                            flex: 1,
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
                        }}
                    >
                        <Typography
                            sx={{
                                marginBottom: 0,
                                fontSize: 26,
                                [theme.breakpoints.up("md")]: {
                                    fontSize: "1.4rem",
                                },
                            }}
                            component="h2"
                            variant="h2"
                            gutterBottom
                        >
                            Search
                        </Typography>
                        {searchForm}
                        {noResults && (
                            <Typography
                                sx={{
                                    marginBottom: 0,
                                    fontSize: 26,
                                    [theme.breakpoints.up("md")]: {
                                        fontSize: "1.4rem",
                                    },
                                }}
                                component="h2"
                                variant="h2"
                                gutterBottom
                            >
                                No results found for {query}
                            </Typography>
                        )}
                    </Box>
                )}
                {(results.length || loading) && (
                    <Box
                        sx={{
                            display: "flex",
                            flex: 1,
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                overflow: "auto",
                                padding: theme.spacing(2),
                                position: "relative",
                                width: "100%",
                                [theme.breakpoints.up("lg")]: {
                                    "& form": {
                                        maxWidth: "70%",
                                    },
                                },
                            }}
                        >
                            {loading && (
                                <Typography
                                    sx={{
                                        marginBottom: 0,
                                        fontSize: 26,
                                        [theme.breakpoints.up("md")]: {
                                            fontSize: "1.4rem",
                                        },
                                    }}
                                    component="h2"
                                    variant="h2"
                                >
                                    Searching for {query}...
                                </Typography>
                            )}
                            {!!results.length && (
                                <>
                                    <InlineExampleComponent {...activeExample} />
                                    <Typography
                                        sx={{
                                            marginBottom: 0,
                                            fontSize: 26,
                                            [theme.breakpoints.up("md")]: {
                                                fontSize: "1.4rem",
                                            },
                                        }}
                                        component="h2"
                                        variant="h2"
                                    >
                                        Search results for {query}
                                    </Typography>
                                    {searchForm}
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        {results
                                            .filter((res) => (apiOnly ? res.isApi : filterApi ? !res.isApi : true))
                                            .map((res) => {
                                                return <SearchResult key={res.id} searchResult={res}></SearchResult>;
                                            })}
                                    </div>
                                </>
                            )}
                        </Box>
                        {pgResults.length !== 0 && (
                            <Box
                                sx={{
                                    backgroundColor: theme.customPalette.examples.backgroundColor,
                                }}
                                className={[styles["examples-container"]].join(" ")}
                            >
                                <ExamplesComponent title="Related examples" onExamplePressed={setActiveExample} examples={pgResults}></ExamplesComponent>
                            </Box>
                        )}
                    </Box>
                )}
            </>
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
