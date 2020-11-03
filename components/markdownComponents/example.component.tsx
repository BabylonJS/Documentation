import { createStyles, IconButton, makeStyles, Theme, Tooltip } from "@material-ui/core";
import { FunctionComponent, useContext, useEffect } from "react";
import { DocumentationContext } from "../../pages/[...id]";

import LinkIcon from "@material-ui/icons/Link";
import { IExampleLink } from "../../lib/content.interfaces";
import { colorPalette } from "../../styles/theme";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        linkContainer: {
            cursor: "pointer",
            backgroundColor: colorPalette.linkText,
            display: "inline-flex",
            marginRight: theme.spacing(0.5),
            marginTop: theme.spacing(0.5),
            justifyContent: "space-between",
            alignItems: 'center',
            width: 'auto',
            color: "white",
            "& span": {
                marginRight: theme.spacing(1)
            },
            "& span:first-child": {
                marginLeft: theme.spacing(1)
            },
            "& svg": {
                marginTop: theme.spacing(0.5),
            }
        },
    }),
);

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const ExampleMarkdownComponent: FunctionComponent<IExampleLink> = (props) => {
    const context = useContext(DocumentationContext);
    const classes = styles();
    const example = {
        ...props,
    } as IExampleLink;
    useEffect(() => {
        context.addExampleLink(example);
    }, []);

    const onExamplePressed = () => {
        context.setActiveExample(example);
    };
    // just as a test
    return (
        <DocumentationContext.Consumer>
            {(context) => (
                <Tooltip title={`Open ${props.type} ${props.title}`}>
                    <div className={classes.linkContainer} onClick={onExamplePressed.bind(this, context)}>
                        {/* <IconButton aria-label="Show playground" size="small" color="inherit"> */}
                        <span>
                            <LinkIcon></LinkIcon>
                        </span>
                        {/* </IconButton> */}
                        <span>{example.title}</span>
                    </div>
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
