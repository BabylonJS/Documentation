import { createStyles, makeStyles, Snackbar, Theme, Tooltip, Hidden } from "@material-ui/core";
import { FunctionComponent, MouseEvent, SyntheticEvent, useContext, useEffect, useState } from "react";
import { DocumentationContext } from "../../pages/[...id]";

import LinkIcon from "@material-ui/icons/Link";
import ExternalLinkIcon from "@material-ui/icons/OpenInNew";
import { IExampleLink } from "../../lib/content.interfaces";
import { colorPalette } from "../../styles/theme";
import { getExampleLink } from "../../lib/frontendUtils/frontendTools";
import Link from "next/link";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        linkContainer: {
            cursor: "pointer",
            backgroundColor: colorPalette.linkText,
            display: "inline-flex",
            marginRight: theme.spacing(0.5),
            marginTop: theme.spacing(0.5),
            justifyContent: "space-between",
            alignItems: "center",
            width: "auto",
            color: "white",
            "& span": {
                marginRight: theme.spacing(1),
            },
            "& span:first-child": {
                marginLeft: theme.spacing(1),
            },
            "& svg": {
                marginTop: theme.spacing(0.5),
            },
            "& a": {
                color: "white !important",
            },
        },
    }),
);

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const ExampleMarkdownComponent: FunctionComponent<IExampleLink> = (props) => {
    const context = useContext(DocumentationContext);
    const classes = styles();
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event: SyntheticEvent | MouseEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const example = {
        ...props,
    } as IExampleLink;
    useEffect(() => {
        context.addExampleLink(example);
    }, []);

    const onExamplePressed = () => {
        context.setActiveExample(example);
        handleClick();
    };
    // just as a test
    return (
        <DocumentationContext.Consumer>
            {(context) => (
                <Tooltip title={`Open ${props.type} ${props.title}`}>
                    <>
                        <span id={`example-${props.type}-${props.id.replace(/#/g, "-")}`} className={classes.linkContainer}>
                            <span onClick={onExamplePressed.bind(this, context)}>
                                <Tooltip title={`Preview ${props.type} ${props.title}`}>
                                    <LinkIcon></LinkIcon>
                                </Tooltip>
                            </span>
                            <Tooltip title={`Preview ${props.type} ${props.title}`}>
                                <span style={{ minWidth: 120 }} onClick={onExamplePressed.bind(this, context)}>
                                    {example.title}
                                </span>
                            </Tooltip>
                            <span style={{ minWidth: 20 }}>
                                <Link href={getExampleLink(example, false)}>
                                    <a target="_blank">
                                        <Tooltip title={`Open ${props.type} ${props.title} in a new tab`}>
                                            <ExternalLinkIcon></ExternalLinkIcon>
                                        </Tooltip>
                                    </a>
                                </Link>
                            </span>
                        </span>
                        <Hidden smUp>
                            <Snackbar message={`${example.type} opened at the top`} onClose={handleClose} open={open} autoHideDuration={3000}></Snackbar>
                        </Hidden>
                    </>
                </Tooltip>
            )}
        </DocumentationContext.Consumer>
    );
};

export const PlaygroundMarkdownComponent: FunctionComponent<IExampleLink> = (props) => {
    return <ExampleMarkdownComponent {...props} type="pg"></ExampleMarkdownComponent>;
};

export const NMEMarkdownComponent: FunctionComponent<IExampleLink> = (props) => {
    return <ExampleMarkdownComponent {...props} type="nme"></ExampleMarkdownComponent>;
};
