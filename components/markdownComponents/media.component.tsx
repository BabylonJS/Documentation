import { FunctionComponent } from "react";
import { IMediaEmbed } from "../../lib/content.interfaces";

// reduce package size
import YoutubePlayer from "react-player/youtube";
import FilePlayer from "react-player/file";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        playerWrapper: {
            position: "relative",
            paddingTop: "56.25%",
        },
        player: {
            position: "absolute",
            top: 0,
            left: 0,
        },
        container: {
            maxWidth: 800,
            maxHeight: 450,
            margin: theme.spacing(2, 0),
        },
    }),
);

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const MediaMarkdownComponent: FunctionComponent<IMediaEmbed> = (props) => {
    const classes = styles();
    const getPlayer = () => {
        if (props.type === "youtube") {
            return <YoutubePlayer width="100%" height="100%" className={classes.player} controls={!props.noControls} url={`https://www.youtube.com/watch?v=${props.url}`}></YoutubePlayer>;
        }
        return <FilePlayer width="100%" height="100%" className={classes.player} controls={!props.noControls} url={props.url}></FilePlayer>;
    };
    return (
        <div className={classes.container}>
            <div className={classes.playerWrapper}>{getPlayer()}</div>
        </div>
    );
};

export const YoutubeComponent: FunctionComponent<IMediaEmbed> = (props) => {
    return <MediaMarkdownComponent url={props.id} type="youtube"></MediaMarkdownComponent>;
};

export const MediaFileComponent: FunctionComponent<IMediaEmbed> = (props) => {
    return <MediaMarkdownComponent {...props} type="file"></MediaMarkdownComponent>;
};
