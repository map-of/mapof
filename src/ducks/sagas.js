import {all, call} from 'redux-saga/effects';

import {fetchArtistsSaga} from './artists';

export default function* rootSaga() {
  yield all([call(fetchArtistsSaga)]);
}
