import { Card, CardContent, createStyles, IconButton, makeStyles, Theme, Tooltip, Typography } from "@material-ui/core";
import { createRef, FunctionComponent, useContext, useEffect, useState } from "react";
import { ITableOfContentsItem } from "../../lib/content.interfaces";
import { DocumentationContext } from "../../pages/[...id]";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        contentRoot: {
            background: "#fafafa",
            zIndex: 100,
            width: "unset !important",
            "& h2": {
                marginBottom: 0,
                fontSize: 26
            },
            [theme.breakpoints.up("md")]: {
                "& h2": {
                    fontSize: '2.827rem'
                },
            }
        },
        itemsContainer: {
            position: "relative",
            transition: "max-height 0.2s",
            maxHeight: 0,
            // paddingBottom: 16,
            overflow: "hidden",
            "& div": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: 16,
            },
        },
        itemsHovered: {
            overflow: "auto",
            transition: "max-height 0.2s",
            maxHeight: 200,
            height: "auto",
            paddingBottom: 16,
        },
    }),
);

export const TableOfContent: FunctionComponent<{ tocItems: ITableOfContentsItem[] }> = ({ tocItems }) => {
    const [hovered, setHovered] = useState<boolean>(false);
    const [clicked, setClicked] = useState<boolean>(true);
    const [show, setShow] = useState<boolean>(true);
    const [delayed, setDelayed] = useState<number>(0);
    const context = useContext(DocumentationContext);
    const classes = styles();

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

    const onScroll = () => {
        if(delayed > 0) {
            setDelayed(delayed - 1);
        }
    };

    useEffect(() => {
        if(delayed === 5) {
            setShow(false);
        }
        if(delayed === 0) {
            setShow(true);
        }
        const scrollElement = document.querySelector(".markdown-container");
        scrollElement.addEventListener("scroll", onScroll);
        return () => {
            scrollElement.removeEventListener("scroll", onScroll);
        };
    }, [delayed])

    useEffect(() => {
        const element = document.querySelector("h1");
        var observer = new IntersectionObserver(
            function (entries) {
                if (entries[0].intersectionRatio === 0) {
                    setClicked(false);
                } else if (entries[0].intersectionRatio === 1) {
                    setClicked(true);
                }
            },
            {
                threshold: [0, 1],
            },
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [tocItems]);

    return (
        <div className={classes.contentRoot} style={{ display: show ? "block" : "none" }} onPointerEnter={pointerEnter} onPointerLeave={pointerLeave}>
            <Typography onClick={pointerClick} variant="h6" component="h3">
                Table Of Contents
            </Typography>
            <Typography className={`${classes.itemsContainer} ${hovered || clicked ? classes.itemsHovered : ""}`} variant="body2" color="textSecondary" component="div">
                {tocItems.map((item, idx) => (
                    <a key={idx} href={`#${item.id}`}>
                        <div onClick={disableClick} style={{ marginLeft: item.level * 16 }} className={item.id === (context.activeTOCItem && context.activeTOCItem.id) ? "active" : ""}>
                            {item.title}
                        </div>
                    </a>
                ))}
            </Typography>
        </div>
    );
};
