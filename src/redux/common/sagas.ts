import {all, put, takeLatest} from 'redux-saga/effects';

import {Actions as UserActions} from '../user/actions';
import {Actions} from './actions';
import {ActionType} from './types';
import {resetBaseURL, resetToken} from '../../apis/helper';
import {ERROR_SHOW_TIME, getBaseURL} from '../../constants';
import {wait} from '../../fst/helper';
import {cache} from '../../helper/cache';
import {ActionWithPayload} from '../types';
// import * as api from '../../apis';
// import {UserInfo} from '../../models';

function* initApp(): any {
  const url = getBaseURL();
  resetBaseURL(url);

  yield put(UserActions.init()); // 去加载用户那边的缓存

  const token = (yield cache.config.getToken()) || '';
  resetToken(token);
  try {
    // const userInfo = (yield call(api.user.getUserInfo)) as UserInfo;
    yield put(Actions.setToken(token));
    // yield put(UserActions.setUserInfo(userInfo));
  } catch (error) {}
  yield put(Actions.initAppSuccess());
}

function* dismissMessage() {
  yield wait(ERROR_SHOW_TIME);
  yield put(Actions.dismissMessage());
}

function* setToken(action: ActionWithPayload<ActionType, string>) {
  const token = action.payload;
  resetToken(token);
  yield cache.config.setToken(token);
}

function* watchCommonSagas() {
  yield takeLatest(ActionType.ERROR, dismissMessage);
  yield takeLatest(ActionType.SUCCESS, dismissMessage);
  yield takeLatest(ActionType.INFO, dismissMessage);
  yield takeLatest(ActionType.INIT_APP, initApp);
  yield takeLatest(ActionType.SET_TOKEN, setToken);
}

export default function* commonSagas() {
  yield all([watchCommonSagas()]);
}
