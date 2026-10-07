import { CssBaseline, ThemeProvider, useColorScheme } from "@mui/material";
import { FunctionComponent, PropsWithChildren } from "react";
import { documentationTheme, themePreferenceKey } from "../styles/theme";
import { ColorModeContext } from "./_app";

const ColorModeProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const { mode, systemMode, setMode } = useColorScheme();
    const colorMode = {
        toggleColorMode: () => {
            const resolvedMode = mode === "system" ? systemMode : mode;
            setMode(resolvedMode === "dark" ? "light" : "dark");
        },
    };

    return <ColorModeContext.Provider value={colorMode}>{children}</ColorModeContext.Provider>;
};

export const ToggleColorMode: FunctionComponent<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <ThemeProvider theme={documentationTheme} defaultMode="system" modeStorageKey={themePreferenceKey} disableTransitionOnChange disableStyleSheetGeneration>
            <ColorModeProvider>
                <CssBaseline enableColorScheme />
                {children}
            </ColorModeProvider>
        </ThemeProvider>
    );
};

export default ToggleColorMode;
