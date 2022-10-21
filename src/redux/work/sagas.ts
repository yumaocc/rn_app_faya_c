import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {ActionType} from './types';
import {ActionWithPayload} from '../types';
import {WorkF, WorkList, WorkTabType} from '../../models';
import * as api from '../../apis';
import {RootState} from '../reducers';
import {Actions} from './actions';
import {PagedData, SearchParam} from '../../fst/models';
import {getLocation} from '../../helper/system';

function* loadWork(action: ActionWithPayload<ActionType, {replace?: boolean; tabType: WorkTabType}>): any {
  const {replace, tabType} = action.payload;
  const workList: WorkList = yield select((state: RootState) => state.work.works[tabType]);
  const {index, status, list} = workList;
  if (status !== 'loading') {
    return;
  }
  try {
    const pageIndex = replace ? 1 : index + 1;
    const pageSize = 10;
    let search: SearchParam = {pageIndex, pageSize};
    if (tabType === WorkTabType.Nearby) {
      try {
        const {coords} = yield getLocation();
        const {latitude, longitude} = coords;
        search = {...search, latitude, longitude};
      } catch (error) {
        // 没有定位就静默失败
      }
    }
    const data: PagedData<WorkF[]> = yield call(api.work.getWorkList, tabType, search);
    let newList: WorkF[] = [];
    if (!replace) {
      newList = list.concat(data.content);
    } else {
      newList = data.content;
    }
    yield put(
      Actions.loadWorkSuccess(
        {
          list: newList,
          index: pageIndex,
          status: data.content.length < pageSize ? 'noMore' : 'none',
        },
        tabType,
      ),
    );
  } catch (error) {
    yield put(Actions.loadWorkFail(tabType));
    yield put(CommonActions.error(error));
  }
}

function* watchWorkSagas() {
  yield takeLatest(ActionType.LOAD_WORK, loadWork);
}

export default function* workSagas() {
  yield all([fork(watchWorkSagas)]);
}
