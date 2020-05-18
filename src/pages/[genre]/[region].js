import styled from "styled-components";
import fetch from "node-fetch";
import { useEffect } from "react";
import useGlobalState from "../../hooks/useGlobalState";

const Container = styled.div`
  background-color: yellow;
  position: absolute;
  top: 20px;
  left: 20px;
`;

function Region({ boundingBox, data }) {
  const { setMapBounds } = useGlobalState();

  console.log(data);

  useEffect(() => {
    // setMapBounds(boundingBox);
  }, []);

  return <Container>lol</Container>;
}

Region.getInitialProps = async ({ query }) => {
  const response = await fetch(
    `https://script.google.com/macros/s/` +
      `AKfycbytro_BuOciH12QClPlDg1GF60DdHCsMgN3MZGqaq6QfhUvfwkB/exec?` +
      `genre=${query.genre}`
  );
  const data = await response.text();
  // console.log(data)
  return { data: JSON.parse(data), boundingBox: null };
  // const response = await fetch(
  //   `https://api.mapbox.com/geocoding/v5/mapbox.places/${query.region}.json?` +
  //     `access_token=pk.eyJ1IjoibXJtZXRhbHdvb2QiLCJhIjoiY2o1aWQ0MmNhMXR5eDJxb2R5eHowNTNjZCJ9.XKgKCOOPaRYjz9k1zMi3Ag`
  // );
  // const { features } = await response.json();
  // return { boundingBox: features[0].bbox };
};

export default Region;
