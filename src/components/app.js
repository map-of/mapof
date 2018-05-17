import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';

import {fetchArtists} from '../ducks/artists';

import mapStyle from '../config/map-style.json';

const Map = styled.div`
  width: 100vw;
  height: 100vh;
`;

class App extends Component {
  constructor() {
    super();
    this.state = {map: null, mapInitialized: false};
  }

  componentDidMount() {
    this.props.dispatch(fetchArtists('techno'));
  }

  componentDidUpdate() {
    if (this.props.artists && this.state.map) {
      const artists = {
        type: 'FeatureCollection',
        features: this.props.artists.map(artist => {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [artist.lng, artist.lat]
            }
          };
        })
      };

      this.state.map.getSource('artists').setData(artists);
    }
  }

  initMap(container) {
    if (this.state.mapInitialized) {
      return;
    }

    const map = new mapboxgl.Map({
      container,
      style: mapStyle,
      center: [10, 53],
      zoom: 2
    });

    map.on('load', function() {
      map.addLayer({
        id: 'artists',
        type: 'circle',
        source: {
          type: 'geojson',
          data: null
        },
        paint: {
          'circle-color': '#BD10E0',
          'circle-radius': 5,
          'circle-stroke-width': 5,
          'circle-stroke-color': '#BD10E0',
          'circle-stroke-opacity': 0.5
        }
      });
    });
    this.setState({map, mapInitialized: true});
  }

  render() {
    return <Map innerRef={div => this.initMap(div)} />;
  }
}

function mapStateToProps(state) {
  return {
    artists: state.artists
  };
}

export default connect(mapStateToProps)(App);
