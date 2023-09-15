import { FunctionComponent, PropsWithChildren, useContext, useEffect, useState } from "react";
import { ITableOfContentsItem } from "../../lib/content.interfaces";
import { DocumentationContext } from "../../pages/[...id]";

import LinkIcon from "@mui/icons-material/Link";
import { IconButton, Tooltip, Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        hElement: {
            position: "relative",
        },
        button: {
            transform: "translate(4px, -2px)",
            padding: 1,
            marginLeft: 8,
            height: 20,
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
    const [copyText, setCopyText] = useState<string>("Copy link");

    useEffect(() => {
        context.addTOCItem({ ...item, id: getId(item), title: item.image ? item.title : (item.children as string) });
    }, []);

    const pointerLeave = () => {
        setHovered(false);
    };

    const pointerEnter = () => {
        setHovered(true);
    };

    const getId = (item: PropsWithChildren<ITableOfContentsItem>) => {
        return item.id || item.title.replace(/ /g, "-").toLowerCase();
    };

    const getItem = () => {
        const id = getId(item);
        switch (item.level) {
            case 0:
                // h1 will be added by me
                return <></>;
            case 1:
                return (
                    <>
                        {item.image && <img src={item.image} alt={item.alt || item.title} id={id} />}
                        <h2 className={classes.hElement} onPointerEnter={pointerEnter} onPointerLeave={pointerLeave} {...item} id={item.image ? null : id}>
                            {item.children}
                            {item.image && item.title}
                            {hovered && (
                                <IconButton className={classes.button} onClick={copyItem} aria-label={`copy link to ${item.title}`} size="small" color="inherit">
                                    <Tooltip title={copyText}>
                                        <LinkIcon></LinkIcon>
                                    </Tooltip>
                                </IconButton>
                            )}
                        </h2>
                    </>
                );
            case 2:
                return (
                    <>
                        {item.image && <img src={item.image} alt={item.alt || item.title} id={id} />}
                        <h3 className={classes.hElement} onPointerEnter={pointerEnter} onPointerLeave={pointerLeave} {...item} id={item.image ? null : id}>
                            {item.children}
                            {hovered && (
                                <IconButton className={classes.button} onClick={copyItem} aria-label={`copy link to ${item.title}`} size="small" color="inherit">
                                    <Tooltip title={copyText}>
                                        <LinkIcon></LinkIcon>
                                    </Tooltip>
                                </IconButton>
                            )}
                        </h3>
                    </>
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
        const url = window.location.href.split("#")[0] + `#${getId(item)}`;
        navigator.clipboard.writeText(url).then(
            function () {},
            function (err) {},
        );
        setCopyText("Link copied");

        setTimeout(() => {
            setCopyText("Copy link");
        }, 2000);
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
