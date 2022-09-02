import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers';
import {rootSaga} from './sagas';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = composeWithDevTools({trace: true, traceLimit: 25});
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(rootSaga);

export default store;
