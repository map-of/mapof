import {all, call} from 'redux-saga/effects';

import {fetchArtistsSaga} from './artists';
import {setGenreSaga} from './settings';

export default function* rootSaga() {
  yield all([call(fetchArtistsSaga), call(setGenreSaga)]);
}
