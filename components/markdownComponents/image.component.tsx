import Image from "next/image";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { IImageEmbed } from "../../lib/content.interfaces";
import { throttle } from "../../lib/frontendUtils/frontendTools";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        // Used for the <div> surrounding the <Image> (or <img>)
        // which provides its size.
        imageWrapper: {
            position: "relative",
            // display: "flex",
            flexDirection: "column",
            maxWidth: 800,
            height: "auto",
            margin: theme.spacing(2, 0),
            display: 'inline-block'
        },

        // Used for the <Image> (or <img>) itself.
        image: {
            flex: 1,
            width: '100%'
        },

        // Used for the caption <div> below the image, if there is one.
        caption: {
            fontSize: 12,
            display: "block",
        },
    }),
);

/**
 * Handles <img> elements in markdown content (entered directly or via ![...]).
 * Uses nextjs <Image> (https://nextjs.org/docs/api-reference/next/image) for
 * onsite images (src=/img/...), and ordinary <img> for other links.
 */
export const ImageMarkdownComponent: FunctionComponent<IImageEmbed> = (props) => {
    const [containerScale, setContainerScale] = useState<{ w: number; h: number }>({ h: 0, w: 0 });
    const [intrinsic, setIntrinsic] = useState<{ w: number; h: number }>({ h: 0, w: 0 });
    const classes = styles();
    const containerRef = useRef<HTMLImageElement>();

    const onResize = () => {
        if (intrinsic.h === 0) {
            return;
        }
        let { h, w } = intrinsic;
        const markdownContainer = document.querySelector(".markdown-container") as HTMLDivElement;
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
        if (props.src.startsWith("http") || props.src.startsWith("//") || props.src.indexOf(".gif") !== -1) {
            return <img className={classes.image} {...props} />;
        }
        const properties: IImageEmbed = { ...props };
        if (!props.width || !props.height) {
            properties.layout = "fill";
        }
        try {
            return (
                <Image
                    onLoad={(e) => {
                        if (properties.layout === "fill") {
                            try {
                                const imgTag = e.target as HTMLImageElement;
                                let h = imgTag.naturalHeight;
                                let w = imgTag.naturalWidth;
                                // avoid using the loading gif to calculate size
                                if (imgTag.src.startsWith('data:image/gif;base64')) { return; }
                                if (imgTag.naturalWidth > imgTag.clientWidth) {
                                    h = (h * imgTag.clientWidth) / w;
                                    w = imgTag.clientWidth;
                                }
                                setContainerScale({ h, w });
                                if (intrinsic.h === 0) {
                                    setIntrinsic({ h: imgTag.naturalHeight, w: imgTag.naturalWidth });
                                }
                            } catch (e) {
                                //no-op
                            }
                        }
                    }}
                    className={classes.image}
                    {...properties}
                ></Image>
            );
        } catch (e) {
            return <img className={classes.image} {...props} />;
        }
    };

    return (
        <>
            <div ref={containerRef} style={{ height: containerScale.h !== 0 ? containerScale.h : "auto", width: containerScale.w !== 0 ? containerScale.w : "100%" }} className={classes.imageWrapper}>
                {getImage()}
                {props.caption && <div className={classes.caption}>{props.caption}</div>}
            </div>
        </>
    );
};
