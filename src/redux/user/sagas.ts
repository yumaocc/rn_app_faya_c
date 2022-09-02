import {all, fork, put, takeLatest} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {Actions} from './actions';
import {ActionType} from './types';
import {cache} from '../../helper/cache';
import {ActionWithPayload} from '../types';
import {UserInfo} from '../../models';

function* initUser(): any {
  const phone = yield cache.user.getPhone();
  yield put(Actions.initSuccess(phone || ''));
}

function* logout(): any {
  yield put(CommonActions.setToken(''));
}
function* setUserInfo(action: ActionWithPayload<ActionType, UserInfo>) {
  // yield cache.user.setUserInfo(userInfo);
  const token = action.payload?.token;
  if (token) {
    yield put(CommonActions.setToken(token));
  }
}
function* watchUserSagas() {
  yield takeLatest(ActionType.INIT, initUser);
  yield takeLatest(ActionType.LOGOUT, logout);
  yield takeLatest(ActionType.SET_USER_INFO, setUserInfo);
}

export default function* userSagas() {
  yield all([fork(watchUserSagas)]);
}
