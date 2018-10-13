import {call, put, select, takeEvery} from 'redux-saga/effects';

import {submitArtist as submitArtistApi} from '../api/artists.js';

export const UPDATE_SUBMIT = 'UPDATE_SUBMIT';
export const SUBMIT_ARTIST = 'SUBMIT_ARTIST';
export const SUBMIT_ARTIST_SUCCESS = 'SUBMIT_ARTIST_SUCCESS';
export const SUBMIT_ARTIST_ERROR = 'SUBMIT_ARTIST_ERROR';
export const SUBMIT_MISSING_FIELD = 'SUBMIT_MISSING_FIELD';

const initialState = {
  name: '',
  locationName: '',
  infoLink: '',
  description: '',
  mediaLink: '',
  facebookLink: '',
  instagramLink: '',
  twitterLink: '',
  websiteLink: '',
  user: '',
  coordinates: {lat: null, lng: null},
  errors: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SUBMIT:
      return {
        ...state,
        [action.payload.name]: action.payload.data,
        errors: {...state.errors, [action.payload.name]: false}
      };

    case SUBMIT_ARTIST_SUCCESS:
      return initialState;

    case SUBMIT_MISSING_FIELD:
      return {...state, errors: action.payload};

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

export function submitArtistError() {
  return {
    type: SUBMIT_ARTIST_ERROR
  };
}

export function submitMissingField(errors) {
  return {
    type: SUBMIT_MISSING_FIELD,
    payload: errors
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
      !artist.infoLink ||
      !artist.locationName ||
      !artist.mediaLink ||
      !artist.coordinates.lat ||
      !artist.coordinates.lng
    ) {
      yield put(
        submitMissingField({
          name: Boolean(!artist.name),
          locationName: Boolean(!artist.locationName),
          infoLink: Boolean(!artist.infoLink),
          mediaLink: Boolean(!artist.mediaLink),
          lat: Boolean(!artist.coordinates.lat),
          lng: Boolean(!artist.coordinates.lng)
        })
      );

      return;
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
      facebookLink: artist.facebookLink,
      instagramLink: artist.instagramLink,
      twitterLink: artist.twitterLink,
      websiteLink: artist.websiteLink,
      user: artist.user
    };

    yield call(submitArtistApi, finalArtist);
    payload.history.goBack();
    yield put(submitArtistSuccess());
  } catch (error) {
    yield put(submitArtistError());
  }
}

export function* submitArtistSaga() {
  yield takeEvery(SUBMIT_ARTIST, submitArtistWorker);
}
