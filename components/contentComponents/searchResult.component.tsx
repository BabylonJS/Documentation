import { createStyles, makeStyles, Theme, Link as MaterialLink } from "@material-ui/core";
import { FunctionComponent } from "react";

import ChevronRight from "@material-ui/icons/ChevronRight";
import Link from "next/link";
import { IDocumentSearchResult } from "../../lib/frontendUtils/searchQuery.utils";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        contentRoot: {
            display: "flex",
            padding: theme.spacing(2),
        },
        imageContainer: {
            position: "relative",
            width: 100,
        },
        textContent: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
        },
        pathContent: {
            display: "flex",
            flexWrap: "wrap",
            "& span": {
                display: "flex",
            },
            "& svg": {
                width: '1rem',
                height: '1.3rem'
            }
        },

        titleContent: {
            display: "flex",
            flexWrap: "wrap",
            "& span": {
                marginRight: theme.spacing(1)
            },
        },
    }),
);

export const SearchResult: FunctionComponent<{ searchResult: IDocumentSearchResult }> = ({ searchResult }) => {
    const classes = styles();
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
        <div key={searchResult.id} className={classes.contentRoot}>
            {/* <div className={classes.imageContainer}></div> */}
            <div className={classes.textContent}>
                <div className={classes.titleContent}>
                    <span>
                        <Link href={searchResult.path}>
                            <MaterialLink href={searchResult.path}>
                                <span>{searchResult.title}</span>
                            </MaterialLink>
                        </Link>
                    </span>
                    {searchResult.isApi && <span>[API] </span>}
                </div>
                {path.length > 1 && (
                    <div className={classes.pathContent}>
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
                    </div>
                )}
                <div>{searchResult.description}</div>
            </div>
        </div>
    );
};
