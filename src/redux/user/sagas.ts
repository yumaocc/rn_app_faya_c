import {all, fork, put, takeLatest} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {Actions} from './actions';
import {ActionType} from './types';
import {cache} from '../../helper/cache';

function* initUser(): any {
  const phone = yield cache.user.getPhone();
  yield put(Actions.initSuccess(phone || ''));
}

function* logout(): any {
  yield put(CommonActions.setToken(''));
}


function* watchUserSagas() {
  yield takeLatest(ActionType.INIT, initUser);
  yield takeLatest(ActionType.LOGOUT, logout);
}

export default function* userSagas() {
  yield all([fork(watchUserSagas)]);
}
