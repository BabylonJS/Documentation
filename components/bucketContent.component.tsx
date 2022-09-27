import { FunctionComponent } from "react";
import { IDocumentationPageProps } from "../lib/content.interfaces";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "../lib/frontendUtils/frontendTools";

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
            height: 160,
            minHeight: 160,

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
        root: {
            display: "flex",
            height: "100%",
            cursor: "pointer",
        },
        details: {
            display: "flex",
            flexDirection: "column",
            width: "50% !important",
            flex: 1,
        },
        content: {
            flex: "1 0 auto",
        },
        imageContainer: {
            minHeight: "100%",
            cursor: "pointer",
            display: "inline-block",
            overflow: "hidden",
            position: "relative",
            minWidth: "150px !important",
            width: "unset !important",
            "& img": {
                pointerEvents: "none",
                position: "absolute",
                minWidth: "100%",
                minHeight: "100%",
                objectFit: "cover",
            },
        },
    }),
);

interface IBucketItem {
    title: string;
    imageUrl: string;
    link: string;
    description: string;
}

const SingleBucketItem: FunctionComponent<IBucketItem> = ({ link, title, imageUrl, description }: IBucketItem) => {
    const classes = useStyles();
    return (
        <Link key={link} href={link}>
            <a className={classes.divRoot}>
                <Card className={classes.root}>
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography component="h6" variant="h6">
                                {title}
                            </Typography>
                            <Typography style={{}} variant="subtitle1" color="textSecondary" title={title}>
                                {description}
                            </Typography>
                        </CardContent>
                    </div>
                    <div className={classes.imageContainer}>
                        <Image alt={title} src={imageUrl} layout="fill"></Image>
                    </div>
                </Card>
            </a>
        </Link>
    );
};

export const BucketContent: FunctionComponent<IBucketContentProps> = ({ childPages, title = "Coming next", externalLinks }) => {
    const classes = useStyles();
    const bucketItems: IBucketItem[] = Object.keys(childPages || []).map((child) => {
        const childData = childPages[child].metadata;
        const title = (childData.title || child).replace(/_/g, " ");
        const link = "/" + childPages[child].id.join("/");
        const imageUrl = getImageUrl(childData.imageUrl);
        return { title, link, imageUrl, description: childData.description };
    });
    return (
        <>
            {(!!bucketItems.length || (externalLinks && !!externalLinks.length)) && (
                <>
                    <Typography className={classes.h2} component="h2" variant="h2">
                        {title}
                    </Typography>
                    {!!bucketItems.length && (
                        <div className={classes.container}>
                            {bucketItems.map((child, idx) => {
                                return <SingleBucketItem key={idx} {...child} />;
                            })}
                        </div>
                    )}
                    {externalLinks && (
                        <ul>
                            {externalLinks.map(({ url, title }) => {
                                return (
                                    <li key={url}>
                                        <Link href={url}>
                                            <a rel="noopener" target="_blank">
                                                {title}
                                            </a>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </>
            )}
        </>
    );
};
