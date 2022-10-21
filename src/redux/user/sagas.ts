import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {Actions} from './actions';
import {ActionType} from './types';
import {ActionWithPayload} from '../types';
import {GoLoginParams, MyWorkTabType, UserWorkTabType, WorkF, WorkList} from '../../models';
import * as api from '../../apis';
import {navigateBack, navigateTo, relaunch} from '../../router/Router';
import {RootState} from '../reducers';
import {OrderActions, SPUActions, WorkActions} from '../actions';
import {PagedData} from '../../fst/models';

function* logout(): any {
  yield put(CommonActions.setConfig({token: ''}));
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
  const token = action.payload;
  yield put(CommonActions.setConfig({token}));
  yield put(Actions.getMyDetail());
  const params: GoLoginParams = yield select((state: RootState) => state.user.login);
  if (!params) {
    relaunch();
  } else {
    if (params?.back) {
      navigateBack();
    } else {
      navigateTo(params?.to || 'Tab', params?.params, params?.redirect);
    }
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

function* loadBankCards(): any {
  try {
    const bankCards = yield call(api.user.getMyBankCardList);
    yield put(Actions.loadBankCardsSuccess(bankCards));
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

function* loadMyWork(action: ActionWithPayload<ActionType, {replace?: boolean; tabType: MyWorkTabType}>): any {
  const {replace, tabType} = action.payload;
  const workList: WorkList = yield select((state: RootState) => state.user.myWorks[tabType]);
  const {index, status, list} = workList;
  if (status !== 'loading') {
    return;
  }
  try {
    const pageIndex = replace ? 1 : index + 1;
    const pageSize = 10;
    const data: PagedData<WorkF[]> = yield call(api.work.getMyWorkList, tabType, {pageIndex, pageSize});
    let newList: WorkF[] = [];
    if (!replace) {
      newList = list.concat(data.content);
    } else {
      newList = data.content;
    }
    yield put(
      Actions.loadMyWorkSuccess(tabType, {
        list: newList,
        index: pageIndex,
        status: data.content.length < pageSize ? 'noMore' : 'none',
      }),
    );
  } catch (error) {
    yield put(Actions.loadMyWorkFail(tabType));
    yield put(CommonActions.error(error));
  }
}

function* loadOtherWork(action: ActionWithPayload<ActionType, {tabType: UserWorkTabType; userId: number; replace?: boolean}>) {
  const {userId, tabType, replace} = action.payload;
  const stringId = String(userId);
  const workList: WorkList = yield select((state: RootState) => state.user.otherUserWorks[stringId]?.works[tabType]);
  const {index, status, list} = workList;
  if (status !== 'loading') {
    return;
  }
  try {
    const pageIndex = replace ? 1 : index + 1;
    const pageSize = 10;
    const data: PagedData<WorkF[]> = yield call(api.work.getOtherUserWorkList, tabType, {userId, pageIndex, pageSize});
    let newList: WorkF[] = [];
    if (!replace) {
      newList = list.concat(data.content);
    } else {
      newList = data.content;
    }
    yield put(
      Actions.loadOtherWorkSuccess(
        tabType,
        {
          list: newList,
          index: pageIndex,
          status: data.content.length < pageSize ? 'noMore' : 'none',
        },
        userId,
      ),
    );
  } catch (error) {
    yield put(Actions.loadOtherWorkFail(tabType, userId));
    yield put(CommonActions.error(error));
  }
}

function* watchUserSagas() {
  yield takeLatest(ActionType.LOGOUT, logout);
  yield takeLatest(ActionType.LOGIN, login);
  yield takeLatest(ActionType.LOGIN_SUCCESS, loginSuccess);
  // yield takeLatest(ActionType.SET_USER_INFO, setUserInfo);
  yield takeLatest(ActionType.GET_WALLET_INFO, getWalletInfo);
  yield takeLatest(ActionType.GET_COUPON_LIST, getCouponList);
  yield takeLatest(ActionType.GET_MINE_DETAIL, getMyDetail);
  yield takeLatest(ActionType.GET_WALLET_SUMMARY, getWalletSummary);
  yield takeLatest(ActionType.LOAD_BANK_CARDS, loadBankCards);
  yield takeLatest(ActionType.LOAD_MY_WORK, loadMyWork);
  yield takeLatest(ActionType.LOAD_OTHER_WORK, loadOtherWork);
}

export default function* userSagas() {
  yield all([fork(watchUserSagas)]);
}
