import {all, fork} from 'redux-saga/effects';

import commonSagas from './common/sagas';
import userSagas from './user/sagas';
import spuSagas from './spu/sagas';
import workSagas from './work/sagas';

function* rootSaga() {
  yield all([fork(commonSagas), fork(userSagas), fork(spuSagas), fork(workSagas)]);
}

export {rootSaga};
