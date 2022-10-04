import produce from 'immer';
import {LoadListState, OrderF, PayOrder} from '../../models';
import {OrderActions} from './actions';
import {ActionType} from './types';

export interface OrderState {
  payOrder?: PayOrder;
  orders: LoadListState<OrderF>;
}

export const initialState: OrderState = {
  orders: {
    list: [],
    index: 0,
    status: 'none',
  },
};

export default (state = initialState, action: OrderActions): OrderState => {
  switch (action.type) {
    case ActionType.SET_PAY_ORDER:
      return produce(state, draft => {
        draft.payOrder = action.payload;
      });
    case ActionType.LOAD_ORDERS:
      return produce(state, draft => {
        const orders = state.orders;
        let {replace} = action.payload || {};
        if (replace) {
          draft.orders.list = [];
        }
        if (replace || orders.status === 'none') {
          draft.orders.status = 'loading';
        }
      });
    case ActionType.LOAD_ORDERS_SUCCESS:
      return produce(state, draft => {
        draft.orders = action.payload;
      });
    case ActionType.LOAD_ORDERS_FAIL:
      return produce(state, draft => {
        draft.orders.status = 'none';
      });
    case ActionType.RESET:
      return initialState;
    default:
      return state;
  }
};
