import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {setGenre as setGenreAction} from '../ducks/settings';

import genres from '../constants/genres';

const Select = styled.select`
  position: absolute;
  top: 20px;
  left: 20px;
`;

class GenreSelector extends Component {
  handleSelect(event) {
    this.props.setGenre(
      genres.find(genre => genre.name === event.target.value)
    );
  }

  render() {
    return (
      <Select onChange={event => this.handleSelect(event)}>
        {genres.map(genre => {
          const {name} = genre;

          return (
            <option key={name} value={name}>{`${name
              .charAt(0)
              .toUpperCase()}${name.slice(1)}`}</option>
          );
        })}
      </Select>
    );
  }
}

function mapStateToProps(state) {
  return {
    genre: state.settings.genre
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setGenre: genre => dispatch(setGenreAction(genre))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GenreSelector);
