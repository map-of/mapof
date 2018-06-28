import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
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
    this.props.history.push(
      `/${genres.find(genre => genre.name === event.target.value).name}`
    );
  }

  render() {
    return (
      <Select
        onChange={event => this.handleSelect(event)}
        value={this.props.genre.name}>
        {genres.map(genre => {
          const {name} = genre;

          // prettier-ignore
          const capitalizedName = `
            ${name.charAt(0).toUpperCase()}${name.slice(1)}
          `;

          return (
            <option key={name} value={name}>
              {capitalizedName}
            </option>
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GenreSelector)
);
