import React from 'react';
import ReactDOM from 'react-dom';
import {createLogger} from 'redux-logger';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import md5 from 'md5';

import initGlobalStyles from './global-styles/index';
import registerServiceWorker from './registerServiceWorker';

import reducers from './ducks/index';
import sagas from './ducks/sagas';

import App from './components/app';

let auth = false;
const cool = window.prompt('You cool?');
if (cool && md5(cool) === '2c1743a391305fbf367df8e4f069f9f9') {
  auth = true;
}

initGlobalStyles();

const logger = createLogger({
  diff: true,
  collapsed: true,
  timestamp: false
});

const sagaMiddleware = createSagaMiddleware(sagas);
const store = createStore(reducers, applyMiddleware(logger, sagaMiddleware));

sagaMiddleware.run(sagas);

if (auth) {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );

  registerServiceWorker();
}
