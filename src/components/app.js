import React, {Component} from 'react';
import styled from 'styled-components';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';

const MapWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

class App extends Component {
  render() {
    return (
      <MapWrapper>
        <Map
          center={[51.505, -0.09]}
          zoom={13}
          style={{width: '100%', height: '100%'}}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              <span>
                A pretty CSS3 popup.<br />Easily customizable.
              </span>
            </Popup>
          </Marker>
        </Map>
      </MapWrapper>
    );
  }
}

export default App;
