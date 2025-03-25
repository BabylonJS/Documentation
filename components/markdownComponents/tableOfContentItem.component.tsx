import { FunctionComponent, PropsWithChildren, useContext, useEffect, useState } from "react";
import { ITableOfContentsItem } from "../../lib/content.interfaces";
import { DocumentationContext } from "../../pages/[...id]";
import { BaseUrlContext } from "../../pages/_app";

import LinkIcon from "@mui/icons-material/Link";
import { IconButton, Tooltip, Box } from "@mui/material";

/**
 * Replaces <H?> element for table of content
 */
export const TOCMarkdownComponent: FunctionComponent<ITableOfContentsItem> = (item) => {
    const context = useContext(DocumentationContext);

    const [isMobile, setIsMobile] = useState<boolean>(false);

    const [hovered, setHovered] = useState<boolean>(isMobile);
    const [copyText, setCopyText] = useState<string>("Copy link");

    useEffect(() => {
        context.addTOCItem({ ...item, id: getId(item), title: item.image ? item.title : (item.children as string) });
        setIsMobile(typeof window !== "undefined" && "ontouchstart" in window);
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

    const baseUrl = useContext(BaseUrlContext);

    const getItem = () => {
        const id = getId(item);
        switch (item.level) {
            case 0:
                // h1 will be added by me
                return <></>;
            case 1:
                return (
                    <>
                        {item.image && (
                            <div style={{
                                paddingTop: "50px",
                            }}>
                                <img
                                    src={baseUrl + item.image}
                                    alt={item.alt || item.title}
                                    id={id}
                                />
                            </div>
                        )}
                        <Box
                            component="h2"
                            sx={{
                                position: "relative",
                            }}
                            onPointerEnter={pointerEnter}
                            onPointerLeave={pointerLeave}
                            {...item}
                            id={item.image ? null : id}
                        >
                            {item.children}
                            {item.image && item.title}
                            {(hovered || isMobile) && (
                                <IconButton
                                    sx={{
                                        transform: "translate(4px, -2px)",
                                        padding: 1,
                                        marginLeft: 8,
                                        height: 20,
                                    }}
                                    onClick={copyItem}
                                    aria-label={`copy link to ${item.title}`}
                                    size="small"
                                    color="inherit"
                                >
                                    <Tooltip title={copyText}>
                                        <LinkIcon></LinkIcon>
                                    </Tooltip>
                                </IconButton>
                            )}
                        </Box>
                    </>
                );
            case 2:
                return (
                    <>
                        {item.image && (
                            <div style={{
                                paddingTop: "50px",
                            }}>
                                <img
                                    src={baseUrl + item.image}
                                    alt={item.alt || item.title}
                                    id={id}
                                />
                            </div>
                        )}
                        <Box
                            sx={{
                                position: "relative",
                            }}
                            component="h3"
                            onPointerEnter={pointerEnter}
                            onPointerLeave={pointerLeave}
                            {...item}
                            id={item.image ? null : id}
                        >
                            {item.children}
                            {item.image && item.title}
                            {(hovered || isMobile) && (
                                <IconButton
                                    sx={{
                                        transform: "translate(4px, -2px)",
                                        padding: 1,
                                        marginLeft: 8,
                                        height: 20,
                                    }}
                                    onClick={copyItem}
                                    aria-label={`copy link to ${item.title}`}
                                    size="small"
                                    color="inherit"
                                >
                                    <Tooltip title={copyText}>
                                        <LinkIcon></LinkIcon>
                                    </Tooltip>
                                </IconButton>
                            )}
                        </Box>
                    </>
                );
            case 3:
                return (
                    <Box
                        component="h4"
                        sx={{
                            position: "relative",
                        }}
                        onPointerEnter={pointerEnter}
                        onPointerLeave={pointerLeave}
                        {...item}
                    >
                        {item.children}
                    </Box>
                );
            default:
                return <></>;
        }
    };

    const copyItem = () => {
        const url = window.location.href.split("#")[0] + `#${getId(item)}`;
        // note - this might not work when in localhost.
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
