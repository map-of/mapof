import {useRef, useState, useEffect} from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import useGlobalState from '../hooks/useGlobalState';

mapboxgl.accessToken =
  'pk.eyJ1IjoicmF0ZWRvd2xtb20iLCJhIjoiY2xlY2pveHo1MGlxMTNvbGd2NWo0MGZ2eCJ9.vQS52w8JvgA6bF-gvDWLZA';

const Canvas = styled.div`
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

  const {bounds, accentColor, filteredData, actions} = useGlobalState();

  // Init map
  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: mapCanvas.current,
      style: 'mapbox://styles/ratedowlmom/clecjpulr000i01s4p6dy7mpa',
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
      data: filteredData,
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
        'circle-opacity': 0.75
      }
    });

    map.addLayer({
      id: 'data-cluster-layer',
      type: 'circle',
      source: 'data-source',
      filter: ['==', 'cluster', true],
      paint: {
        'circle-color': accentColor,
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'point_count'],
          10,
          15,
          200,
          40
        ],
        'circle-opacity': 0.75
      }
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'data-source',
      filter: ['==', 'cluster', true],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Montserrat Medium'],
        'text-size': 16
      },
      paint: {
        'text-color': '#ffffff'
      }
    });

    map.on('click', 'data-layer', ({features}) => {
      actions.setInfoBoxItems([features[0]]);
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
    mapLoaded && map.fitBounds(bounds);
  }, [bounds]);

  // New data
  useEffect(() => {
    mapLoaded && map.getSource('data-source').setData(filteredData);
  }, [filteredData]);

  // New accent color
  useEffect(() => {
    mapLoaded &&
      map.setPaintProperty('data-cluster-layer', 'circle-color', accentColor);
  }, [accentColor]);

  return <Canvas ref={mapCanvas}></Canvas>;
}

export default MapboxMap;
