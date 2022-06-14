import { createStyles, makeStyles, Theme, Link as MaterialLink, Card, CardContent, Typography, CardActions, Button, Chip, Accordion, AccordionSummary, AccordionDetails, IconButton, Tooltip } from "@material-ui/core";
import { FunctionComponent, useEffect, useState } from "react";

import CodeIcon from "@material-ui/icons/Code";
import ExternalLinkIcon from "@material-ui/icons/OpenInNew";
import LinkIcon from "@material-ui/icons/Link";

import Highlight, { defaultProps } from "prism-react-renderer";
import vsDark from "prism-react-renderer/themes/vsDark";

import Link from "next/link";
import { IExampleLink } from "../../lib/content.interfaces";

export type SearchType = "code" | "name" | "tags";

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
            height: "100%",
            display: "flex",
        },
        summaryContainer: {},
        chipHolder: {
            "& div": {
                marginRight: theme.spacing(1),
                cursor: "pointer",
            },
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: "33.33%",
            flexShrink: 0,
            marginRight: theme.spacing(2),
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            [theme.breakpoints.up("md")]: {
                justifyContent: "space-between",
                flexWrap: "wrap",
                flexDirection: "row",
            },
        },
        actionButtons: {
            display: "flex",
            color: "rgba(0, 0, 0, 0.54)",
            "& button": {
                marginLeft: 4,
            },
            "& a": {
                display: "inherit",
            },
        },
        lineNumber: {
            display: "table-cell",
            textAlign: "right",
            paddingRight: "1em",
            userSelect: "none",
            opacity: "0.5",
        },
    }),
);

