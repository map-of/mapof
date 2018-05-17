import React from 'react';
import ReactDOM from 'react-dom';
import {createLogger} from 'redux-logger';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

import initGlobalStyles from './global-styles/index';
import registerServiceWorker from './registerServiceWorker';

import reducers from './ducks/index';
import sagas from './ducks/sagas';

import App from './components/app';

initGlobalStyles();

const logger = createLogger({
  diff: true,
  collapsed: true,
  timestamp: false
});

const sagaMiddleware = createSagaMiddleware(sagas);
const store = createStore(reducers, applyMiddleware(logger, sagaMiddleware));

sagaMiddleware.run(sagas);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
