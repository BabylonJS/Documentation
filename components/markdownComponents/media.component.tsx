import { createStyles, IconButton, makeStyles, Theme, Tooltip } from "@material-ui/core";
import { FunctionComponent, useContext, useEffect } from "react";
import { DocumentationContext } from "../../pages/[...id]";

import LinkIcon from "@material-ui/icons/Link";
import { IExampleLink, IMediaEmbed } from "../../lib/content.interfaces";
import { colorPalette } from "../../styles/theme";

// reduce package size
import YoutubePlayer from "react-player/youtube";
import FilePlayer from "react-player/file";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        linkContainer: {
            cursor: "pointer",
            backgroundColor: colorPalette.linkText,
            display: "inline-flex",
            marginRight: theme.spacing(0.5),
            marginTop: theme.spacing(0.5),
            justifyContent: "space-between",
            alignItems: "center",
            width: "auto",
            color: "white",
            "& span": {
                marginRight: theme.spacing(1),
            },
            "& span:first-child": {
                marginLeft: theme.spacing(1),
            },
            "& svg": {
                marginTop: theme.spacing(0.5),
            },
        },
    }),
);

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
