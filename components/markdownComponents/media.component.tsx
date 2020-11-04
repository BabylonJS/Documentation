import { FunctionComponent } from "react";
import { IMediaEmbed } from "../../lib/content.interfaces";

// reduce package size
import YoutubePlayer from "react-player/youtube";
import FilePlayer from "react-player/file";

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const MediaMarkdownComponent: FunctionComponent<IMediaEmbed> = (props) => {
    if (props.type === "youtube") {
        return <YoutubePlayer controls={!props.noControls} url={`https://www.youtube.com/watch?v=${props.url}`}></YoutubePlayer>;
    }
    return <FilePlayer controls={!props.noControls} url={props.url}></FilePlayer>;
};

export const YoutubeComponent: FunctionComponent<IMediaEmbed> = (props) => {
    return <MediaMarkdownComponent url={props.id} type="youtube"></MediaMarkdownComponent>;
};

export const MediaFileComponent: FunctionComponent<IMediaEmbed> = (props) => {
    return <MediaMarkdownComponent {...props} type="file"></MediaMarkdownComponent>;
};
