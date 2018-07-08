import {FETCH_ARTISTS, FETCH_ARTISTS_SUCCESS} from './artists';
import {SUBMIT_ARTIST, SUBMIT_ARTIST_SUCCESS} from './submit';

const initialState = false;

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_ARTISTS:
    case SUBMIT_ARTIST:
      return true;

    case FETCH_ARTISTS_SUCCESS:
    case SUBMIT_ARTIST_SUCCESS:
      return false;

    default:
      return state;
  }
}
