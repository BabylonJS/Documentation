import { PaletteMode } from "@mui/material"

declare module '@mui/material/styles' {
    interface Theme {
        customPalette: CustomPaletteOptions
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        customPalette?: CustomPaletteOptions
    }
}


type CustomPaletteOptions = {
    footer: string
    header: string
    background: string
    container: string
    linkText: string
    menuLinkText: string
    regularSideText: string
    linkHover: string
    buttonHover: string
    menuHover1: string
    menuHover2: string
    text: string
    sidebarBackground: string
}
const lightModePalette: CustomPaletteOptions = {
    footer: "#151221",
    header: "#201936",
    background: "#2A2342",
    container: "#3F3461",
    linkText: "#9379E6 ",
    menuLinkText: "#272320 ",
    regularSideText: "#6E6259",
    linkHover: "#BFABFF",
    buttonHover: "#BB464B",
    menuHover1: "#E0684B",
    menuHover2: "#FF7656",
    text: "#D5D2CA",
    sidebarBackground: "#E0DED8",
}

const darkModePalette: CustomPaletteOptions = {
    footer: "#151221",
    header: "#201936",
    background: "#2A2342",
    container: "#3F3461",
    linkText: "#9379E6 ",
    menuLinkText: "#272320 ",
    regularSideText: "#6E6259",
    linkHover: "#BFABFF",
    buttonHover: "#BB464B",
    menuHover1: "#E0684B",
    menuHover2: "#FF7656",
    text: "#D5D2CA",
    sidebarBackground: "#E0DED8",
}
  
export const getDesignTokens = (mode: PaletteMode) => {
    const customPalette  = mode === 'light' ? lightModePalette : darkModePalette;
    return {
        palette: {
            mode,
            primary: {
                main: customPalette.menuHover1,
            },
            typography: {
                fontFamily: ["acumin-pro", "Helvetica Neue", "Arial", "sans-serif"].join(","),
                fontSize: 16
            },
        },
        customPalette,
    }
}