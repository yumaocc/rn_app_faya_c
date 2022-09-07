import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {Actions} from './actions';
import {ActionType} from './types';
import {cache} from '../../helper/cache';
import {ActionWithPayload} from '../types';
import {UserInfo} from '../../models';
import * as api from '../../apis';

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

function* getWalletInfo(): any {
  try {
    const wallet = yield call(api.user.getWallet);
    yield put(Actions.getWalletInfoSuccess(wallet));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
function* getCouponList(): any {
  try {
    const coupons = yield call(api.user.getCouponList);
    yield put(Actions.getCouponListSuccess(coupons));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}
function* getMyDetail(): any {
  try {
    const detail = yield call(api.user.getMineDetail);
    if (detail) {
      yield put(Actions.getMyDetailSuccess(detail));
    }
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

function* watchUserSagas() {
  yield takeLatest(ActionType.INIT, initUser);
  yield takeLatest(ActionType.LOGOUT, logout);
  yield takeLatest(ActionType.SET_USER_INFO, setUserInfo);
  yield takeLatest(ActionType.GET_WALLET_INFO, getWalletInfo);
  yield takeLatest(ActionType.GET_COUPON_LIST, getCouponList);
  yield takeLatest(ActionType.GET_MINE_DETAIL, getMyDetail);
}

export default function* userSagas() {
  yield all([fork(watchUserSagas)]);
}
