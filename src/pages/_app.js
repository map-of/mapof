import App from 'next/app';
import {ThemeProvider} from 'styled-components';
import Select from 'react-select';
import {GlobalStateProvider} from '../hooks/useGlobalState';
import {useEffect} from 'react';

import Head from 'next/head';
import dynamic from 'next/dynamic';

import InfoBox from '../components/InfoBox';

const MapboxMap = dynamic(() => import('../components/MapboxMap'), {
  ssr: false
});

const theme = {
  colors: {
    primary: '#0070f3'
  }
};

const options = [
  {value: 'techno', label: 'Techno'},
  {value: 'rap', label: 'Rap'}
];

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    position: 'absolute',
    top: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '400px',
    height: '56px'
  }),
  control: (provided, state) => ({
    ...provided,
    borderRadius: '28px',
    background: 'white',
    height: '100%'
  })
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
        </Head>
        <MapboxMap />
        <InfoBox />
        <Select
          instanceId="selector"
          options={options}
          styles={customStyles}
          isMulti
        />
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
