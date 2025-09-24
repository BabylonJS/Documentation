import { Typography,  Chip, Accordion, AccordionSummary, AccordionDetails, IconButton, Tooltip, Box, useTheme } from "@mui/material";
import { FunctionComponent, useContext, useEffect, useState } from "react";

import CodeIcon from "@mui/icons-material/Code";
import ExternalLinkIcon from "@mui/icons-material/OpenInNew";
import LinkIcon from "@mui/icons-material/Link";

import { Highlight, themes } from "prism-react-renderer";

import Link from "next/link";
import { IExampleLink } from "../../lib/content.interfaces";
import { BaseUrlContext } from "../../pages/_app";

export type SearchType = "code" | "name" | "tags" | "description" | "all";

export interface IPlaygroundSearchResult {
    date: string;
    description?: string;
    fromDoc: boolean;
    id: string;
    isWorking: boolean;
    jsonPayload: string;
    name?: string;
    snippetIdentifier: string;
    tags?: string[];
    version: number;
}

export const PlaygroundSearchResult: FunctionComponent<{ searchResult: IPlaygroundSearchResult; type: SearchType; term?: string; setActiveExample: (example: IExampleLink) => void }> = ({ searchResult, type, term, setActiveExample }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState<boolean>(false);
    const [codeToShow, setCodeToShow] = useState<{ code: string; startingLine: number; foundLine: number }>({ code: "", startingLine: 0, foundLine: 0 });

    const tags = new Set();
    (searchResult.tags || []).forEach((tag) => {
        const trim = tag.trim();
        if (trim) {
            tags.add(tag.trim());
        }
    });

    const [name, setName] = useState<string>(searchResult.name ? `${searchResult.name} (${searchResult.id})` : searchResult.id);

    useEffect(() => {
        if (type === "code") {
            setExpanded(true);
        } else {
            setExpanded(false);
        }
    }, [type]);

    useEffect(() => {
        // get the snippet code
        fetch(`https://snippet.babylonjs.com/${searchResult.snippetIdentifier}/${searchResult.version}`).then((response) => {
            response.text().then((text) => {
                const parsed = JSON.parse(JSON.parse(text).jsonPayload);
                let filesCode: [string, string][] = [];

                let v2Manifest = { files: { default: "" } };
                try {
                    v2Manifest = JSON.parse(parsed.code);
                } catch (e) {
                    // This was not a V2 PG manifest, use as is
                    v2Manifest.files.default = parsed.code;
                }

                for (const [filename, code] of Object.entries(v2Manifest.files)) {
                    if (code && typeof code === 'string') {
                        filesCode.push([filename, code]);
                    }
                }

                // When not searching for code, just show the first 10 lines of the first file
                if (type !== "code") {
                    setCodeToShow({
                        code: filesCode.length ? filesCode[0][1].split("\n").slice(0, 10).join("\n") : "",
                        startingLine: 0,
                        foundLine: -1,
                    });

                    return;
                }

                // Searching inside the code files, we will stop on the first file we find the term
                let codeLines: Array<string> = [];
                let startingLine = 0;
                let foundLine = -1;
                let foundFile = "";
                let codeFound = false;

                for (const [filename, code] of filesCode) {
                    codeFound = false;
                    codeLines = (code || "").split("\n");
                    startingLine = 0;
                    foundLine = -1;
                    const lowerTerm = term.toLowerCase();
                    
                    for (foundLine = 0; foundLine < codeLines.length; ++foundLine) {
                        if (codeLines[foundLine].toLowerCase().indexOf(lowerTerm) !== -1) {
                            codeFound = true;
                            startingLine = Math.max(foundLine - 5, 0);
                            foundFile = filename;
                            break;
                        }
                    }

                    if (codeFound) {
                        break;
                    }
                }
                
                if (codeFound) {
                    if (foundFile !== "default") {
                        setName(name + ` - ${foundFile}`);
                    }

                    setCodeToShow({
                        code: codeLines.slice(startingLine, startingLine + 10).join("\n"),
                        startingLine,
                        foundLine,
                    });
                } else {
                    // Couldn't find the exact code, still show the first 10 lines of the first file
                    setCodeToShow({
                        code: filesCode.length ? filesCode[0][1].split("\n").slice(0, 10).join("\n") : "",
                        startingLine: 0,
                        foundLine: -1,
                    });
                }
            });
        });
    }, [searchResult]);

    const baseUrl = useContext(BaseUrlContext);

    return (
        <Accordion
            id={searchResult.id}
            expanded={expanded}
            onChange={() => {
                setExpanded(!expanded);
            }}
        >
            <AccordionSummary expandIcon={<CodeIcon />} aria-controls="playground-content">
                <Typography
                    sx={{
                        fontSize: theme.typography.pxToRem(15),
                        flexBasis: "33.33%",
                        flexShrink: 0,
                        marginRight: theme.spacing(2),
                    }}
                >
                    {name}
                </Typography>
                <Typography
                    sx={{
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
                    }}
                >
                    <span>{searchResult.description}</span>
                    {!!tags.size && (
                        <Box
                            sx={{
                                "& div": {
                                    marginRight: theme.spacing(1),
                                    cursor: "pointer",
                                },
                            }}
                        >
                            {Array.from(tags).map((chip: string) => {
                                return (
                                    <Link key={chip} href={baseUrl + `/playground?q=${chip}&type=tags`}>
                                        <Chip size="small" color="primary" label={chip} />
                                    </Link>
                                );
                            })}
                        </Box>
                    )}
                </Typography>
                <Typography
                    sx={{
                        display: "flex",
                        color: "rgba(0, 0, 0, 0.54)",
                        "& button": {
                            marginLeft: "4px",
                        },
                        "& a": {
                            display: "inherit",
                        },
                    }}
                >
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveExample({
                                id: searchResult.snippetIdentifier + "#" + searchResult.version,
                                title: name,
                            });
                            location.hash = searchResult.snippetIdentifier;
                        }}
                        aria-label={`Preview ${searchResult.snippetIdentifier}`}
                        size="small"
                    >
                        <Tooltip title={`Preview ${searchResult.snippetIdentifier}`}>
                            <LinkIcon></LinkIcon>
                        </Tooltip>
                    </IconButton>
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        aria-label={`Open ${searchResult.snippetIdentifier} in a new tab`}
                        size="small"
                    >
                        <Link href={`http://playground.babylonjs.com/#${searchResult.snippetIdentifier}#${searchResult.version}`} target="_blank">
                            <Tooltip title={`Open ${searchResult.id} in a new tab`}>
                                <ExternalLinkIcon></ExternalLinkIcon>
                            </Tooltip>
                        </Link>
                    </IconButton>
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div style={{ width: "100%" }}>
                    <Highlight theme={themes.vsDark} code={codeToShow.code} language="jsx">
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <pre className={className} style={style}>
                                {tokens.map((line, i) => (
                                    <div style={{ display: "table-row" }} key={i} {...getLineProps({ line, key: i })}>
                                        <Box
                                            component="span"
                                            sx={{
                                                display: "table-cell",
                                                textAlign: "right",
                                                paddingRight: "1em",
                                                userSelect: "none",
                                                opacity: "0.5",
                                            }}
                                            style={{ opacity: i + codeToShow.startingLine === codeToShow.foundLine ? 1 : 0.5, color: i + codeToShow.startingLine === codeToShow.foundLine ? "white" : "inherit" }}
                                        >
                                            {i + 1 + codeToShow.startingLine}
                                        </Box>
                                        <span style={{ display: "table-cell", fontWeight: i + codeToShow.startingLine === codeToShow.foundLine ? 600 : 400, opacity: type === "code" && (i < 2 || i > 7) ? 0.6 : 1 }}>
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
    );
};
