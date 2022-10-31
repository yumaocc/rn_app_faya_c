import {all, call, put, takeLatest} from 'redux-saga/effects';

import {Actions as UserActions} from '../user/actions';
import {Actions} from './actions';
import {ActionType} from './types';
import {resetBaseURL, resetToken} from '../../apis/helper';
import {ERROR_SHOW_TIME, getBaseURL} from '../../constants';
import {wait} from '../../fst/helper';
// import {cache} from '../../helper/cache';
import {ActionWithPayload} from '../types';
import {getItem, setItem} from '../../helper/cache/helper';
import {SystemConfig} from '../../models';
import * as api from '../../apis';
// import {UserInfo} from '../../models';

function* initApp(): any {
  const url = getBaseURL();
  resetBaseURL(url);

  const config: SystemConfig = {
    token: (yield getItem('token')) || '',
    phone: (yield getItem('phone')) || '',
    locationName: (yield getItem('locationName')) || '成都',
    locationId: Number(yield getItem('locationId')) || 19,
    shareUserId: (yield getItem('shareUserId')) || null,
    touristId: Number(yield getItem('touristId')) || null,
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

// function* setToken(action: ActionWithPayload<ActionType, string>) {
//   const token = action.payload;
//   resetToken(token);
//   yield cache.config.setToken(token);
// }

function* setConfig(action: ActionWithPayload<ActionType, Partial<SystemConfig>>) {
  const config = action.payload;
  Object.keys(config).forEach(key => {
    if (key === 'token') {
      resetToken(config.token);
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
