import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';

import {Actions as CommonActions} from '../common/actions';
import {ActionType} from './types';
import {ActionWithPayload} from '../types';
import {WorkF, WorkList, WorkTabType} from '../../models';
import * as api from '../../apis';
import {RootState} from '../reducers';
import {Actions} from './actions';
import {PagedData} from '../../fst/models';

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
    const data: PagedData<WorkF[]> = yield call(api.work.getWorkList, tabType, {pageIndex, pageSize});
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