export const PlaygroundSearchResult: FunctionComponent<{ searchResult: IPlaygroundSearchResult; type: SearchType; term?: string; setActiveExample: (example: IExampleLink) => void }> = ({ searchResult, type, term, setActiveExample }) => {
    const classes = styles();
    const [expanded, setExpanded] = useState<boolean>(false);

    const tags = new Set();
    (searchResult.tags || "").split(",").forEach((tag) => {
        const trim = tag.trim();
        if (trim) {
            tags.add(tag.trim());
        }
    });

    let parsed: { code: string; };
    try {
        parsed = JSON.parse(searchResult.jsonPayload);
    } catch (e) {
        return null;
    }

    const { code } = parsed;
    const codeLines: Array<string> = (code || '').split("\n");
    let startingLine = 0;
    let foundLine = -1;
    const lowerTerm = term.toLowerCase();
    if (type === "code") {
        for (foundLine = 0; foundLine < codeLines.length; ++foundLine) {
            if (codeLines[foundLine].length > 100) {
                codeLines[foundLine] = `${codeLines[foundLine].substr(0, 100)}...`;
            }
            if (codeLines[foundLine].toLowerCase().indexOf(lowerTerm) !== -1) {
                startingLine = Math.max(foundLine - 5, 0);
                break;
            }
        }
    }
    const codeToShow = codeLines.slice(startingLine, startingLine + 10).join("\n");

    const name = searchResult.name ? `${searchResult.name} (${searchResult.id})` : searchResult.id;

    useEffect(() => {
        if (type === "code") {
            setExpanded(true);
        } else {
            setExpanded(false);
        }
    }, [type]);

    return (
        // <div className={classes.contentRoot}>

        //     <Typography className={classes.heading}>
        //         {" "}
        //         <Link href={`http://playground.babylonjs.com/#${searchResult.id}#${searchResult.version}`}>
        //             <MaterialLink target="_blank" href={`http://playground.babylonjs.com/#${searchResult.id}#${searchResult.version}`}>
        //                 {searchResult.name ? searchResult.name : searchResult.id}
        //             </MaterialLink>
        //         </Link>
        //     </Typography>
        //     <Typography className={classes.secondaryHeading}>{searchResult.description}</Typography>
        // </div>

        <Accordion
            id={searchResult.id}
            expanded={expanded}
            onChange={() => {
                setExpanded(!expanded);
            }}
        >
            <AccordionSummary className={classes.summaryContainer} expandIcon={<CodeIcon />} aria-controls="playground-content">
                <Typography className={classes.heading}>{name}</Typography>
                <Typography className={classes.secondaryHeading}>
                    <span>{searchResult.description}</span>
                    {!!tags.size && (
                        <div className={classes.chipHolder}>
                            {Array.from(tags).map((chip: string) => {
                                return (
                                    <Link key={chip} href={`/playground?q=${chip}&type=tags`}>
                                        <a>
                                            <Chip size="small" color="primary" label={chip} />
                                        </a>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </Typography>
                <Typography className={classes.actionButtons}>
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveExample({
                                id: searchResult.id + "#" + searchResult.version,
                                title: name,
                            });
                            location.hash = searchResult.id;
                        }}
                        aria-label={`Preview ${searchResult.id}`}
                        size="small"
                        color="inherit"
                    >
                        <Tooltip title={`Preview ${searchResult.id}`}>
                            <LinkIcon></LinkIcon>
                        </Tooltip>
                    </IconButton>
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        aria-label={`Open ${searchResult.id} in a new tab`}
                        size="small"
                        color="inherit"
                    >
                        <Link href={`http://playground.babylonjs.com/#${searchResult.id}#${searchResult.version}`}>
                            <a target="_blank">
                                <Tooltip title={`Open ${searchResult.id} in a new tab`}>
                                    <ExternalLinkIcon></ExternalLinkIcon>
                                </Tooltip>
                            </a>
                        </Link>
                    </IconButton>
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div style={{ width: "100%" }}>
                    <Highlight {...defaultProps} theme={vsDark} code={codeToShow} language="jsx">
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <pre className={className} style={style}>
                                {tokens.map((line, i) => (
                                    <div style={{ display: "table-row" }} key={i} {...getLineProps({ line, key: i })}>
                                        <span style={{ opacity: i + startingLine === foundLine ? 1 : 0.5, color: i + startingLine === foundLine ? "white" : "inherit" }} className={classes.lineNumber}>
                                            {i + 1 + startingLine}
                                        </span>
                                        <span style={{ display: "table-cell", fontWeight: i + startingLine === foundLine ? 600 : 400, opacity: type === "code" && (i < 2 || i > 7) ? 0.6 : 1 }}>
                                            {line.map((token, key) => (
                                                <span key={key} {...getTokenProps({ token, key })} />
                                            ))}
                                        </span>
                                    </div>
                                ))}
                            </pre>
                        )}
                    </Highlight>
                </div>
            </AccordionDetails>
        </Accordion>

        // <Card className={classes.contentRoot}>
        //     <CardContent>
        //         <Typography color="textSecondary" gutterBottom></Typography>
        //         <Link href={`http://playground.babylonjs.com/#${searchResult.id}#${searchResult.version}`}>
        //             <MaterialLink target="_blank" href={`http://playground.babylonjs.com/#${searchResult.id}#${searchResult.version}`}>
        //                 <Typography variant="h5" component="h2">
        //                     {searchResult.name ? searchResult.name : searchResult.id}
        //                 </Typography>
        //             </MaterialLink>
        //         </Link>
        //         <Typography color="textSecondary">{searchResult.description}</Typography>
        //         <Typography variant="body2" component="p">
        //             id: {searchResult.id}
        //             <br />
        //             latest revision: {searchResult.version}
        //             <br />
        //             {!!tags.size && (
        //                 <div className={classes.chipHolder}>
        //                     {Array.from(tags).map((chip: string) => {
        //                         return (
        //                             <Link key={chip} href={`/playground?q=${chip}&type=tags`}>
        //                                 <a>
        //                                     <Chip color="primary" label={chip} />
        //                                 </a>
        //                             </Link>
        //                         );
        //                     })}
        //                 </div>
        //             )}
        //         </Typography>
        //     </CardContent>
        // </Card>
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
