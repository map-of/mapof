import {combineReducers} from 'redux';

import artists from './artists.js';
import settings from './settings.js';
import loading from './loading.js';

const reducers = combineReducers({
  artists,
  settings,
  loading
});

export default reducers;
