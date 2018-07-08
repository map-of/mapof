import {combineReducers} from 'redux';

import artists from './artists.js';
import settings from './settings.js';
import loading from './loading.js';
import submit from './submit.js';

const reducers = combineReducers({
  artists,
  settings,
  loading,
  submit
});

export default reducers;
