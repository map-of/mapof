import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import Map from './map';
import GenreSelector from './genre-selector';
import Spinner from './spinner';
import Submit from './submit/submit';

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

const GenreSelectContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
`;

class Home extends Component {
  render() {
    const {loading, genre, match} = this.props;
    const {path} = match;

    return (
      <React.Fragment>
        <Map urlGenre={match.params.genre || null} />

        <GenreSelectContainer>
          <GenreSelector
            onChange={genre => this.props.history.push(`/${genre.name}`)}
          />
        </GenreSelectContainer>

        {path === '/submit' && <Submit />}

        {loading && (
          <SpinnerContainer>
            <Spinner color={genre.color} />
          </SpinnerContainer>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({loading, settings}) => ({
  loading,
  genre: settings.genre
});

export default connect(mapStateToProps)(Home);
