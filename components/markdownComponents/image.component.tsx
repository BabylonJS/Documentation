import { FunctionComponent } from "react";
import { IImageEmbed } from "../../lib/content.interfaces";
import Image from "next/image";

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const ImageMarkdownComponent: FunctionComponent<IImageEmbed> = (props) => {
    if (props.src.startsWith("http") || props.src.startsWith("//")) {
        return <img {...props} />;
    }
    const properties: IImageEmbed = { ...props };
    if (!props.width || !props.height) {
        properties.unsized = true;
        properties.layout = "fill";
    }
    try {
        return <Image {...properties}></Image>;
    } catch (e) {
        return <img {...props} />;
    }
};
