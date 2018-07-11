import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import seedrandom from 'seedrandom';

import {setGenre as setGenreAction} from '../ducks/settings';
import {fetchArtists as fetchArtistsAction} from '../ducks/artists';
import genres from '../constants/genres';

import Popup from './popup';

import mapStyle from '../config/map-style.json';

const MapContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
`;

const SubmitCtaButton = styled(Link)`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.color};
  color: #ffffff;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  padding: 0 40px;
  transition: background 150ms ease-in-out;
`;

class Map extends Component {
  constructor() {
    super();
    this.state = {map: null, mapInitialized: false, dataLayerLoaded: false};
  }

  componentDidMount() {
    this.tooltipContainer = document.createElement('div');

    if (this.props.urlGenre) {
      this.props.setGenre(
        genres.find(genre => genre.name === this.props.urlGenre)
      );
    } else {
      this.props.fetchArtists(this.props.genre.name);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.urlGenre &&
      prevProps.urlGenre !== this.props.urlGenre &&
      this.props.urlGenre !== this.props.genre.name
    ) {
      this.props.setGenre(
        genres.find(genre => genre.name === this.props.urlGenre)
      );
    }

    if (this.state.map && this.state.dataLayerLoaded && this.props.artists) {
      // HACK START for distributing point with same location.
      const reducedPositions = this.props.artists.reduce(
        (positionCount, item) => {
          positionCount[`${item.lat}-${item.lng}`] =
            positionCount[`${item.lat}-${item.lng}`] || [];
          positionCount[`${item.lat}-${item.lng}`].push(item);

          return positionCount;
        },
        {}
      );

      // https://gis.stackexchange.com/questions/25877/generating-random-locations-nearby
      const getRandomPointInCircle = (id, lat, lng, radiusInMeter) => {
        const randomForLat = seedrandom(`${id}-lat`);
        const randomForLng = seedrandom(`${id}-lng`);

        const r = radiusInMeter / 111300;
        const y0 = lat;
        const x0 = lng;
        const u = randomForLat();
        const v = randomForLng();
        const w = r * Math.sqrt(u);
        const t = 2 * Math.PI * v;
        const x = w * Math.cos(t);
        const y1 = w * Math.sin(t);
        const x1 = x / Math.cos(y0);

        return {lat: y0 + y1, lng: x0 + x1};
      };

      Object.entries(reducedPositions)
        .filter(item => item[1].length > 1)
        .forEach(item => {
          item[1].forEach(artist => {
            const {lat, lng} = getRandomPointInCircle(
              artist.id,
              artist.lat,
              artist.lng,
              100
            );
            artist.lat = lat;
            artist.lng = lng;
          });
        });
      // HACK END

      const artists = {
        type: 'FeatureCollection',
        features: this.props.artists.map(artist => {
          const {
            id,
            status,
            name,
            lat,
            lng,
            locationName,
            genre,
            subgenre,
            description,
            infoLink,
            mediaLink,
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
              locationName,
              color: genres.find(g => g.name === genre).color,
              genre,
              subgenre,
              description,
              infoLink,
              mediaLink,
              user,
              timestamp
            }
          };
        })
      };

      this.state.map.getSource('artists-source').setData(artists);
      this.state.map.setPaintProperty(
        'artists-cluster-layer',
        'circle-color',
        this.props.genre.color
      );
    }
  }

  initMap(container) {
    if (!container || this.state.mapInitialized) {
      return;
    }

    const map = new mapboxgl.Map({
      container,
      style: mapStyle,
      center: [10, 53],
      zoom: 2
    });

    map.on('click', 'artists-layer', event => {
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

    map.on('mouseenter', 'artists-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'artists-layer', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('load', () => {
      map.addSource('artists-source', {
        type: 'geojson',
        data: null,
        cluster: true
      });

      map.addLayer({
        id: 'artists-cluster-layer',
        type: 'circle',
        source: 'artists-source',
        filter: ['==', 'cluster', true],
        paint: {
          'circle-color': this.props.genre.color,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'point_count'],
            10,
            15,
            100,
            50
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      map.addLayer({
        id: 'artists-layer',
        type: 'circle',
        source: 'artists-source',
        filter: ['!=', 'cluster', true],
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 5, 12, 10],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 1
        }
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'artists-source',
        filter: ['==', 'cluster', true],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Noto Sans'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      this.setState({dataLayerLoaded: true});
    });

    this.setState({map, mapInitialized: true});
  }

  render() {
    return (
      <MapContainer>
        <MapCanvas innerRef={div => this.initMap(div)} />
        <SubmitCtaButton to="/submit" color={this.props.genre.color}>
          Submit new artist
        </SubmitCtaButton>
      </MapContainer>
    );
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
