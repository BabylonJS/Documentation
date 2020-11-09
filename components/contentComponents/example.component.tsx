import { makeStyles, createStyles, Theme, Toolbar, Typography, IconButton, Tooltip } from "@material-ui/core";
import { FunctionComponent, useContext } from "react";
import { IExampleLink } from "../../lib/content.interfaces";
import { DocumentationContext } from "../../pages/[...id]";
import { colorPalette } from "../../styles/theme";

import ExternalLinkIcon from "@material-ui/icons/OpenInNew";
import LinkIcon from "@material-ui/icons/Link";
import Link from "next/link";
import { getExampleLink } from "../../lib/frontendUtils/frontendTools";
import Image from "next/image";

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
            display: "flex",
            flexDirection: "column",
            padding: theme.spacing(2),
            maxHeight: "100%",
            maxWidth: 260,
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
            [theme.breakpoints.up("md")]: {
                display: "unset",
            },
        },
        imageContainer: {
            height: 140,
            cursor: "pointer",
            display: "inline-block",
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

export const ExampleComponent: FunctionComponent<IExampleLink> = (example) => {
    const context = useContext(DocumentationContext);
    const { id, title, description, image, type } = example;
    const classes = exampleStyles();
    const link = getExampleLink(example);
    // just as a test

    const onPlaygroundPressed = () => {
        context.setActiveExample(example);
    };
    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <IconButton onClick={onPlaygroundPressed} aria-label={`Open ${type} ${title}`} size="small" color="inherit">
                    <Tooltip title={`Open ${type} ${title}`}>
                        <LinkIcon></LinkIcon>
                    </Tooltip>
                </IconButton>
                <span>{title}</span>
                <Link href={link}>
                    <a target="_blank">
                        <IconButton aria-label={`Open ${type} ${title} in a new tab`} size="small" color="inherit">
                            <Tooltip title={`Open ${type} ${title} in a new tab`}>
                                <ExternalLinkIcon></ExternalLinkIcon>
                            </Tooltip>
                        </IconButton>
                    </a>
                </Link>
            </div>
            <div onClick={onPlaygroundPressed} className={classes.imageContainer}>
                <Image src={image} layout="fill"></Image>
            </div>
            <div className={classes.footer}>
                [{type.toUpperCase()}] {description}
            </div>
        </div>
    );
};

export const ExamplesComponent: FunctionComponent<{ examples: IExampleLink[] }> = ({ examples }) => {
    const classes = examplesStyles();
    // just as a test
    return (
        <>
            <Toolbar className={classes.header}>
                <Typography variant="h6" noWrap>
                    Examples
                </Typography>
            </Toolbar>
            {examples.map((link) => (
                <ExampleComponent key={link.id} {...link} />
            ))}
        </>
    );
};
