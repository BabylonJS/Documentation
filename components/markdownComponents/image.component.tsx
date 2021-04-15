import Image from "next/image";
import { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core";
import { IImageEmbed } from "../../lib/content.interfaces";

const getStyles = makeStyles({
    caption: { fontSize: "80%" },
    figure: { margin: "0" },  // Reset the huge margins from the default style
    image: {
        maxWidth: "800px !important",  // Override 100% in the default style
        verticalAlign: "middle"        // Usually prettier for in-text images
    },
});

/**
 * Handles <img> elements in markdown content (entered directly or via ![...]).
 * Uses nextjs <Image> (https://nextjs.org/docs/api-reference/next/image) or <img>.
 */
export const ImageMarkdownComponent: FunctionComponent<IImageEmbed> = (props) => {
    const styles = getStyles();

    // nextjs <Image> does some nice optimization, BUT
    // - requires image size (width & height)
    // - can't handle arbitrary offsite domains
    // ... so in those cases we fall back to ordinary <img> tag.
    var imageTag;
    if (props.width && props.height &&
        props.src.indexOf("://") <= 0 && props.src.indexOf("//") != 0) {
        imageTag = <Image
            className={styles.image}
            src={props.src}
            alt={props.alt}
            width={props.width}
            height={props.height} />;
    } else {
        imageTag = <img
            className={styles.image}
            src={props.src}
            alt={props.alt}
            width={props.width}
            height={props.height}
            />;
    }

    if (props.caption) {
        return <figure className={styles.figure}>
            {imageTag}
            <figcaption className={styles.caption}>{props.caption}</figcaption>
        </figure>;
    } else {
        return imageTag;
    }
};
