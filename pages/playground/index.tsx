import Layout from "../../components/layout.component";
import SearchIcon from "@mui/icons-material/Search";
import { Button, CircularProgress, FormControl, FormGroup, InputAdornment, InputLabel, Select, TextField, Theme, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { ChangeEvent, FunctionComponent, useEffect, useRef, useState } from "react";
import { GetStaticProps } from "next";
import { IPlaygroundSearchResult, PlaygroundSearchResult, SearchType } from "../../components/contentComponents/playgroundSearchResult";
import { useRouter } from "next/dist/client/router";
import { IExampleLink } from "../../lib/content.interfaces";
import { InlineExampleComponent } from "../../components/contentComponents/inlineExample.component";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        flexContainer: {
            display: "flex",
            flex: 1,
            flexDirection: "column",
            width: "100%",
        },
        searchContainer: {
            flex: 1,
            overflow: "auto",
            padding: theme.spacing(2),
            position: "relative",
            width: "100%",
            "& h3": {
                marginBottom: 0,
                fontSize: 26,
            },
            [theme.breakpoints.up("md")]: {
                "& h3": {
                    fontSize: "1.2rem",
                },
                "& form": {
                    maxWidth: "50%",
                },
            },
        },
        emptySearchContainer: {
            width: "100%",
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
            padding: theme.spacing(2),
            minWidth: "100%",
            // [theme.breakpoints.up("sm")]: {
            //     minWidth: "50% !important",
            // },
            // [theme.breakpoints.up("lg")]: {
            //     minWidth: "50% !important",
            // },
            // [theme.breakpoints.up("xl")]: {
            //     minWidth: "33.333% !important",
            // },
        },
        itemsHovered: {
            overflow: "auto",
            transition: "max-height 0.2s",
            maxHeight: 200,
            height: "auto",
            paddingBottom: 16,
        },
        formControl: {},
        loadingCircular: {
            position: "absolute",
            top: "50%",
            right: "calc(50% - 40px)",
        },
    }),
);
export const PlaygroundSearchResults: FunctionComponent<{}> = () => {
    const router = useRouter();
    const query = router.query.q as string;
    const [results, setResults] = useState<IPlaygroundSearchResult[]>([]);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [activeExample, setActiveExample] = useState<IExampleLink | null>(null);
    const queryType = router.query.type as SearchType;
    const [type, setType] = useState<SearchType>(queryType || "code");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [noResults, setNoResults] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const classes = useStyles();

    const searchRef = useRef<HTMLDivElement>();

    function filterResults(results: IPlaygroundSearchResult[]) {
        // remove results with the same snippetIdentifier, keeping the latest version
        const filteredResults: IPlaygroundSearchResult[] = [];
        const seen: { [key: string]: boolean } = {};
        results.forEach((result) => {
            if (!seen[result.snippetIdentifier]) {
                seen[result.snippetIdentifier] = true;
                // find the later version of all values that have this snippet identifier
                const laterVersions = results.filter((r) => r.snippetIdentifier === result.snippetIdentifier);
                const latest = laterVersions.reduce((prev, current) => {
                    return prev.version > current.version ? prev : current;
                });
                filteredResults.push(latest);
            }
        });
        return filteredResults;
    }

    useEffect(() => {
        setResults([]);
        setPage(0);
        setCount(0);
        setNoResults(false);
        if (!query || query === "undefined") {
            return;
        }
        setSearchTerm(query);
        setType(queryType);
        setLoading(true);
        setActiveExample(null);
        fetch(`https://snippet.babylonjs.com/search/${type}?query=${query}`)
            .then((result) => {
                if (!result.ok) {
                    setLoading(false);
                    setError("Error fetching results. Please try again later.");
                    return;
                }
                result.json().then((json) => {
                    if (json.value.length === 0) {
                        // console.log("no results");
                        setNoResults(true);
                    }
                    setResults(filterResults(json.value));
                    setLoading(false);
                });
            })
            .catch(() => {
                setLoading(false);
            });
        setCount(200);
    }, [query, queryType]);

    useEffect(() => {
        if (!query || query === "undefined" || page === 0) {
            return;
        }
        setError("");
        setLoading(true);
        // console.log("fetching");
        // const searchFields = type === "all" ? "" : "code" ? "jsonPayload" : type;
        // fetch(`https://babylonsnippetsearch.search.windows.net/indexes/snippets/docs?api-version=2023-11-01&search=${query}&searchFields=${searchFields}&facet=snippetIdentifier,count:10&$top=100&$skip=${page * 100}`, {
        //     method: "GET",
        //     headers: {
        //         "Content-type": "application/json; charset=UTF-8",
        //         // read key - can be exposed
        //         "api-key": "NOKEYHERE!",
        //     },
        // })
        fetch(`https://snippet.babylonjs.com/search/${type}?query=${query}&page=${page}`)
            .then((result) => {
                if (!result.ok) {
                    setLoading(false);
                    setError("Error fetching results. Please try again later.");
                    return;
                }
                result.json().then((json) => {
                    setResults(filterResults([...results, ...json.value]));
                    setLoading(false);
                });
            })
            .catch((e) => {
                // console.log("error", e);
                setLoading(false);
            });
    }, [page]);

    const handleTypeChange = (
        event: ChangeEvent<{
            name?: string;
            value: SearchType;
        }>,
    ) => {
        setType(event.target.value);
    };

    const searchForm = (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                router.push(`/playground?q=${searchTerm}&type=${type}`);
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
                <FormControl margin="dense" variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="search-type">Search Type</InputLabel>
                    <Select
                        native
                        value={type}
                        onChange={(e) => handleTypeChange(e as any)}
                        label="Search Type"
                        inputProps={{
                            name: "type",
                            id: "search-type",
                        }}
                    >
                        <option value="name">Title/Desc</option>
                        <option value="tags">Tags</option>
                        <option value="code">Code</option>
                    </Select>
                </FormControl>
            </FormGroup>
        </form>
    );

    return (
        <Layout
            breadcrumbs={generateBreadcrumbs()}
            metadata={{
                title: "Playground search page",
                description: "Playground search page for Babylon.js documentation site",
                imageUrl: "",
                keywords: "search, documentation, query, playground",
                robots: query || results.length ? "noindex, nofollow" : "index, follow",
            }}
            id={["playground"]}
        >
            <>
                {!results.length && !loading && (
                    <div className={classes.emptySearchContainer}>
                        <Typography component="h3" variant="h3" gutterBottom>
                            Search playgrounds
                        </Typography>
                        {searchForm}
                        {noResults && (
                            <Typography component="h5" variant="h5">
                                No results found for {query} in {queryType}
                            </Typography>
                        )}
                        {error && (
                            <Typography component="h5" variant="h5">
                                {error}
                            </Typography>
                        )}
                    </div>
                )}
                {(results.length || loading) && (
                    <div className={classes.flexContainer}>
                        <InlineExampleComponent {...activeExample} />
                        <div ref={searchRef} className={classes.searchContainer}>
                            {loading && (
                                <Typography component="h3" variant="h3">
                                    Loading results for {query} in {queryType}...
                                    <CircularProgress className={classes.loadingCircular} size="80px" />
                                </Typography>
                            )}
                            {!!results.length && (
                                <>
                                    <div>
                                        <Typography component="h3" variant="h3">
                                            Playground search results for {query} in {queryType} ({count})
                                        </Typography>
                                        {searchForm}
                                        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "stretch" }}>
                                            {results.map((res) => {
                                                return (
                                                    <div key={res.id} className={classes.resultContainer}>
                                                        <PlaygroundSearchResult setActiveExample={setActiveExample} type={queryType} term={query} searchResult={res}></PlaygroundSearchResult>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                            {!!count && !loading && count > results.length && (
                                <Button
                                    disabled={loading || page > 4}
                                    onClick={() => {
                                        if (page > 4) return;
                                        setPage(page + 1);
                                    }}
                                    variant="contained"
                                >
                                    Load more
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </>
        </Layout>
    );
};

export default PlaygroundSearchResults;

export const getStaticProps: GetStaticProps<{ [key: string]: any }, any> = async ({ params }) => {
    return { props: {} };
};

export const generateBreadcrumbs = () => {
    return [
        {
            name: "Playground search",
            url: "/playground",
        },
    ];
};
