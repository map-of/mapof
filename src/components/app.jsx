import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from './home';

export default class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Switch>
            <Route path="/submit" component={Home} />
            <Route path="/:genre" component={Home} />
            <Route component={Home} />
          </Switch>
        </React.Fragment>
      </Router>
    );
  }
}
