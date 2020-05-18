import App from "next/app";
import { ThemeProvider } from "styled-components";
import { GlobalStateProvider } from "../hooks/useGlobalState";
import Head from "next/head";
import dynamic from "next/dynamic";

const MapboxMap = dynamic(() => import("../components/MapboxMap"), {
  ssr: false
});

const theme = {
  colors: {
    primary: "#0070f3"
  }
};

function MyApp({ Component, pageProps }) {
  return (
    <GlobalStateProvider>
      <ThemeProvider theme={theme}>
        <Head>
          <link
            href="https://api.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css"
            rel="stylesheet"
          />
        </Head>
        <MapboxMap />
        <Component {...pageProps} />
      </ThemeProvider>
    </GlobalStateProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.

MyApp.getInitialProps = async appContext => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

export default MyApp;
