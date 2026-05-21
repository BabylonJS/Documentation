import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, useTheme } from "@mui/material";
import { Dispatch, FunctionComponent, SetStateAction } from "react";

import { ExamplesComponent } from "../../components/contentComponents/example.component";
import { IExampleLink } from "../../lib/content.interfaces";
import styles from "../../pages/documentationPage.module.scss";

export const DocsExamplesPanel: FunctionComponent<{ exampleLinks: IExampleLink[]; examplesCollapsed: boolean; setExamplesCollapsed: Dispatch<SetStateAction<boolean>> }> = ({ exampleLinks, examplesCollapsed, setExamplesCollapsed }) => {
    const theme = useTheme();

    if (exampleLinks.length === 0) {
        return null;
    }

    return (
        <>
            <Box
                sx={{
                    display: { xs: "none", sm: "flex" },
                    position: "absolute",
                    right: examplesCollapsed ? 0 : 280,
                    top: 16,
                    transition: "right 0.2s ease",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: theme.customPalette.examples.backgroundColor,
                    borderRadius: "4px 0 0 4px",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRight: "none",
                    padding: "4px 0",
                    "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                    },
                    zIndex: 2,
                }}
                onClick={() => setExamplesCollapsed(!examplesCollapsed)}
                title={examplesCollapsed ? "Show examples" : "Hide examples"}
            >
                {examplesCollapsed ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
            </Box>
            <Box
                sx={{
                    backgroundColor: theme.customPalette.examples.backgroundColor,
                    transition: "width 0.2s ease, min-width 0.2s ease",
                    ...(examplesCollapsed && {
                        width: "0px !important",
                        minWidth: "0px !important",
                        overflow: "hidden",
                    }),
                }}
                className={[styles["examples-container"]].join(" ")}
            >
                <ExamplesComponent examples={exampleLinks}></ExamplesComponent>
            </Box>
        </>
    );
};
