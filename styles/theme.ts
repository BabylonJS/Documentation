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
    linkHover: string
    buttonHover: string
    text: string
    primary: {
        main: string
    },
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
    linkHover: "#BFABFF",
    buttonHover: "#BB464B",
    text: "#D5D2CA",
    primary: {
        main: "#E0684B"
    },
    sideMenu: {
        menuItemHoverColor: "#E0684B"
    }
}

type ModeCustomPaletteOptions = {
    text: {
        primary: string
        secondary: string
    }
    tableOfContent: {
        background: string
    }
    sideMenu: {
        textColor: string
        poweredByBackgroundColor: string
        backgroundColor: string
        selectedMenuItemLinkColor: string
    },
    examples: {
        backgroundColor: string
    }
}
const lightModePalette: ModeCustomPaletteOptions = {
    text: {
        primary: "#000000",
        secondary: "#6E6259"
    },
    tableOfContent: {
        background: "#FAFAFA"
    },
    sideMenu: {
        textColor: "#6E6259",
        poweredByBackgroundColor: "#FFFFFF",
        backgroundColor: "#E0DED8",
        selectedMenuItemLinkColor: "#272320"
    },
    examples: {
        backgroundColor: "#E0DED8",
    }
}

const darkModePalette: ModeCustomPaletteOptions = {
    text: {
        primary: "#FFFFFF",
        secondary: "#9D9D9D"
    },
    tableOfContent: {
        background: "#1B1B1B"
    },
    sideMenu: {
        textColor: "#9D9D9D",
        poweredByBackgroundColor: "#000000",
        backgroundColor: "#0D0D0D",
        selectedMenuItemLinkColor: "#ffffff"
    },
    examples: {
        backgroundColor: "#0D0D0D",
    }
}
  
export const getDesignTokens = (mode: PaletteMode) => {
    const modePalette = mode === 'light' ? lightModePalette : darkModePalette;
    return {
        palette: {
            mode,
            text: {
                primary: modePalette.text.primary,
                secondary: modePalette.text.secondary,
            },
            primary: {
                main: unchangedModePalette.primary.main,
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
        } as CustomPaletteOptions
    }
}