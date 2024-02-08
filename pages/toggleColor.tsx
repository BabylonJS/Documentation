import { CssBaseline, useMediaQuery, createTheme, PaletteMode, ThemeProvider } from "@mui/material";
import { useState, useEffect, useMemo, FunctionComponent, PropsWithChildren } from "react";
import { getDesignTokens } from "../styles/theme";
import { ColorModeContext } from "./_app";

const THEME_PREFERENCE = "theme";
export const ToggleColorMode: FunctionComponent<PropsWithChildren<{}>> = ({ children }) => {
    const prefersLightMode = typeof localStorage !== "undefined" ? localStorage.getItem(THEME_PREFERENCE) === "light" : useMediaQuery("(prefers-color-scheme: light)");
    const [mode, setMode] = useState<PaletteMode>(prefersLightMode ? "light" : "dark");
    const colorMode = {
        // The dark mode switch would invoke this method
        toggleColorMode: () => {
            setMode((prevMode: PaletteMode) => {
                const newMode = prevMode === "light" ? "dark" : "light";
                localStorage.setItem(THEME_PREFERENCE, newMode);
                return newMode;
            });
        },
    };

    // Determine what the first render should be based off localStorage or user preference
    useEffect(() => {
        const savedUserPreference = localStorage.getItem(THEME_PREFERENCE);
        if (savedUserPreference === "light") setMode("light");
        else if (savedUserPreference === "dark") setMode("dark");
    }, []);

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline enableColorScheme />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default ToggleColorMode;
