import { FunctionComponent, useEffect, useState } from "react";
import { GetStaticProps } from "next";
import Layout from "../../components/layout.component";
import { useRouter } from "next/dist/client/router";
import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import { SearchResult } from "../../components/contentComponents/searchResult.component";
import { ISearchResult } from "../../lib/buildUtils/search.utils";

const baseQueryURL = "https://babylonjs-doc.search.windows.net/indexes/newdocs/docs?api-version=2020-06-30&api-key=DF333E13A6C71B67290E46668C86DD7E&search=";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        searchContainer: {
            padding: theme.spacing(2),
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
    }),
);

export const SearchResults: FunctionComponent<{}> = () => {
    // TODO define search results
    const [results, setResults] = useState<ISearchResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const classes = useStyles();

    useEffect(() => {
        const query = router.query.q;
        if (!query) {
            return;
        }
        setLoading(true);
        setResults([]);
        fetch(baseQueryURL + query)
            .then((result) => {
                result.json().then((json) => {
                    setResults(json.value);
                    setLoading(false);
                });
            })
            .catch(() => {
                setLoading(false);
            });
    }, [router.query.q]);
    return (
        <Layout
            breadcrumbs={generateBreadcrumbs()}
            metadata={{
                title: "Search page",
                description: "Search page for Babylon.js'd documentation site",
                imageUrl: "",
                keywords: "search, documentation, query",
            }}
            id={["search"]}
        >
            <div className={classes.searchContainer}>
                {loading && <Typography component="h2" variant="h2">
                            Searching for {router.query.q}...
                        </Typography>}
                {!!results.length && (
                    <div>
                        <Typography component="h2" variant="h2">
                            Search results for {router.query.q}
                        </Typography>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {results.map((res) => {
                                return <SearchResult key={res.id} searchResult={res}></SearchResult>;
                            })}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default SearchResults;

export const getStaticProps: GetStaticProps<{ [key: string]: any }, any> = async ({ params }) => {
    // // HTML content
    // const content = getAPIPageData(['globals']);
    // return {
    //     props: {
    //         ...content,
    //     },
    // };
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
