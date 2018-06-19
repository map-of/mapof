import {put, takeEvery} from 'redux-saga/effects';

import genres from '../constants/genres';

import {fetchArtists} from '../ducks/artists';

export const SET_GENRE = 'SET_GENRE';

const initialState = {
  genre: genres[0]
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_GENRE:
      return action.payload;

    default:
      return state;
  }
}

export function setGenre(genre) {
  return {
    type: SET_GENRE,
    payload: genre
  };
}

function* setGenreWorker(action) {
  try {
    yield put(fetchArtists(action.payload.name));
  } catch (error) {
    console.log(error);
  }
}

export function* setGenreSaga() {
  yield takeEvery(SET_GENRE, setGenreWorker);
}
