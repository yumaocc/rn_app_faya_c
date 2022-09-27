import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {Actions} from './actions';
import {ActionType} from './types';
import {cache} from '../../helper/cache';
import {ActionWithPayload} from '../types';
import {GoLoginParams} from '../../models';
import * as api from '../../apis';
import {navigateTo, relaunch} from '../../router/Router';
import {RootState} from '../reducers';
import {OrderActions, SPUActions, WorkActions} from '../actions';

function* initUser(): any {
  const phone = yield cache.user.getPhone();
  yield put(Actions.initSuccess(phone || ''));
}

function* logout(): any {
  yield put(CommonActions.setToken(''));
  yield put(CommonActions.reset());
  yield put(Actions.reset());
  yield put(WorkActions.reset());
  yield put(OrderActions.reset());
  yield put(SPUActions.reset());
}

function login() {
  navigateTo('Login');
}

function* loginSuccess(action: ActionWithPayload<ActionType, string>): any {
  // yield cache.user.setUserInfo(userInfo);
  const token = action.payload;
  yield put(CommonActions.setToken(token));
  const params: GoLoginParams = yield select((state: RootState) => state.user.login);
  if (!params) {
    relaunch();
  } else {
    navigateTo(params?.to || 'Tab', params?.params, params?.redirect);
    yield put(Actions.clearLoginInfo());
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

function* getWalletSummary(): any {
  try {
    const summary = yield call(api.user.getWalletSummary);
    yield put(Actions.getWalletSummarySuccess(summary));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

function* watchUserSagas() {
  yield takeLatest(ActionType.INIT, initUser);
  yield takeLatest(ActionType.LOGOUT, logout);
  yield takeLatest(ActionType.LOGIN, login);
  yield takeLatest(ActionType.LOGIN_SUCCESS, loginSuccess);
  // yield takeLatest(ActionType.SET_USER_INFO, setUserInfo);
  yield takeLatest(ActionType.GET_WALLET_INFO, getWalletInfo);
  yield takeLatest(ActionType.GET_COUPON_LIST, getCouponList);
  yield takeLatest(ActionType.GET_MINE_DETAIL, getMyDetail);
  yield takeLatest(ActionType.GET_WALLET_SUMMARY, getWalletSummary);
}

export default function* userSagas() {
  yield all([fork(watchUserSagas)]);
}
