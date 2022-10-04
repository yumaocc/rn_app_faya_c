import {Dispatch} from 'redux';
import {PayOrder} from '../../models';
import {Actions} from './actions';

export interface OrderDispatcher {
  setPayOrder: (payOrder: PayOrder) => void;
  loadOrders: (status?: string, name?: string, replace?: boolean) => void;
}

export const getOrderDispatcher = (dispatch: Dispatch): OrderDispatcher => ({
  setPayOrder: (payOrder: PayOrder) => dispatch(Actions.setPayOrder(payOrder)),
  loadOrders: (status?: string, name?: string, replace?: boolean) => dispatch(Actions.loadOrders({status, name, replace})),
});
