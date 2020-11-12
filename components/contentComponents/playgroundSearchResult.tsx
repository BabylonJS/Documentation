import { createStyles, makeStyles, Theme, Link as MaterialLink, Card, CardContent, Typography, CardActions, Button, Chip } from "@material-ui/core";
import { FunctionComponent, useState } from "react";

import ChevronRight from "@material-ui/icons/ChevronRight";
import Link from "next/link";

export interface IPlaygroundSearchResult {
    date: string;
    description?: string;
    fromDoc: boolean;
    id: string;
    isWorking: boolean;
    jsonPayload: string;
    name?: string;
    snippetIdentifier: string;
    tags?: string; // comma separated
    version: number;
}

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
                width: "1rem",
                height: "1.3rem",
            },
        },

        titleContent: {
            display: "flex",
            flexWrap: "wrap",
            "& span": {
                marginRight: theme.spacing(1),
            },
        },
        chipHolder: {
            "& div": {
                marginRight: theme.spacing(1),
                marginTop: 8,
                cursor: "pointer",
            },
        },
    }),
);

export const PlaygroundSearchResult: FunctionComponent<{ searchResult: IPlaygroundSearchResult }> = ({ searchResult }) => {
    const classes = styles();
    const [revision, setRevision] = useState<number>(searchResult.version);

    const tags = new Set();
    (searchResult.tags || "").split(",").forEach((tag) => {
        tags.add(tag.trim());
    });

    return (
        <Card>
            <CardContent>
                <Typography color="textSecondary" gutterBottom></Typography>
                <Link href={`http://playground.babylonjs.com/#${searchResult.id}#${searchResult.version}`}>
                    <MaterialLink target="_blank" href={`http://playground.babylonjs.com/#${searchResult.id}#${searchResult.version}`}>
                        <Typography variant="h5" component="h2">
                            {searchResult.name ? searchResult.name : searchResult.id}
                        </Typography>
                    </MaterialLink>
                </Link>
                <Typography color="textSecondary">{searchResult.description}</Typography>
                <Typography variant="body2" component="p">
                    id: {searchResult.id}
                    <br />
                    latest revision: {searchResult.version}
                    <br />
                    {!!tags.size && (
                        <div className={classes.chipHolder}>
                            {Array.from(tags).map((chip: string) => {
                                return (
                                    <Link key={chip} href={`/playground?q=${chip}&type=tags`}>
                                        <a>
                                            <Chip color="primary" label={chip} />
                                        </a>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </Typography>
            </CardContent>
        </Card>
        // <div key={searchResult.snippetIdentifier} className={classes.contentRoot}>
        //     {/* <div className={classes.imageContainer}></div> */}
        //     <div className={classes.textContent}>
        //         <div className={classes.titleContent}>
        //             <span>
        //                 <Link href={`http://playground.babylonjs.com/#${searchResult.id}#${searchResult.version}`}>
        //                     <MaterialLink target="_blank" href={`http://playground.babylonjs.com/#${searchResult.id}#${searchResult.version}`}>
        //                         <span>{searchResult.id}</span>
        //                     </MaterialLink>
        //                 </Link>
        //             </span>
        //         </div>
        //         <div>{searchResult.description}</div>
        //     </div>
        // </div>
    );
};
