import { CssBaseline, useMediaQuery, createTheme, PaletteMode, ThemeProvider } from "@mui/material";
import { useState, useEffect, useMemo, FunctionComponent, PropsWithChildren } from "react";
import { getDesignTokens } from "../styles/theme";
import { ColorModeContext } from "./_app";

const THEME_PREFERENCE = "theme";
export const ToggleColorMode: FunctionComponent<PropsWithChildren<{}>> = ({ children }) => {
    const prefersLightMode = useMediaQuery("(prefers-color-scheme: light)");
    // The static HTML and first client render must use the same theme.
    const [mode, setMode] = useState<PaletteMode>("dark");
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

    useEffect(() => {
        const savedUserPreference = localStorage.getItem(THEME_PREFERENCE);
        setMode(savedUserPreference === "light" || savedUserPreference === "dark" ? savedUserPreference : prefersLightMode ? "light" : "dark");
    }, [prefersLightMode]);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", mode);
    }, [mode]);

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
