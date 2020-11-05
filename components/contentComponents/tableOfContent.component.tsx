import { Card, CardContent, createStyles, IconButton, makeStyles, Theme, Tooltip, Typography } from "@material-ui/core";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { ITableOfContentsItem } from "../../lib/content.interfaces";
import { DocumentationContext } from "../../pages/[...id]";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        contentRoot: {
            background: "#fafafa",
            zIndex: 100,
            width: 'unset !important',
            "& h2": {
                marginBottom: 0,
            },
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
                fontSize: 16
            },
        },
        itemsHovered: {
            overflow: "auto",
            transition: "max-height 0.2s",
            maxHeight: 200,
            height: "auto",
            paddingBottom: 16
        },
    }),
);

export const TableOfContent: FunctionComponent<{ tocItems: ITableOfContentsItem[] }> = ({ tocItems }) => {
    const [hovered, setHovered] = useState<boolean>(true);
    const [clicked, setClicked] = useState<boolean>(false);
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
        setShow(false);
        setDelayed(5);
    };

    const scrolled = () => {
        if(hovered) {
            setHovered(false);
        }
        if(delayed > 0) {
            setDelayed(delayed - 1);
        }
        if (!show && !delayed) {
            setShow(true);
            setDelayed(5);
        }
    };

    useEffect(() => {
        const element = document.querySelector(".markdown-container");
        element.addEventListener("scroll", scrolled);
        return () => {
            element.removeEventListener("scroll", scrolled);
        };
    }, [delayed]);

    useEffect(() => {
        setHovered(true);
    }, tocItems)
    return (
        // <Card>
        //     <CardContent className={classes.contentRoot} onPointerEnter={pointerEnter} onPointerLeave={pointerLeave}>
        <div className={classes.contentRoot} style={{ display: show ? "block" : "none" }} onPointerEnter={pointerEnter} onPointerLeave={pointerLeave}>
            <Typography onClick={pointerClick} variant="h6" component="h2">
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
        //     </CardContent>
        // </Card>
    );
};
