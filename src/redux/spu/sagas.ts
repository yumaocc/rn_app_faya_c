import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import {ActionWithPayload} from '../types';
import {ActionType} from './types';
import * as api from '../../apis';
import {CommonActions} from '../actions';
import {SPUDetailF} from '../../models';
import {Actions} from './actions';

function* viewSPU(action: ActionWithPayload<ActionType, number>) {
  const id = action.payload;
  try {
    const detail: SPUDetailF = yield call(api.spu.getSPUDetail, id);
    yield put(Actions.setCurrentSPU(detail));
    if (detail?.skuList?.length) {
      yield put(Actions.setCurrentSKU(detail.skuList[0], false));
    } else if (detail?.packageDetailsList?.length) {
      yield put(Actions.setCurrentSKU(detail.packageDetailsList[0], true));
    }
  } catch (error) {
    yield put(CommonActions.error(error));
  }
}

function* watchSPUSagas() {
  yield takeLatest(ActionType.VIEW_SPU, viewSPU);
  // yield takeLatest(ActionType.LOGOUT, logout);
  // yield takeLatest(ActionType.SET_USER_INFO, setUserInfo);
}

export default function* spuSagas() {
  yield all([fork(watchSPUSagas)]);
}
