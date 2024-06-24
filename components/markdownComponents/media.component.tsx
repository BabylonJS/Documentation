import { FunctionComponent, useEffect, useState } from "react";
import { IMediaEmbed } from "../../lib/content.interfaces";

// reduce package size
import YoutubePlayer from "react-player/youtube";
import FilePlayer from "react-player/file";
import { Box, useTheme } from "@mui/material";

/**
 * Replaces <a> element, mainly for local linking and playground links
 */
export const MediaMarkdownComponent: FunctionComponent<IMediaEmbed> = (props) => {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        setReady(true);
    }, []);
    const theme = useTheme();
    const getPlayer = () => {
        if (props.type === "youtube") {
            return (
                <YoutubePlayer
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                    width="100%"
                    height="100%"
                    controls={!props.noControls}
                    url={`https://www.youtube.com/watch?v=${props.url}`}
                ></YoutubePlayer>
            );
        }
        return (
            <FilePlayer
                width="100%"
                height="100%"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
                controls={!props.noControls}
                url={props.url}
            ></FilePlayer>
        );
    };
    return (
        <>
            {ready && (
                <Box
                    sx={{
                        maxWidth: "800px",
                        maxHeight: "450px",
                        margin: theme.spacing(2, 0),
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            paddingTop: "56.25%",
                        }}
                    >
                        {getPlayer()}
                    </Box>
                </Box>
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
