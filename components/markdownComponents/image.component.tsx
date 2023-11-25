import Image from "next/image";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { IconButton, Theme, Modal, Card, Tooltip, Fade } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { IImageEmbed } from "../../lib/content.interfaces";
import { throttle } from "../../lib/frontendUtils/frontendTools";
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

const styles = makeStyles((theme: Theme) =>
    createStyles({
        imageWrapper: {
            position: "relative",
            flexDirection: "column",
            maxWidth: "100%",
            height: "auto",
            margin: theme.spacing(2, 0),
            display: "inline-block",
            [theme.breakpoints.up("sm")]: {
                maxWidth: 800,
            },
        },
        image: {
            flex: 1,
            width: "100%",
            boxShadow: theme.shadows[3],
            borderRadius: theme.shape.borderRadius * 1
        },
        expandIcon: {
            backgroundColor: theme.palette.primary.light,
            "&:hover": {
                backgroundColor: theme.palette.primary.main
            }
        },
        expandIconContainer: {
            display: "flex",
            width: "100%",
            justifyContent: "end",
            padding: "0.25rem"
        },
        caption: {
            fontSize: 12,
            display: "block",
            marginBottom: theme.spacing(2),
        },
        modalImage: {
            objectFit: "contain",
            width: "100%",
            height: "auto",
            maxHeight: "100%",
            boxShadow: theme.shadows[3]
        },
        modalImageContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "0.5rem",
        },
        modal: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            [theme.breakpoints.up("md")]: {
                margin: "5rem 12rem"
            }
        }
    }),
);

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const ImageMarkdownComponent: FunctionComponent<IImageEmbed> = (props) => {
    const getQueryParams = (rawSrc: string) => {
        let src = rawSrc;
        let expandable = false;
        if(src.includes("?")) {
            let split = src.split("?");
            src = split[0];
            const params = new URLSearchParams(split[1]);
            expandable = params.get('expandable') === "true"
        }
        return {
            src,
            expandable
        }
    }
    const eidx = props.src.lastIndexOf("!");
    let [src, imgProps] = eidx < 0 ? [props.src, undefined] : [props.src.substring(0, eidx), props.src.substring(eidx + 1)];
    if (imgProps) {
        if (!imgProps.match(/^\d+(x\d+)?$/)) {
            src = props.src;
            imgProps = undefined;
        }
    }
    let queryParams = getQueryParams(src)
    src = queryParams.src
    const preW = imgProps && decodeURI(imgProps).split("x")[0];
    const preH = imgProps && decodeURI(imgProps).split("x")[1];
    const [containerScale, setContainerScale] = useState<{ w: number; h: number }>({ h: 0, w: 0 });
    const [intrinsic, setIntrinsic] = useState<{ w: number; h: number }>({ h: 0, w: 0 });
    const classes = styles();
    const containerRef = useRef<HTMLImageElement>();
    const onResize = () => {
        if (intrinsic.h === 0) {
            return;
        }
        let { h, w } = intrinsic;
        const markdownContainer = document.querySelector("#markdown-container") as HTMLDivElement;
        let containerWidth = markdownContainer.clientWidth - 32;
        if (containerWidth > 760) {
            containerWidth = 760;
        }
        if (w > containerWidth) {
            h = (h * containerWidth) / w;
            w = containerWidth;
        }
        setContainerScale({ h, w });
    };
    useEffect(() => {
        if (intrinsic.h === 0) {
            return;
        }
        const resize = throttle(onResize, 100);
        window.addEventListener("resize", resize, false);
        return () => {
            window.removeEventListener("resize", resize);
        };
    }, [intrinsic]);
    const getImage = () => {
        if (src.startsWith("http") || src.startsWith("//") || src.indexOf(".gif") !== -1) {
            let style: { width?: string; height?: string } = {};
            if (preW) {
                style.width = `${Math.min(+preW, 760)}px`;
                if (preH) {
                    style.height = `${+preH}px`;
                }
            }
            return <img className={classes.image} {...props} src={src} style={style} />;
        }
        const properties: IImageEmbed = { ...props };
        if (!properties.width || !properties.height) {
            properties.fill = true;
        } else {
            properties.width = +properties.width;
            properties.height = +properties.height;
        }
        try {
            return (
                <Image
                    unoptimized={true}
                    onLoadingComplete={(e) => {
                        if (properties.fill === true) {
                            try {
                                // const imgTag = e.target as HTMLImageElement;
                                let h = e.naturalHeight;
                                let w = e.naturalWidth;
                                // avoid using the loading gif to calculate size
                                if (src.startsWith("data:image/gif;base64")) {
                                    return;
                                }
                                if (preW) {
                                    w = Math.min(+preW, 760);
                                    if (!preH) {
                                        h = (h * w) / e.naturalWidth;
                                    } else {
                                        h = +preH;
                                    }
                                } else if (e.naturalWidth > containerRef.current.clientWidth) {
                                    h = (h * containerRef.current.clientWidth) / w;
                                    w = containerRef.current.clientWidth;
                                }
                                setContainerScale({ h, w });
                                if (intrinsic.h === 0) {
                                    setIntrinsic({ h: e.naturalHeight, w: e.naturalWidth });
                                }
                            } catch (e) {
                                //no-op
                            }
                        }
                    }}
                    className={classes.image}
                    {...properties}
                    src={src}
                ></Image>
            );
        } catch (e) {
            return <img className={classes.image} {...props} src={src} />;
        }
    };
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <Modal
                className={classes.modal}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                aria-labelledby="server-modal-title"
                aria-describedby="server-modal-description"
            >
                <Fade in={isOpen}>
                    <Card className={classes.modalImageContainer}>
                        <img className={classes.modalImage} {...props} src={src} />
                    </Card>
                </Fade>
            </Modal>
            <span ref={containerRef} style={{ display: "block", height: containerScale.h !== 0 ? containerScale.h : "auto", width: containerScale.w !== 0 ? containerScale.w : "100%" }} className={classes.imageWrapper}>
                {getImage()}
                {queryParams.expandable && (
                    <span className={classes.expandIconContainer}>
                        <Tooltip title="Expand Image">
                            <IconButton
                                className={classes.expandIcon}
                                size="small"
                                onClick={() => setIsOpen(true)}
                            >
                                <ZoomOutMapIcon sx={{fontSize: "1rem"}} />
                            </IconButton>
                        </Tooltip>
                    </span>
                )}
            </span>
            {props.caption && <span className={classes.caption}>{props.caption}</span>}
        </>
    );
};
