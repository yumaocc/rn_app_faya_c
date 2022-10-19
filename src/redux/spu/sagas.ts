import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';
import {ActionWithPayload} from '../types';
import {ActionType} from './types';
import * as api from '../../apis';
import {CommonActions} from '../actions';
import {LoadListState, SPUDetailF, SPUF} from '../../models';
import {Actions} from './actions';
import {RootState} from '../reducers';

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

function* loadSearchSPUForWork(action: ActionWithPayload<ActionType, {name: string; replace?: boolean}>): any {
  const {replace, name} = action.payload;
  const spuList: LoadListState<SPUF> = yield select((state: RootState) => state.spu.spuListForWork);
  const {list, status, index} = spuList;
  if (status !== 'loading') {
    return;
  }
  try {
    const pageIndex = replace ? 1 : index + 1;
    const pageSize = 10;
    const data: SPUF[] = yield call(api.spu.getSpuList, {pageIndex, pageSize, name});
    let newList: SPUF[] = [];
    if (!replace) {
      newList = list.concat(data);
    } else {
      newList = data;
    }
    yield put(
      Actions.loadSearchSPUForWorkSuccess({
        list: newList,
        index: pageIndex,
        status: data.length < pageSize ? 'noMore' : 'none',
      }),
    );
  } catch (error) {
    yield put(Actions.loadSearchSPUForWorkFail());
    yield put(CommonActions.error(error));
  }
}

function* loadShowCaseSPU(action: ActionWithPayload<ActionType, boolean>) {
  const replace = action.payload;
  const spuList: LoadListState<SPUF> = yield select((state: RootState) => state.spu.showCaseSPUList);
  const {list, status, index} = spuList;
  if (status !== 'loading') {
    return;
  }
  try {
    const pageIndex = replace ? 1 : index + 1;
    const pageSize = 10;
    const data: SPUF[] = yield call(api.spu.getShowcaseSPUList, {pageIndex, pageSize});
    let newList: SPUF[] = [];
    if (!replace) {
      newList = list.concat(data);
    } else {
      newList = data;
    }
    yield put(
      Actions.loadShowCaseSPUSuccess({
        list: newList,
        index: pageIndex,
        status: data.length < pageSize ? 'noMore' : 'none',
      }),
    );
  } catch (error) {
    yield put(Actions.loadShowCaseSPUFail());
    yield put(CommonActions.error(error));
  }
}

function* watchSPUSagas() {
  yield takeLatest(ActionType.VIEW_SPU, viewSPU);
  yield takeLatest(ActionType.LOAD_SEARCH_SPU_FOR_WORK, loadSearchSPUForWork);
  yield takeLatest(ActionType.LOAD_SHOW_CASE_SPU, loadShowCaseSPU);
  // yield takeLatest(ActionType.LOGOUT, logout);
  // yield takeLatest(ActionType.SET_USER_INFO, setUserInfo);
}

export default function* spuSagas() {
  yield all([fork(watchSPUSagas)]);
}
