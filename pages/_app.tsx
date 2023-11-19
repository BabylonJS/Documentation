import { CssBaseline, ThemeProvider, useMediaQuery, createTheme, PaletteMode } from '@mui/material';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { useState, useEffect, useMemo, FunctionComponent, createContext, PropsWithChildren } from 'react';

import '../styles/globals.scss';
import './typedoc/apiPage.global.scss';
import { getDesignTokens } from '../styles/theme';

const THEME_PREFERENCE = 'theme'
export const ColorModeContext = createContext({ toggleColorMode: () => {} });
const ToggleColorMode: FunctionComponent<PropsWithChildren<{}>> = ({children}) => {
  const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');
  const [mode, setMode] = useState<PaletteMode>(prefersLightMode ? "light" : "dark");
  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem(THEME_PREFERENCE, newMode);
          return newMode
        });
      },
    }),
    [],
  );

  // Determine what the first render should be based off localStorage or user preference
  useEffect(() => {
    const savedUserPreference = localStorage.getItem(THEME_PREFERENCE);
    if(savedUserPreference === 'light')
      setMode('light')
    else if(savedUserPreference === 'dark')
      setMode('dark')
  }, [])

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export const MyApp: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <>
      <Head>
        <title>Babylon.js docs</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ToggleColorMode>
        <Component {...pageProps} />
      </ToggleColorMode>
    </>
  );
}
export default MyApp;
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