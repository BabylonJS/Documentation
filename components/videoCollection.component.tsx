import { FunctionComponent } from "react";
import { IDocumentationPageProps } from "../lib/content.interfaces";
import { Typography, useTheme } from "@mui/material";

import { YoutubeComponent } from "./markdownComponents/media.component";
import { Box } from "@mui/system";

export interface IBucketContentProps {
    childPages?: {
        [key: string]: IDocumentationPageProps;
    };
    title?: string;
    externalLinks?: { title: string; url: string }[];
}

export const VideoCollection: FunctionComponent<{ videoLinks: Array<string | { url: string; title: string }> }> = ({ videoLinks }) => {
    const theme = useTheme();
    const isYoutube = (url: string) => {
        if (url.indexOf("youtu.be/") !== -1) {
            return url.split("youtu.be/")[1];
        } else if (url.indexOf("youtube.com/")) {
            return url.split("v=")[1];
        }
        return "";
    };
    return (
        <>
            <Typography
                sx={{
                    borderTop: "1px black solid",
                    marginTop: "50px !important",
                    paddingTop: theme.spacing(2),
                }}
                component="h2"
                variant="h2"
            >
                Related videos
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    maxWidth: "100%",
                }}
            >
                {videoLinks &&
                    videoLinks.length &&
                    videoLinks.map((item) => {
                        const url = typeof item === "string" ? item : item.url;
                        const youtube = isYoutube(url);
                        if (youtube)
                            return (
                                <Box
                                    sx={{
                                        padding: 16,
                                        width: "100%",
                                        [theme.breakpoints.up("sm")]: {
                                            width: "50% !important",
                                        },
                                        [theme.breakpoints.up("lg")]: {
                                            width: "33% !important",
                                        },
                                        [theme.breakpoints.up("xl")]: {
                                            width: "25% !important",
                                        },
                                    }}
                                    key={youtube}
                                >
                                    {!!youtube && <YoutubeComponent id={youtube} type="youtube"></YoutubeComponent>}
                                    {/* {!youtube && <MediaMarkdownComponent id={url} type="file"></MediaMarkdownComponent>} */}
                                </Box>
                            );
                    })}
            </Box>
        </>
    );
};
