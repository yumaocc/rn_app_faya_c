import {SearchParam} from '../../fst/models';
import {LoadListState, OrderF, PayOrder} from '../../models';
import {ActionsUnion, ActionWithPayload, createAction, Action} from '../types';
import {ActionType} from './types';

export const Actions = {
  reset: (): Action<ActionType.RESET> => createAction(ActionType.RESET),
  setPayOrder: (order: PayOrder): ActionWithPayload<ActionType.SET_PAY_ORDER, PayOrder> => createAction(ActionType.SET_PAY_ORDER, order),
  loadOrders: (payload: SearchParam): ActionWithPayload<ActionType.LOAD_ORDERS, SearchParam> => createAction(ActionType.LOAD_ORDERS, payload),
  loadOrdersSuccess: (payload: LoadListState<OrderF>): ActionWithPayload<ActionType.LOAD_ORDERS_SUCCESS, LoadListState<OrderF>> =>
    createAction(ActionType.LOAD_ORDERS_SUCCESS, payload),
  loadOrdersFail: (): Action<ActionType.LOAD_ORDERS_FAIL> => createAction(ActionType.LOAD_ORDERS_FAIL),
};

export type OrderActions = ActionsUnion<typeof Actions>;
