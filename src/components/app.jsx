import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import styled from 'styled-components';

import Map from './map';
import GenreSelector from './genre-selector';
import Spinner from './spinner';

const SpinnerContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

class App extends Component {
  render() {
    const {loading, genre} = this.props;

    return (
      <Router>
        <React.Fragment>
          <Switch>
            <Route path="/:genre" component={Map} />
            <Route component={Map} />
          </Switch>

          <GenreSelector />

          {loading && (
            <SpinnerContainer>
              <Spinner color={genre.color} />
            </SpinnerContainer>
          )}
        </React.Fragment>
      </Router>
    );
  }
}

const mapStateToProps = ({loading, settings}) => ({
  loading,
  genre: settings.genre
});

export default connect(mapStateToProps)(App);
