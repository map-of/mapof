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
  const [mapLoaded, setMapLoaded] = useState(false);

  const {mapState, data, actions} = useGlobalState();
  const {bounds} = mapState;

  // Init map
  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: mapCanvas.current,
      style: 'mapbox://styles/mrmetalwood/ck5qyupbd7gn01intq8zgxw3e',
      bounds
    });
    setMap(newMap);

    newMap.on('load', () => setMapLoaded(true));
  }, []);

  // init layers
  useEffect(() => {
    if (!mapLoaded || map?.getSource('data-source')) {
      return;
    }

    map.addSource('data-source', {
      type: 'geojson',
      data,
      cluster: true
      // clusterRadius: 30
    });

    map.addLayer({
      id: 'data-layer',
      type: 'circle',
      source: 'data-source',
      filter: ['!=', 'cluster', true],
      paint: {
        'circle-color': ['get', 'color'],
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 5, 12, 12],
        'circle-opacity': 0.85
      }
    });

    map.addLayer({
      id: 'data-cluster-layer',
      type: 'circle',
      source: 'data-source',
      filter: ['==', 'cluster', true],
      paint: {
        'circle-color': 'deeppink',
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'point_count'],
          10,
          15,
          200,
          40
        ],
        'circle-opacity': 0.85
      }
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'data-source',
      filter: ['==', 'cluster', true],
      layout: {
        'text-field': '{point_count_abbreviated}',
        // 'text-font': ['Noto Sans'],
        'text-size': 12
      },
      paint: {
        'text-color': '#ffffff'
      }
    });

    map.on('click', 'data-layer', ({features}) => {
      actions.setSelectedInfoBoxItem(features[0]);
    });

    map.on('click', 'data-cluster-layer', ({features}) => {
      const feature = features[0];
      const pointCount = feature.properties.point_count;

      const source = map.getSource('data-source');

      source.getClusterLeaves(
        feature.properties.cluster_id,
        pointCount,
        0,
        (error, features) => {
          if (error) {
            console.log(error);
            return;
          }

          const uniqueLocations = new Set(
            features.map((f) => f.properties.locationName)
          );

          if (uniqueLocations.size === 1) {
            actions.setInfoBoxItems(features);
          } else {
            source.getClusterExpansionZoom(
              feature.properties.cluster_id,
              (error, zoom) => {
                if (error) {
                  console.log(error);
                  return;
                }

                map.easeTo({
                  center: feature.geometry.coordinates,
                  zoom: zoom + 1
                });
              }
            );
          }
        }
      );
    });

    ['data-layer', 'data-cluster-layer'].forEach((layer) => {
      map.on('mouseenter', layer, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', layer, () => {
        map.getCanvas().style.cursor = '';
      });
    });
  }, [mapLoaded]);

  // Update bounds
  useEffect(() => {
    map && map.fitBounds(bounds);
  }, [bounds]);

  return <Canvas ref={mapCanvas}></Canvas>;
}

export default MapboxMap;
