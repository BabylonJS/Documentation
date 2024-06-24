import { Box, Typography, useTheme } from "@mui/material";
import { FunctionComponent, useContext, useState } from "react";
import { ITableOfContentsItem } from "../../lib/content.interfaces";
import { DocumentationContext } from "../../pages/[...id]";

export const TableOfContent: FunctionComponent<{ tocItems: ITableOfContentsItem[]; levels: number }> = ({ tocItems, levels }) => {
    // To commented-out lines in this file are for future use.

    const [hovered, setHovered] = useState<boolean>(false);
    const [clicked, setClicked] = useState<boolean>(false);
    const [fullHeight] = useState<boolean>(true);
    const [show] = useState<boolean>(true);
    const [_, setDelayed] = useState<number>(0);
    const context = useContext(DocumentationContext);
    const theme = useTheme();

    const pointerEnter = () => {
        setHovered(true);
    };

    const pointerLeave = () => {
        setHovered(false);
    };

    const pointerClick = () => {
        setClicked(true);
    };

    const disableClick = () => {
        setClicked(false);
        setDelayed(5);
    };

    // const onScroll = () => {
    //     if (delayed > 0) {
    //         setDelayed(delayed - 1);
    //     }
    // };

    // useEffect(() => {
    //     if (delayed === 5) {
    //         setShow(false);
    //     }
    //     if (delayed === 0) {
    //         setShow(true);
    //     }
    //     const scrollElement = document.querySelector(".markdown-container");
    //     scrollElement.addEventListener("scroll", onScroll);
    //     return () => {
    //         scrollElement.removeEventListener("scroll", onScroll);
    //     };
    // }, [delayed]);

    // useEffect(() => {
    //     const element = document.querySelector("h1");
    //     var observer = new IntersectionObserver(
    //         function (entries) {
    //             if (entries[0].intersectionRatio === 0) {
    //                 setFullHeight(false);
    //             } else if (entries[0].intersectionRatio === 1) {
    //                 setFullHeight(true);
    //             }
    //         },
    //         {
    //             threshold: [0, 1],
    //         },
    //     );

    //     observer.observe(element);

    //     return () => {
    //         observer.unobserve(element);
    //     };
    // }, [tocItems]);

    return (
        <Box
            sx={{
                background: theme.customPalette.tableOfContent.background,
                zIndex: 100,
                width: "unset !important",
                "& h2": {
                    marginBottom: 0,
                    fontSize: "20px",
                },
                [theme.breakpoints.up("md")]: {
                    "& h2": {
                        fontSize: "1.4rem",
                    },
                },
            }}
            style={{ display: show ? "block" : "none" }}
            onPointerEnter={pointerEnter}
            onPointerLeave={pointerLeave}
        >
            <Typography onClick={pointerClick} variant="h6" component="h3">
                Table Of Contents
            </Typography>
            <Typography
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    position: "relative",
                    // transition: "max-height 0.2s",
                    // maxHeight: 0,
                    overflow: "hidden",
                    "& div": {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: 16,
                    },
                    ...(fullHeight
                        ? {
                              overflow: "auto",
                              // transition: "max-height 0.2s",
                              // maxHeight: "2000px",
                              height: "auto",
                              paddingBottom: "16px",
                          }
                        : hovered || clicked
                        ? {
                              overflow: "auto",
                              // transition: "max-height 0.2s",
                              maxHeight: "400px",
                              height: "auto",
                              paddingBottom: "16px",
                          }
                        : {}),
                }}
                variant="body2"
                color="textSecondary"
                component="div"
            >
                {tocItems
                    .filter((item) => {
                        return item.level <= levels;
                    })
                    .map((item, idx) => (
                        <a key={idx} href={`#${item.id}`}>
                            <div onClick={disableClick} style={{ marginLeft: item.level * 16, display: "inline" }} className={item.id === (context.activeTOCItem && context.activeTOCItem.id) ? "active" : ""}>
                                {item.title}
                            </div>
                        </a>
                    ))}
            </Typography>
        </Box>
    );
};
