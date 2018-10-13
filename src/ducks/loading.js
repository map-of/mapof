import {FETCH_ARTISTS, FETCH_ARTISTS_SUCCESS} from './artists';
import {
  SUBMIT_ARTIST,
  SUBMIT_ARTIST_SUCCESS,
  SUBMIT_ARTIST_ERROR,
  SUBMIT_MISSING_FIELD
} from './submit';

const initialState = false;

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_ARTISTS:
    case SUBMIT_ARTIST:
      return true;

    case FETCH_ARTISTS_SUCCESS:
    case SUBMIT_ARTIST_SUCCESS:
    case SUBMIT_ARTIST_ERROR:
    case SUBMIT_MISSING_FIELD:
      return false;

    default:
      return state;
  }
}
