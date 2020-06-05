import styled from 'styled-components';
import fetch from 'node-fetch';
import {useEffect} from 'react';
import useGlobalState from '../../hooks/useGlobalState';

const Container = styled.div`
  background-color: yellow;
  position: absolute;
  top: 20px;
  left: 20px;
`;

function Region({boundingBox}) {
  // const {actions} = useGlobalState();

  // useEffect(() => {
  //   actions.setMapBounds(boundingBox);
  // }, []);

  return null;
}

Region.getInitialProps = async ({query}) => {
  // const response = await fetch(
  //   `https://api.mapbox.com/geocoding/v5/mapbox.places/${query.region}.json?` +
  //     `access_token=pk.eyJ1IjoibXJtZXRhbHdvb2QiLCJhIjoiY2o1aWQ0MmNhMXR5eDJxb2R5eHowNTNjZCJ9.XKgKCOOPaRYjz9k1zMi3Ag`
  // );
  // const {features} = await response.json();

  return {
    // boundingBox: features[0].bbox,
    region: query.region,
    genre: query.genre
  };
};

export default Region;
