import {call, put, select, takeEvery} from 'redux-saga/effects';

import {submitArtist as submitArtistApi} from '../api/artists.js';

export const UPDATE_SUBMIT = 'UPDATE_SUBMIT';
export const SUBMIT_ARTIST = 'SUBMIT_ARTIST';
export const SUBMIT_ARTIST_SUCCESS = 'SUBMIT_ARTIST_SUCCESS';
export const SUBMIT_ARTIST_ERROR = 'SUBMIT_ARTIST_ERROR';

const initialState = {
  name: '',
  locationName: '',
  infoLink: '',
  description: '',
  mediaLink: '',
  user: '',
  coordinates: {lat: null, lng: null}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SUBMIT:
      return {...state, [action.payload.name]: action.payload.data};

    case SUBMIT_ARTIST_SUCCESS:
      return initialState;

    default:
      return state;
  }
}

export function updateSubmit(payload) {
  return {
    type: UPDATE_SUBMIT,
    payload
  };
}

export function submitArtist(history) {
  return {
    type: SUBMIT_ARTIST,
    payload: {history}
  };
}

export function submitArtistSuccess() {
  return {
    type: SUBMIT_ARTIST_SUCCESS
  };
}

export function submitArtistError(error) {
  console.log(error);

  return {
    type: SUBMIT_ARTIST_ERROR
  };
}

// eslint-disable-next-line complexity
function* submitArtistWorker({payload}) {
  try {
    const {artist, genre} = yield select(state => ({
      artist: state.submit,
      genre: state.settings.genre.name
    }));

    if (
      !artist.name ||
      !genre ||
      !artist.locationName ||
      !artist.mediaLink ||
      !artist.coordinates.lat ||
      !artist.coordinates.lng
    ) {
      throw new Error('Missing paramters');
    }

    const finalArtist = {
      name: artist.name,
      locationName: artist.locationName,
      lat: artist.coordinates.lat,
      lng: artist.coordinates.lng,
      genre,
      infoLink: artist.infoLink,
      description: artist.description,
      mediaLink: artist.mediaLink,
      user: artist.user
    };

    yield call(submitArtistApi, finalArtist);
    payload.history.goBack();
    yield put(submitArtistSuccess());
  } catch (error) {
    yield put(submitArtistError(error));
  }
}

export function* submitArtistSaga() {
  yield takeEvery(SUBMIT_ARTIST, submitArtistWorker);
}
