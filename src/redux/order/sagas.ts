import {takeLatest, all, fork, select, call, put} from 'redux-saga/effects';
import {SearchParam} from '../../fst/models';
import {LoadListState, OrderF} from '../../models';
import {RootState} from '../reducers';
import {ActionWithPayload} from '../types';
import {ActionType} from './types';
import * as api from '../../apis';
import {CommonActions} from '../actions';
import {Actions} from './actions';

function* loadOrders(action: ActionWithPayload<ActionType, SearchParam>): any {
  const orders: LoadListState<OrderF> = yield select((state: RootState) => state.order.orders);
  if (orders.status !== 'loading') {
    return;
  }
  try {
    let {status, name, replace} = action.payload || {};
    const pageIndex = replace ? 1 : orders.index + 1;
    const pageSize = 10;

    const res: OrderF[] = yield call(api.order.getOrderList, {pageIndex, pageSize, status: status === 'all' ? null : status, name});
    const newList: OrderF[] = replace ? res : orders.list.concat(res);
    yield put(Actions.loadOrdersSuccess({list: newList, index: pageIndex, status: res.length < pageSize ? 'noMore' : 'none'}));
  } catch (error) {
    yield put(Actions.loadOrdersFail());
    yield put(CommonActions.error(error));
  }
}

function* watchOrderSagas() {
  yield takeLatest(ActionType.LOAD_ORDERS, loadOrders);
}

export default function* orderSagas() {
  yield all([fork(watchOrderSagas)]);
}
