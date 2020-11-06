import { createStyles, makeStyles, Theme, Link as MaterialLink } from "@material-ui/core";
import { FunctionComponent } from "react";
import { ISearchResult } from "../../lib/buildUtils/search.utils";

import ChevronRight from "@material-ui/icons/ChevronRight";
import Link from "next/link";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        contentRoot: {
            display: "flex",
            padding: theme.spacing(2)
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
            display: 'flex',
            "& span": {
                display: 'flex'
            },
        },
    }),
);

export const SearchResult: FunctionComponent<{ searchResult: ISearchResult }> = ({ searchResult }) => {
    const classes = styles();
    const idSplit = searchResult.path.split("/");
    const path = searchResult.categories.length
        ? searchResult.categories.map((category, idx) => {
              return {
                  name: category,
                  url: idSplit.slice(0, idx).join("/"),
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
                <div className={classes.pathContent}>
                    {path.map((result, idx) => {
                        return (
                            <span key={idx}>
                                <Link key={result.url} href={result.url}>
                                    <MaterialLink href={result.url}>
                                        <span>{result.name}</span>
                                    </MaterialLink>
                                </Link>
                                {idx < path.length - 1 && <ChevronRight></ChevronRight>}
                            </span>
                        );
                    })}
                </div>
                <div>{searchResult.description}</div>
            </div>
        </div>
    );
};
