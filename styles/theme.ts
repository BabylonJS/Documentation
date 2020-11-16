import { createMuiTheme } from "@material-ui/core/styles";

export const colorPalette = {
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
};
export const theme = createMuiTheme({
    palette: {
        // primary: {
        //     main: purple[500],
        // },
        // secondary: {
        //     main: green[500],
        // },
    },
    typography: {
        fontFamily: ["acumin-pro", "Helvetica Neue", "Arial", "sans-serif"].join(","),
        fontSize: 16
    },
});
