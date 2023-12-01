import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import Script from "next/script";
import Head from "next/head";
import PropTypes from "prop-types";
import { useEffect } from "react";

import "../styles/globals.scss";
import "./typedoc/apiPage.global.scss";
import { theme } from "../styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <>
            <Head>
                <title>Babylon.js docs</title>
                {/* <script src="https://www.googletagmanager.com/gtag/js?id=G-Q8XDD8TYY2" /> */}
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Component {...pageProps} />
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-Q8XDD8TYY2" />
                <Script id="google-analytics">
                    {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag("js", new Date());
            
                      gtag('config', 'G-Q8XDD8TYY2');
                    `}
                </Script>
            </ThemeProvider>
        </>
    );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp;

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};
