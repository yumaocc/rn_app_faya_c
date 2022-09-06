import {all, fork} from 'redux-saga/effects';

function* watchSPUSagas() {
  // yield takeLatest(ActionType.INIT, initUser);
  // yield takeLatest(ActionType.LOGOUT, logout);
  // yield takeLatest(ActionType.SET_USER_INFO, setUserInfo);
}

export default function* spuSagas() {
  yield all([fork(watchSPUSagas)]);
}
