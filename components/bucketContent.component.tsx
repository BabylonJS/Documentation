import { FunctionComponent, useContext } from "react";
import { IDocumentationPageProps } from "../lib/content.interfaces";
import { Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import Link, { LinkProps } from "next/link";
import Image from "next/image";
import { getImageUrl } from "../lib/frontendUtils/frontendTools";
import { BaseUrlContext } from "../pages/_app";

export interface IBucketContentProps {
    childPages?: {
        [key: string]: IDocumentationPageProps;
    };
    title?: string;
    externalLinks?: { title: string; url: string }[];
}

const StyledLink = styled(Link)<LinkProps>(({ theme }) => ({
    padding: 16,
    height: 160,
    minHeight: 160,
    minWidth: 200,
    width: "100%",

    [theme.breakpoints.up("lg")]: {
        width: "50% !important",
    },
    [theme.breakpoints.up("xl")]: {
        width: "33% !important",
    },
}));

const ImageContainer = styled("div")(({ theme }) => ({
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
}));

const DetailsDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "50% !important",
    flex: 1,
}));

interface IBucketItem {
    title: string;
    imageUrl: string;
    link: string;
    description: string;
}

const SingleBucketItem: FunctionComponent<IBucketItem> = ({ link, title, imageUrl, description }: IBucketItem) => {
    const baseUrl = useContext(BaseUrlContext);
    return (
        <StyledLink key={link} href={`${baseUrl}${link}`}>
            <Card
                sx={{
                    display: "flex",
                    height: "100%",
                    cursor: "pointer",
                }}
            >
                <DetailsDiv>
                    <CardContent
                        sx={{
                            flex: "1 0 auto",
                        }}
                    >
                        <Typography component="h6" variant="h6">
                            {title}
                        </Typography>
                        <Typography style={{}} variant="subtitle1" color="textSecondary" title={title}>
                            {description}
                        </Typography>
                    </CardContent>
                </DetailsDiv>
                <ImageContainer>
                    <Image alt={title} src={imageUrl} fill={true}></Image>
                </ImageContainer>
            </Card>
        </StyledLink>
    );
};

const DivContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "100%",
}));

export const BucketContent: FunctionComponent<IBucketContentProps> = ({ childPages, title = "Coming next", externalLinks }) => {
    const baseUrl = useContext(BaseUrlContext);
    const bucketItems: IBucketItem[] = Object.keys(childPages || []).map((child) => {
        const childData = childPages[child].metadata;
        const title = (childData.title || child).replace(/_/g, " ");
        const link = "/" + childPages[child].id.join("/");
        const imageUrl = getImageUrl(childData.imageUrl, baseUrl);
        return { title, link, imageUrl, description: childData.description };
    });
    return (
        <>
            {(!!bucketItems.length || (externalLinks && !!externalLinks.length)) && (
                <>
                    <Typography
                        sx={{
                            borderTop: "1px solid",
                            marginTop: "3.125rem !important",
                            pt: 2, // theme.spacing(2)
                        }}
                        component="h3"
                        variant="h3"
                    >
                        {title}
                    </Typography>
                    {!!bucketItems.length && (
                        <DivContainer>
                            {bucketItems.map((child, idx) => {
                                return <SingleBucketItem key={idx} {...child} />;
                            })}
                        </DivContainer>
                    )}
                    {externalLinks && (
                        <ul>
                            {externalLinks.map(({ url, title }) => {
                                return (
                                    <li key={url}>
                                        <Link href={url} target={"_blank"} rel={"noopener"}>
                                            {title}
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
