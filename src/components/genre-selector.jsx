import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import genres from '../constants/genres';

class GenreSelector extends Component {
  render() {
    return (
      <select
        onChange={event =>
          this.props.onChange(
            genres.find(genre => genre.name === event.target.value)
          )
        }
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
      </select>
    );
  }
}

function mapStateToProps(state) {
  return {
    genre: state.settings.genre
  };
}

export default withRouter(connect(mapStateToProps)(GenreSelector));
