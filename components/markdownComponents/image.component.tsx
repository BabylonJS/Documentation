import Image from "next/image";
import { FunctionComponent, useEffect, useRef, useState, useContext } from "react";
import { Button, Modal, Card, Fade, Hidden, IconButton, Box, useTheme, styled } from "@mui/material";
import { IImageEmbed } from "../../lib/content.interfaces";
import { throttle } from "../../lib/frontendUtils/frontendTools";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import CloseIcon from "@mui/icons-material/Close";
import { BaseUrlContext } from "../../pages/_app";

const StylesImg = styled("img")(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    flexGrow: "1",
    transition: ".5s ease",
    backfaceVisibility: "hidden",
}));

const StyledImage = styled(Image)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    flexGrow: "1",
    transition: ".5s ease",
    backfaceVisibility: "hidden",
}));

const StyledModalImage = styled("img")(({ theme }) => ({
    objectFit: "contain",
    width: "100%",
    height: "auto",
    maxHeight: "100%",
}));

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const ImageMarkdownComponent: FunctionComponent<IImageEmbed> = (props) => {
    const getQueryParams = (rawSrc: string) => {
        let src = rawSrc;
        let expandable = true;
        if (src.includes("?")) {
            let split = src.split("?");
            src = split[0];
            const params = new URLSearchParams(split[1]);
            expandable = params.get("expandable") === "true" || params.get("expandable") === undefined;
        }
        return {
            src,
            expandable,
        };
    };
    const eidx = props.src.lastIndexOf("!");
    let [src, imgProps] = eidx < 0 ? [props.src, undefined] : [props.src.substring(0, eidx), props.src.substring(eidx + 1)];
    if (imgProps) {
        if (!imgProps.match(/^\d+(x\d+)?$/)) {
            src = props.src;
            imgProps = undefined;
        }
    }
    let queryParams = getQueryParams(src);
    src = queryParams.src;
    const preW = imgProps && decodeURI(imgProps).split("x")[0];
    const preH = imgProps && decodeURI(imgProps).split("x")[1];
    const [containerScale, setContainerScale] = useState<{ w: number; h: number }>({ h: 0, w: 0 });
    const [intrinsic, setIntrinsic] = useState<{ w: number; h: number }>({ h: 0, w: 0 });
    const theme = useTheme();
    const baseUrl = useContext(BaseUrlContext);
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
            return <StylesImg {...props} src={baseUrl + src} style={style} />;
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
                <StyledImage
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
                    {...properties}
                    src={baseUrl + src}
                ></StyledImage>
            );
        } catch (e) {
            return <StylesImg {...props} src={baseUrl+ src} />;
        }
    };
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Modal
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    [theme.breakpoints.up("md")]: {
                        margin: "5rem 12rem",
                    },
                }}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                aria-labelledby="server-modal-title"
                aria-describedby="server-modal-description"
            >
                <Fade in={isOpen}>
                    <Card
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "end",
                                justifyContent: "end",
                            }}
                        >
                            <IconButton onClick={() => setIsOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "90%",
                                padding: "0 0.5rem 0.5rem 0.5rem",
                            }}
                        >
                            <StyledModalImage {...props} src={baseUrl + src} />
                        </Box>
                    </Card>
                </Fade>
            </Modal>
            <Box
                component="span"
                sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "100%",
                    height: "auto",
                    margin: theme.spacing(2, 0),
                    [theme.breakpoints.up("sm")]: {
                        maxWidth: "800px",
                    },
                    ...(queryParams.expandable
                        ? {
                              [theme.breakpoints.up("sm")]: {
                                  "& > img": {
                                      boxShadow: theme.shadows[3],
                                  },
                                  "&:hover": {
                                      "& > img": {
                                          opacity: 0.3,
                                      },
                                      "& > span": {
                                          opacity: 1,
                                      },
                                  },
                              },
                          }
                        : {}),
                }}
                ref={containerRef}
                style={{ height: containerScale.h !== 0 ? containerScale.h : "auto", width: containerScale.w !== 0 ? containerScale.w : "100%" }}
            >
                {getImage()}
                {queryParams.expandable && (
                    <Hidden smDown>
                        <Box
                            component="span"
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                textAlign: "center",
                                transition: ".5s ease",
                                backfaceVisibility: "hidden",
                                opacity: 0,
                            }}
                        >
                            <Button
                                sx={{
                                    minWidth: "6.6rem",
                                }}
                                size="small"
                                variant="outlined"
                                onClick={() => setIsOpen(true)}
                            >
                                <span style={{ marginRight: "0.5rem" }}>Expand</span>
                                <ZoomOutMapIcon sx={{ fontSize: "1rem" }} />
                            </Button>
                        </Box>
                    </Hidden>
                )}
            </Box>
            {props.caption && (
                <Box
                    component="span"
                    sx={{
                        fontSize: "12px",
                        display: "block",
                        marginBottom: theme.spacing(2),
                    }}
                >
                    {props.caption}
                </Box>
            )}
        </>
    );
};
