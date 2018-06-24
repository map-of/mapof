import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Map from './map';
import GenreSelector from './genre-selector';

export default class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Switch>
            <Route path="/:genre" component={Map} />
            <Route component={Map} />
          </Switch>

          <GenreSelector />
        </React.Fragment>
      </Router>
    );
  }
}
