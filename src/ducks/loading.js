import {FETCH_ARTISTS, FETCH_ARTISTS_SUCCESS} from './artists';

const initialState = false;

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_ARTISTS:
      return true;

    case FETCH_ARTISTS_SUCCESS:
      return false;

    default:
      return state;
  }
}
