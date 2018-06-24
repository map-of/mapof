import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {connect} from 'react-redux';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';

import {setGenre as setGenreAction} from '../ducks/settings';
import {fetchArtists as fetchArtistsAction} from '../ducks/artists';
import genres from '../constants/genres';

import Popup from './popup';

import mapStyle from '../config/map-style.json';

const MapContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

class Map extends Component {
  constructor() {
    super();
    this.state = {map: null, mapInitialized: false, dataLayerLoaded: false};
  }

  componentDidMount() {
    this.tooltipContainer = document.createElement('div');

    if (this.props.match.params.genre) {
      this.props.setGenre(
        genres.find(genre => genre.name === this.props.match.params.genre)
      );
    } else {
      this.props.fetchArtists(this.props.genre.name);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.genre !== this.props.match.params.genre) {
      this.props.setGenre(
        genres.find(genre => genre.name === this.props.match.params.genre)
      );
    }

    if (this.state.map && this.state.dataLayerLoaded && this.props.artists) {
      const artists = {
        type: 'FeatureCollection',
        features: this.props.artists.map(artist => {
          const {
            id,
            status,
            name,
            lat,
            lng,
            city,
            genre,
            info,
            wikipedia,
            soundcloud,
            user,
            timestamp
          } = artist;
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            properties: {
              id,
              status,
              name,
              city,
              genre,
              info,
              wikipedia,
              soundcloud,
              user,
              timestamp
            }
          };
        })
      };

      this.state.map.getSource('artists').setData(artists);
    }
  }

  initMap(container) {
    if (!container || this.state.mapInitialized) {
      return;
    }

    const defaultCircleColor = '#ccc';
    const dataDrivenColors = genres.reduce((genreNamesAndColors, genre) => {
      genreNamesAndColors.push(genre.name);
      genreNamesAndColors.push(genre.color);

      return genreNamesAndColors;
    }, []);
    dataDrivenColors.push(defaultCircleColor);

    const map = new mapboxgl.Map({
      container,
      style: mapStyle,
      center: [10, 53],
      zoom: 2
    });

    map.on('click', 'artists', event => {
      const artist = event.features[0];
      const coordinates = artist.geometry.coordinates.slice();

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      ReactDOM.render(<Popup artist={artist} />, this.tooltipContainer);

      new mapboxgl.Popup({closeButton: false})
        .setLngLat(coordinates)
        .setDOMContent(this.tooltipContainer)
        .addTo(map);
    });

    map.on('mouseenter', 'artists', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'artists', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('load', () => {
      map.addLayer({
        id: 'artists',
        type: 'circle',
        source: {
          type: 'geojson',
          data: null
        },
        paint: {
          'circle-color': ['match', ['get', 'genre'], ...dataDrivenColors],
          'circle-radius': 5,
          'circle-stroke-width': 5,
          'circle-stroke-color': [
            'match',
            ['get', 'genre'],
            ...dataDrivenColors
          ],
          'circle-stroke-opacity': 0.5
        }
      });

      this.setState({dataLayerLoaded: true});
    });

    this.setState({map, mapInitialized: true});
  }

  render() {
    return <MapContainer innerRef={div => this.initMap(div)} />;
  }
}

function mapStateToProps(state) {
  return {
    artists: state.artists,
    genre: state.settings.genre
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGenre: genre => dispatch(setGenreAction(genre)),
    fetchArtists: genre => dispatch(fetchArtistsAction(genre))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
