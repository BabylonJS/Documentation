import { Card, CardContent, createStyles, IconButton, makeStyles, Theme, Tooltip, Typography } from "@material-ui/core";
import { FunctionComponent, useContext, useState } from "react";
import { ITableOfContentsItem } from "../../lib/content.interfaces";
import { DocumentationContext } from "../../pages/[...id]";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        contentRoot: {
            paddingBottom: 16,
            width: 280,
            maxWidth: 280
        },
        itemsContainer: {
            position: "relative",
            transition: "max-height 0.2s",
            maxHeight: 0,
            maxWidth: 300,
            marginRight: -16,
            marginLeft: 16,
            overflow: 'hidden',
            "& div": {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }
        },
        itemsHovered: {
            overflow: 'auto',
            transition: "max-height 0.2s",
            maxHeight: 600,
            height: 'auto',
        },
        hoverButton: {
            position: "absolute",
            backgroundColor: "white",
            right: 8,
            top: 8,
        },
        loading: {
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: -1,
            transform: "translate(-50%, -50%)",
            lineHeight: "unset",
        },
    }),
);

export const TableOfContent: FunctionComponent<{ tocItems: ITableOfContentsItem[] }> = ({ tocItems }) => {
    const [hovered, setHovered] = useState<boolean>(true);
    const context = useContext(DocumentationContext);
    const classes = styles();

    const pointerEnter = () => {
        setHovered(true);
    };

    const pointerLeave = () => {
        setHovered(false);
    };
    return (
        <Card>
            <CardContent className={classes.contentRoot} onPointerEnter={pointerEnter} onPointerLeave={pointerLeave}>
                <Typography gutterBottom variant="h5" component="h2">
                    Table Of Contents
                </Typography>
                <Typography className={`${classes.itemsContainer} ${hovered ? classes.itemsHovered : ""}`} variant="body2" color="textSecondary" component="div">
                    {tocItems.map((item, idx) => (
                        <a href={`#${item.id}`}>
                            <div style={{marginLeft: item.level * 12 }} key={idx} className={item.id === (context.activeTOCItem && context.activeTOCItem.id) ? "active" : ""}>
                                {item.title}
                            </div>
                        </a>
                    ))}
                </Typography>
            </CardContent>
        </Card>
    );
};
