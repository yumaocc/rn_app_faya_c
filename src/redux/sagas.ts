import {all, fork} from 'redux-saga/effects';

import commonSagas from './common/sagas';
import userSagas from './user/sagas';

function* rootSaga() {
  yield all([
    fork(commonSagas),
    fork(userSagas),
  ]);
}

export {rootSaga};
