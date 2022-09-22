import {Dispatch} from 'redux';
import {PayOrder} from '../../models';
import {Actions} from './actions';

export interface OrderDispatcher {
  setPayOrder: (payOrder: PayOrder) => void;
}

export const getOrderDispatcher = (dispatch: Dispatch): OrderDispatcher => ({
  setPayOrder: (payOrder: PayOrder) => dispatch(Actions.setPayOrder(payOrder)),
});
