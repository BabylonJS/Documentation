import { createStyles, IconButton, makeStyles, Theme, Tooltip, Typography } from "@material-ui/core";
import { FunctionComponent, useContext, useEffect } from "react";
import { IExampleLink } from "../../lib/content.interfaces";
import { getExampleLink } from "../../lib/frontendUtils/frontendTools";

import CloseIcon from "@material-ui/icons/Close";
import { DocumentationContext } from "../../pages/[...id]";

const styles = makeStyles((theme: Theme) =>
    createStyles({
        iframeContainer: {
            position: "relative",
            // transition: "height 0.4s",
            height: "100%",
        },
        closeButton: {
            position: "absolute",
            backgroundColor: "white",
            right: 8,
            top: 8,
            "&:hover" : {
                backgroundColor: "white",
            }
        },
        loading: {
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: -1,
            transform: "translate(-50%, -50%)",
            lineHeight: "unset",
        },
    }),
);

export const InlineExampleComponent: FunctionComponent<IExampleLink> = (example) => {
    const context = useContext(DocumentationContext);
    const show = example && typeof example.id === "string";
    const classes = styles();
    const link = show && getExampleLink(example);
    return (
        <div className={classes.iframeContainer} style={{ height: show ? 400 : 0 }}>
            {show && (
                <div className={classes.iframeContainer}>
                    <IconButton className={classes.closeButton} onClick={() => context.setActiveExample(null)} aria-label="Show playground" size="medium" color="inherit">
                        <Tooltip title={`Close playground`}>
                            <CloseIcon></CloseIcon>
                        </Tooltip>
                    </IconButton>
                    <Typography className={classes.loading} variant="h4" noWrap>
                        Loading {example.title}...
                    </Typography>
                    <iframe height="100%" width="100%" src={link}></iframe>
                </div>
            )}
        </div>
    );
};
