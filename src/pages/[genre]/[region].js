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
  //     `access_token=pk.eyJ1IjoicmF0ZWRvd2xtb20iLCJhIjoiY2xlY2pveHo1MGlxMTNvbGd2NWo0MGZ2eCJ9.vQS52w8JvgA6bF-gvDWLZA`
  // );
  // const {features} = await response.json();

  return {
    // boundingBox: features[0].bbox,
    region: query.region,
    genre: query.genre
  };
};

export default Region;
