import { FunctionComponent, useEffect, useState } from "react";
import { IMediaEmbed } from "../../lib/content.interfaces";

// reduce package size
import YoutubePlayer from "react-player/youtube";
import FilePlayer from "react-player/file";
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

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
    const [ready, setReady] = useState(false);
    useEffect(() => {
        setReady(true);
    }, []);
    const classes = styles();
    const getPlayer = () => {
        if (props.type === "youtube") {
            return <YoutubePlayer width="100%" height="100%" className={classes.player} controls={!props.noControls} url={`https://www.youtube.com/watch?v=${props.url}`}></YoutubePlayer>;
        }
        return <FilePlayer width="100%" height="100%" className={classes.player} controls={!props.noControls} url={props.url}></FilePlayer>;
    };
    return (
        <>
            {ready && (
                <div className={classes.container}>
                    <div className={classes.playerWrapper}>{getPlayer()}</div>
                </div>
            )}
        </>
    );
};

export const YoutubeComponent: FunctionComponent<IMediaEmbed> = (props) => {
    return <MediaMarkdownComponent url={props.id} type="youtube"></MediaMarkdownComponent>;
};

export const MediaFileComponent: FunctionComponent<IMediaEmbed> = (props) => {
    return <MediaMarkdownComponent {...props} type="file"></MediaMarkdownComponent>;
};
