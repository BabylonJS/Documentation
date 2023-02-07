import { Theme, Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import { FunctionComponent, useContext } from "react";
import { IExampleLink } from "../../lib/content.interfaces";
import { DocumentationContext } from "../../pages/[...id]";
import { colorPalette } from "../../styles/theme";

import ExternalLinkIcon from "@mui/icons-material/OpenInNew";
import LinkIcon from "@mui/icons-material/Link";
import { Link as MaterialLink } from "@mui/material";
import Link from "next/link";
import { getExampleImageUrl, getExampleLink, getImageUrl } from "../../lib/frontendUtils/frontendTools";
import Image from "next/image";
import { createStyles, makeStyles } from "@mui/styles";

const examplesStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            backgroundColor: colorPalette.header,
            width: "100%",
            color: "white",
            minHeight: 48,
            display: "none",
            [theme.breakpoints.up("md")]: {
                display: "flex",
            },
        },
    }),
);

const exampleStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            // display: "flex",
            flexDirection: "column",
            padding: theme.spacing(2),
            maxHeight: "100%",
            maxWidth: 260,
            minWidth: 260,
        },
        header: {
            backgroundColor: colorPalette.linkText,
            color: "white",
            minHeight: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            "& > *": {
                padding: theme.spacing(0.5),
            },
            " & span": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            },
        },
        footer: {
            backgroundColor: colorPalette.linkText,
            color: "white",
            minHeight: 36,
            padding: theme.spacing(0.5),
            display: "none",
            width: "100%",
            [theme.breakpoints.up("md")]: {
                display: "inline-block",
            },
        },
        imageContainer: {
            height: 120,
            cursor: "pointer",
            overflow: "hidden",
            position: "relative",
            width: "100%",
            "& img": {
                pointerEvents: "none",
                position: "absolute",
                minWidth: "100%",
                minHeight: "100%",
                objectFit: "cover",
            },
        },
    }),
);

export const ExampleComponent: FunctionComponent<{ example: IExampleLink; onExamplePressed?: (example: IExampleLink) => void }> = ({ example, onExamplePressed }) => {
    const context = useContext(DocumentationContext);
    const { title, description, image, imageUrl, type = "pg" } = example;
    const classes = exampleStyles();
    const link = getExampleLink(example, false);

    const onPlaygroundPressed = () => {
        context.setActiveExample(example);
        if (onExamplePressed) {
            onExamplePressed(example);
        }
    };

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <a href={`#example-${example.type || "pg"}-${example.id.replace(/#/g, "-")}`}>
                    <IconButton onClick={onPlaygroundPressed} aria-label={`Open ${type} ${title}`} size="small" color="inherit">
                        <Tooltip title={`Open ${type} ${title}`}>
                            <LinkIcon></LinkIcon>
                        </Tooltip>
                    </IconButton>
                </a>
                <span title={title}>{title}</span>
                <Link href={link} target={"_blank"}>
                    <IconButton aria-label={`Open ${type} ${title} in a new tab`} size="small" color="inherit">
                        <Tooltip title={`Open ${type} ${title} in a new tab`}>
                            <ExternalLinkIcon></ExternalLinkIcon>
                        </Tooltip>
                    </IconButton>
                </Link>
            </div>
            <div onClick={onPlaygroundPressed} className={classes.imageContainer}>
                <Image
                    onError={(e) => {
                        // fallback to default image
                        (e.target as HTMLImageElement).src = getImageUrl();
                        (e.target as HTMLImageElement).alt = "Babylon.js logo";
                        (e.target as HTMLImageElement).srcset = "";
                    }}
                    src={image || imageUrl || getExampleImageUrl(example)}
                    title={title}
                    alt={title}
                    fill={true}
                ></Image>
            </div>
            <div className={classes.footer}>
                [{type.toUpperCase()}] {description}{" "}
                {example.documentationPage && (
                    <>
                        <br />
                        <Link href={example.documentationPage}>
                            <MaterialLink href={example.documentationPage}>Documentation</MaterialLink>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export const ExamplesComponent: FunctionComponent<{ examples: IExampleLink[]; onExamplePressed?: (example: IExampleLink) => void; title?: string }> = ({ examples, onExamplePressed, title = "Examples" }) => {
    const classes = examplesStyles();
    return (
        <>
            <Toolbar className={classes.header}>
                <Typography variant="h6" noWrap>
                    {title}
                </Typography>
            </Toolbar>
            {examples.map((link, idx) => (
                <ExampleComponent key={`link-${idx}`} example={link} onExamplePressed={onExamplePressed} />
            ))}
        </>
    );
};
