import { FunctionComponent } from "react";
import { IDocumentationPageProps } from "../lib/content.interfaces";
import { Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { YoutubeComponent } from "./markdownComponents/media.component";

export interface IBucketContentProps {
    childPages?: {
        [key: string]: IDocumentationPageProps;
    };
    title?: string;
    externalLinks?: { title: string; url: string }[];
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        h2: {
            borderTop: "1px black solid",
            marginTop: "50px !important",
            paddingTop: theme.spacing(2),
        },
        container: {
            display: "flex",
            flexWrap: "wrap",
            maxWidth: "100%",
        },
        divRoot: {
            padding: 16,
            width: '100%',
            [theme.breakpoints.up("sm")]: {
                width: "50% !important",
            },
            [theme.breakpoints.up("lg")]: {
                width: "33% !important",
            },
            [theme.breakpoints.up("xl")]: {
                width: "25% !important",
            },
        },
    }),
);

export const VideoCollection: FunctionComponent<{ videoLinks: Array<string | { url: string; title: string }> }> = ({ videoLinks }) => {
    const classes = useStyles();
    const isYoutube = (url: string) => {
        if (url.indexOf("youtu.be") !== -1) {
            return url.split("youtu.be/")[1];
        } else if (url.indexOf("youtube.com")) {
            return url.split("v=")[1];
        }
        return "";
    };
    return (
        <>
            <Typography className={classes.h2} component="h2" variant="h2">
                Related videos
            </Typography>
            <div className={classes.container}>
                {videoLinks &&
                    videoLinks.length &&
                    videoLinks.map((item) => {
                        const url = typeof item === "string" ? item : item.url;
                        const youtube = isYoutube(url);
                        if (youtube)
                            return (
                                <div className={classes.divRoot} key={youtube}>
                                    {!!youtube && <YoutubeComponent id={youtube} type="youtube"></YoutubeComponent>}
                                    {/* {!youtube && <MediaMarkdownComponent id={url} type="file"></MediaMarkdownComponent>} */}
                                </div>
                            );
                    })}
            </div>
        </>
    );
};
