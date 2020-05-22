import {useRef, useState, useEffect} from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import useGlobalState from '../hooks/useGlobalState';

mapboxgl.accessToken =
  'pk.eyJ1IjoibXJtZXRhbHdvb2QiLCJhIjoiY2o1aWQ0MmNhMXR5eDJxb2R5eHowNTNjZCJ9.XKgKCOOPaRYjz9k1zMi3Ag';

const Canvas = styled.div`
  background-color: blue;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
`;

function MapboxMap() {
  const mapCanvas = useRef();
  const [map, setMap] = useState(null);
  const {mapState} = useGlobalState();
  const {bounds} = mapState;

  // Init map
  useEffect(() => {
    setMap(
      new mapboxgl.Map({
        container: mapCanvas.current,
        style: 'mapbox://styles/mrmetalwood/ck5qyupbd7gn01intq8zgxw3e',
        bounds
      })
    );
  }, []);

  // Update bounds
  useEffect(() => {
    map && map.fitBounds(bounds);
  }, [bounds]);

  return <Canvas ref={mapCanvas}></Canvas>;
}

export default MapboxMap;
