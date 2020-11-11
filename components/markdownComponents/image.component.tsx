import { FunctionComponent, useState } from "react";
import { IImageEmbed } from "../../lib/content.interfaces";
import Image from "next/image";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        imageWrapper: {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            maxWidth: 800,
            height: "100%",
        },
        image: {
            flex: 1,
        },
        caption: {
            fontSize: 12,
        },
    }),
);

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const ImageMarkdownComponent: FunctionComponent<IImageEmbed> = (props) => {
    const [containerScale, setContainerScale] = useState<{ w: number; h: number }>({ h: 0, w: 0 });
    const classes = styles();
    const getImage = () => {
        if (props.src.startsWith("http") || props.src.startsWith("//") || props.src.indexOf(".gif") !== -1) {
            return <img className={classes.image} {...props} />;
        }
        const properties: IImageEmbed = { ...props };
        if (!props.width || !props.height) {
            // properties.unsized = true;
            properties.layout = "fill";
            // return <img className={classes.image} {...props} />;
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
                                if(imgTag.naturalWidth > imgTag.clientWidth) {
                                    h = h * imgTag.clientWidth / w;
                                    w = imgTag.clientWidth;
                                }
                                setContainerScale({ h, w });
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
        <div style={{ height: containerScale.h !== 0 ? containerScale.h : "100%", maxWidth: containerScale.w !== 0 ? containerScale.w : "800px" }} className={classes.imageWrapper}>
            {getImage()}
            {props.caption && <span className={classes.caption}>{props.caption}</span>}
        </div>
    );
};
