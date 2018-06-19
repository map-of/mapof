import React, {Component} from 'react';

import Map from './map';
import GenreSelector from './genre-selector';

export default class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Map />
        <GenreSelector />
      </React.Fragment>
    );
  }
}
