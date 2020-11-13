import { FunctionComponent, useContext, useEffect, useState } from "react";
import { ITableOfContentsItem } from "../../lib/content.interfaces";
import { DocumentationContext } from "../../pages/[...id]";

import LinkIcon from "@material-ui/icons/Link";
import { createStyles, IconButton, makeStyles, Tooltip, Theme } from "@material-ui/core";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        hElement: {
            position: "relative",
        },
        button: {
            transform: "translate(4px, -2px)",
        },
    }),
);
/**
 * Replaces <H?> element for table of content
 */
export const TOCMarkdownComponent: FunctionComponent<ITableOfContentsItem> = (item) => {
    const context = useContext(DocumentationContext);

    const classes = styles();

    const [hovered, setHovered] = useState<boolean>(false);

    useEffect(() => {
        context.addTOCItem({ ...item, title: item.children as string });
    }, []);

    const pointerLeave = () => {
        setHovered(false);
    };

    const pointerEnter = () => {
        setHovered(true);
    };

    const getItem = () => {
        switch (item.level) {
            case 0:
                // h1 will be added by me
                return <></>;
            case 1:
                return (
                    <h2 className={classes.hElement} onPointerEnter={pointerEnter} onPointerLeave={pointerLeave} {...item}>
                        {item.children}
                        {hovered && (
                            <IconButton className={classes.button} onClick={copyItem} aria-label={`copy link to ${item.title}`} size="small" color="inherit">
                                <Tooltip title={`Copy link`}>
                                    <LinkIcon></LinkIcon>
                                </Tooltip>
                            </IconButton>
                        )}
                    </h2>
                );
            case 2:
                return (
                    <h3 className={classes.hElement} onPointerEnter={pointerEnter} onPointerLeave={pointerLeave} {...item}>
                        {item.children}
                        {hovered && (
                            <IconButton className={classes.button} onClick={copyItem} aria-label={`copy link to ${item.title}`} size="small" color="inherit">
                                <Tooltip title={`Copy link`}>
                                    <LinkIcon></LinkIcon>
                                </Tooltip>
                            </IconButton>
                        )}
                    </h3>
                );
            case 3:
                return (
                    <h4 className={classes.hElement} onPointerEnter={pointerEnter} onPointerLeave={pointerLeave} {...item}>
                        {item.children}
                    </h4>
                );
            default:
                return <></>;
        }
    };

    const copyItem = () => {
        const url = window.location.href.split("#")[0] + `#${item.id}`;
        navigator.clipboard.writeText(url).then(
            function () {},
            function (err) {},
        );
    };

    return <>{getItem()}</>;
};

export const H1MarkdownComponent: FunctionComponent<ITableOfContentsItem> = (item) => {
    return <TOCMarkdownComponent {...item} level={0}></TOCMarkdownComponent>;
};

export const H2MarkdownComponent: FunctionComponent<ITableOfContentsItem> = (item) => {
    return <TOCMarkdownComponent {...item} level={1}></TOCMarkdownComponent>;
};

export const H3MarkdownComponent: FunctionComponent<ITableOfContentsItem> = (item) => {
    return <TOCMarkdownComponent {...item} level={2}></TOCMarkdownComponent>;
};

export const H4MarkdownComponent: FunctionComponent<ITableOfContentsItem> = (item) => {
    return <TOCMarkdownComponent {...item} level={3}></TOCMarkdownComponent>;
};
