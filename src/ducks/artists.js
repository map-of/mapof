import {call, put, takeEvery} from 'redux-saga/effects';

import {fetchArtists as fetchArtistsApi} from '../api/artists.js';

export const FETCH_ARTISTS = 'FETCH_ARTISTS';
export const FETCH_ARTISTS_SUCCESS = 'FETCH_ARTISTS_SUCCESS';
export const FETCH_ARTISTS_ERROR = 'FETCH_ARTISTS_ERROR';

const initialState = null;

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_ARTISTS_SUCCESS:
      return action.payload;

    case FETCH_ARTISTS_ERROR:
      return null;

    default:
      return state;
  }
}

export function fetchArtistsSuccess(payload) {
  return {
    type: FETCH_ARTISTS_SUCCESS,
    payload
  };
}

export function fetchArtists(genre) {
  return {
    type: FETCH_ARTISTS,
    payload: genre
  };
}

function* fetchArtistsWorker(action) {
  try {
    const artists = yield call(fetchArtistsApi, action.payload);
    yield put({type: FETCH_ARTISTS_SUCCESS, payload: JSON.parse(artists)});
  } catch (error) {
    yield put({type: FETCH_ARTISTS_ERROR, payload: error});
  }
}

export function* fetchArtistsSaga() {
  yield takeEvery(FETCH_ARTISTS, fetchArtistsWorker);
}
