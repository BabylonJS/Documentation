import { Link as MaterialLink, useTheme, Box } from "@mui/material";
import { FunctionComponent } from "react";

import ChevronRight from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import { IDocumentSearchResult } from "../../lib/frontendUtils/searchQuery.utils";

export const SearchResult: FunctionComponent<{ searchResult: IDocumentSearchResult }> = ({ searchResult }) => {
    const theme = useTheme();
    const idSplit = searchResult.path.split("/");
    const path = searchResult.categories.length
        ? searchResult.categories.map((category, idx) => {
              return {
                  name: category,
                  url: idSplit.slice(0, idx + 2).join("/"),
              };
          })
        : [
              {
                  name: searchResult.title,
                  url: searchResult.path,
              },
          ];

    return (
        <Box
            sx={{
                display: "flex",
                padding: theme.spacing(2),
            }}
            key={searchResult.id}
        >
            {/* <div className={classes.imageContainer}></div> */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            "& span": {
                marginRight: theme.spacing(1),
            },
        }}>
                    <span>
                        <Link href={searchResult.path}>
                            <MaterialLink href={searchResult.path}>
                                <span>{searchResult.title}</span>
                            </MaterialLink>
                        </Link>
                    </span>
                    {searchResult.isApi && <span>[API] </span>}
                </Box>
                {path.length > 1 && (
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            "& span": {
                                display: "flex",
                            },
                            "& svg": {
                                width: "1rem",
                                height: "1.3rem",
                            },
                        }}
                    >
                        {path.map((result, idx) => {
                            return (
                                <span key={idx}>
                                    <Link key={result.url} href={result.url}>
                                        <MaterialLink href={result.url} variant="caption" color="secondary">
                                            <span>{result.name}</span>
                                        </MaterialLink>
                                    </Link>
                                    {idx < path.length - 1 && <ChevronRight></ChevronRight>}
                                </span>
                            );
                        })}
                    </Box>
                )}
                <div>{searchResult.description}</div>
            </Box>
        </Box>
    );
};
