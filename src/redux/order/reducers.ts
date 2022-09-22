import produce from 'immer';
import {PayOrder} from '../../models';
import {OrderActions} from './actions';
import {ActionType} from './types';

export interface OrderState {
  payOrder?: PayOrder;
}

export const initialState: OrderState = {};

export default (state = initialState, action: OrderActions): OrderState => {
  switch (action.type) {
    case ActionType.SET_PAY_ORDER:
      return produce(state, draft => {
        draft.payOrder = action.payload;
      });
    default:
      return state;
  }
};
