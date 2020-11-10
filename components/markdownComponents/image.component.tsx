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
    const [height, setHeight] = useState<number>(0);
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
                        try {
                            const imgTag = e.target as HTMLImageElement;
                            const height = imgTag.naturalHeight * imgTag.clientWidth / imgTag.naturalWidth;
                            setHeight(height);
                        } catch (e) {
                            //no-op
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
        <div style={{ height: height ?? "100%" }} className={classes.imageWrapper}>
            {getImage()}
            {props.caption && <span className={classes.caption}>{props.caption}</span>}
        </div>
    );
};
