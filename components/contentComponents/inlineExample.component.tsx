import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { IExampleLink } from "../../lib/content.interfaces";
import { getExampleLink } from "../../lib/frontendUtils/frontendTools";

import CloseIcon from "@mui/icons-material/Close";
import { DocumentationContext } from "../../pages/[...id]";

export const InlineExampleComponent: FunctionComponent<IExampleLink> = (example) => {
    const context = useContext(DocumentationContext);
    const id = example && (example.playgroundId || example.id);
    const [show, setShow] = useState<boolean>(typeof id === "string");
    const link = show && getExampleLink(example);
    const onCloseClicked = () => {
        context.setActiveExample(null);
        setShow(false);
    };

    useEffect(() => {
        const id = example && (example.playgroundId || example.id);
        setShow(typeof id === "string");
    }, [example]);
    return (
        <Box
            sx={{
                position: "relative",
                // transition: "height 0.4s",
                height: "100%",
            }}
            style={{ height: show ? 400 : 0 }}
        >
            {show && (
                <Box
                    sx={{
                        position: "relative",
                        // transition: "height 0.4s",
                        height: "100%",
                    }}
                >
                    <IconButton
                        sx={{
                            position: "absolute",
                            backgroundColor: "white",
                            right: 8,
                            top: 8,
                            "&:hover": {
                                backgroundColor: "white",
                            },
                        }}
                        onClick={onCloseClicked}
                        aria-label="Close playground preview"
                        size="medium"
                        color="inherit"
                    >
                        <Tooltip title={`Close playground`}>
                            <CloseIcon></CloseIcon>
                        </Tooltip>
                    </IconButton>
                    <Typography
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            zIndex: -1,
                            transform: "translate(-50%, -50%)",
                            lineHeight: "unset",
                        }}
                        variant="h4"
                        noWrap
                    >
                        Loading {example.title}...
                    </Typography>
                    <iframe height="100%" width="100%" src={link}></iframe>
                </Box>
            )}
        </Box>
    );
};
