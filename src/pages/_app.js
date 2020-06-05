import App from 'next/app';
import {ThemeProvider} from 'styled-components';
import {GlobalStateProvider} from '../hooks/useGlobalState';

import Head from 'next/head';
import dynamic from 'next/dynamic';

import InfoBox from '../components/InfoBox';
import SearchBar from '../components/SearchBar';
import Player from '../components/Player';

import '../styles/global.css';

const MapboxMap = dynamic(() => import('../components/MapboxMap'), {
  ssr: false
});

const theme = {
  colors: {
    primary: '#0070f3'
  },
  font: {
    primary: '"Montserrat", sans-serif'
  }
};

function MapOf({Component, pageProps, data, genres}) {
  return (
    <GlobalStateProvider initialData={{data, genres}} {...pageProps}>
      <ThemeProvider theme={theme}>
        <Head>
          <link
            href="https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=PT+Sans&family=PT+Sans+Narrow&display=swap"
            rel="stylesheet"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicon-16x16.png"
          />
          <link rel="manifest" href="/static/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/static/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta
            name="msapplication-config"
            content="/static/browserconfig.xml"
          />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <MapboxMap />
        <InfoBox />
        <Player />
        <SearchBar />
        <Component {...pageProps} />
      </ThemeProvider>
    </GlobalStateProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
MapOf.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  let data = null;
  let genres = null;

  if (typeof window === 'undefined') {
    const response = await fetch(
      `https://script.google.com/macros/s/` +
        `AKfycbytro_BuOciH12QClPlDg1GF60DdHCsMgN3MZGqaq6QfhUvfwkB/exec?` +
        `genre=all`
    );
    const result = await response.json();

    data = JSON.parse(result.data);
    genres = result.genres;
  }

  return {...appProps, data, genres};
};

export default MapOf;
