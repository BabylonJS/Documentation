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

type CustomPaletteOptions = StaticCustomPaletteOptions & ModeCustomPaletteOptions

type StaticCustomPaletteOptions = {
    footer: string
    header: string
    background: string
    container: string
    linkText: string
    menuLinkText: string
    regularSideText: string
    linkHover: string
    buttonHover: string
    text: string
    sideMenu: {
        menuItemHoverColor: string
    }
}
const unchangedModePalette: StaticCustomPaletteOptions = {
    footer: "#151221",
    header: "#201936",
    background: "#2A2342",
    container: "#3F3461",
    linkText: "#9379E6",
    menuLinkText: "#272320",
    regularSideText: "#6E6259",
    linkHover: "#BFABFF",
    buttonHover: "#BB464B",
    text: "#D5D2CA",
    sideMenu: {
        menuItemHoverColor: "#E0684B"
    }
}

type ModeCustomPaletteOptions = {
    tableOfContent: {
        background: string
    }
    sideMenu: {
        poweredByBackgroundColor: string
        backgroundColor: string
    }
}
const lightModePalette: ModeCustomPaletteOptions = {
    tableOfContent: {
        background: "#FAFAFA"
    },
    sideMenu: {
        poweredByBackgroundColor: "#FFFFFF",
        backgroundColor: "#E0DED8",
    }
}

const darkModePalette: ModeCustomPaletteOptions = {
    tableOfContent: {
        background: "#1B1B1B"
    },
    sideMenu: {
        poweredByBackgroundColor: "#000000",
        backgroundColor: "#0D0D0D",
    }
}
  
export const getDesignTokens = (mode: PaletteMode) => {
    const modePalette = mode === 'light' ? lightModePalette : darkModePalette;
    return {
        palette: {
            mode,
            primary: {
                main: unchangedModePalette.sideMenu.menuItemHoverColor,
                text: {
                    primary: "red"
                }
            },
            typography: {
                fontFamily: ["acumin-pro", "Helvetica Neue", "Arial", "sans-serif"].join(","),
                fontSize: 16
            },
        },
        customPalette: {
            ...unchangedModePalette,
            ...modePalette,
            sideMenu: {
                ...unchangedModePalette.sideMenu,
                ...modePalette.sideMenu,
            }
        }
    }
}