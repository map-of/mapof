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

function MyApp({Component, pageProps, data, genres}) {
  return (
    <GlobalStateProvider initialData={{data, genres}}>
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
MyApp.getInitialProps = async (appContext) => {
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

export default MyApp;
