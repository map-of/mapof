import {combineReducers} from 'redux';

import artists from './artists.js';
import settings from './settings.js';

const reducers = combineReducers({
  artists,
  settings
});

export default reducers;
