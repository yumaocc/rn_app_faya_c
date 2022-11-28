import {all, call, put, takeLatest} from 'redux-saga/effects';

import {Actions as UserActions} from '../user/actions';
import {Actions} from './actions';
import {ActionType} from './types';
import {resetBaseURL, resetToken} from '../../apis/helper';
import {ERROR_SHOW_TIME, getBaseURL} from '../../constants';
import {wait} from '../../fst/helper';
import {ActionWithPayload} from '../types';
import {getItem, setItem} from '../../helper/cache/helper';
import {SystemConfig} from '../../models';
import * as api from '../../apis';

function* initApp(): any {
  const url = getBaseURL();
  resetBaseURL(url);

  const config: SystemConfig = {
    token: (yield getItem('token')) || '',
    phone: (yield getItem('phone')) || '',
    locationName: (yield getItem('locationName')) || '成都',
    locationId: Number(yield getItem('locationId')) || 19,
    shareUserId: (yield getItem('shareUserId')) || null,
    touristId: (yield getItem('touristId')) || null,
    buyUserName: (yield getItem('buyUserName')) || '',
    buyUserPhone: (yield getItem('buyUserPhone')) || '',
  };
  if (!config.touristId) {
    try {
      const touristId = yield call(api.user.getTouristId);
      config.touristId = touristId;
    } catch (error) {}
  }
  yield put(Actions.setConfig(config));

  resetToken(config.token);

  if (config.token) {
    yield put(UserActions.getMyDetail());
  }
  yield put(Actions.initAppSuccess());
}

function* dismissMessage() {
  yield wait(ERROR_SHOW_TIME);
  yield put(Actions.dismissMessage());
}

function* setConfig(action: ActionWithPayload<ActionType, Partial<SystemConfig>>): any {
  const config = action.payload;
  // app 是否正在初始化，如果在初始化，不要保存到本地，防止应用审核不通过（用户同意隐私政策前，不应写入SD卡数据）
  // const isLoading: boolean = yield select((state: RootState) => state.common.isLoading);

  Object.keys(config).forEach(key => {
    if (key === 'token') {
      resetToken(config.token);
    }
    const val = config[key];
    if (val === null || val === undefined) {
      return;
    }
    setItem(key, config[key]);
  });
}

function* watchCommonSagas() {
  yield takeLatest(ActionType.ERROR, dismissMessage);
  yield takeLatest(ActionType.SUCCESS, dismissMessage);
  yield takeLatest(ActionType.INFO, dismissMessage);
  yield takeLatest(ActionType.INIT_APP, initApp);
  // yield takeLatest(ActionType.SET_TOKEN, setToken);
  yield takeLatest(ActionType.SET_CONFIG, setConfig);
}

export default function* commonSagas() {
  yield all([watchCommonSagas()]);
}
