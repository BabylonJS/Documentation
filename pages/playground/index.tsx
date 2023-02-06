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

const baseQueryURL = "https://snippet.babylonjs.com/search";
const baseCountURL = "https://snippet.babylonjs.com/count";

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
            width:'100%',
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
            position: 'absolute',
            top: '50%',
            right: 'calc(50% - 40px)'
        }
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
    const classes = useStyles();

    const searchRef = useRef<HTMLDivElement>();

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
        // console.log(`${baseQueryURL}/${queryType}/`);
        fetch(`${baseQueryURL}/${queryType}/`, {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({ search: query, page: page, pageSize: 25, includePayload: false }),
        })
            .then((result) => {
                result.json().then((json) => {
                    if (json.length === 0) {
                        // console.log("no results");
                        setNoResults(true);
                    }
                    setResults(json);
                    setLoading(false);
                });
            })
            .catch(() => {
                setLoading(false);
            });

        // get count
        fetch(`${baseCountURL}/${type}/`, {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({ search: query }),
        })
            .then((result) => {
                result.json().then((json) => {
                    setCount(json);
                });
            })
            .catch(() => {});
    }, [query, queryType]);

    useEffect(() => {
        if (!query || query === "undefined") {
            return;
        }
        setLoading(true);
        // console.log("fetching");
        fetch(`${baseQueryURL}/${type}/`, {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({ search: query, page: page, pageSize: 25, includePayload: false }),
        })
            .then((result) => {
                result.json().then((json) => {
                    setResults([...results, ...json]);
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
                description: "Playground earch page for Babylon.js documentation site",
                imageUrl: "",
                keywords: "search, documentation, query, playground",
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
                                    disabled={loading}
                                    onClick={() => {
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
