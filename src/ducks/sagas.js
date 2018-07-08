import {all, call} from 'redux-saga/effects';

import {fetchArtistsSaga} from './artists';
import {submitArtistSaga} from './submit';
import {setGenreSaga} from './settings';

export default function* rootSaga() {
  yield all([
    call(fetchArtistsSaga),
    call(setGenreSaga),
    call(submitArtistSaga)
  ]);
}
