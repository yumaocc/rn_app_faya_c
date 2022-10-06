import {SearchForm, SearchParam} from '../fst/models';
import {OrderF} from '../models';
import {OrderDetailF} from '../models';
import {OrderCommentForm, OrderForm, OrderPayState, PayOrder} from '../models/order';
import {post} from './helper';

export async function getOrderList(params: SearchParam): Promise<OrderF[]> {
  return await post('/order/page', params);
}

export async function getOrderDetail(id: string): Promise<OrderDetailF> {
  return await post('/order/details', {id});
}
export async function makeOrder(params: OrderForm): Promise<PayOrder> {
  return await post('/order/pay', params);
}

export async function checkOrderPayState(id: string, type = 0): Promise<{status: OrderPayState; id: string}> {
  return await post('/order/paid/result', {id, type});
}

export async function orderRefund(params: SearchForm): Promise<boolean> {
  return await post('/order/refund', params);
}
export async function getOrderTempId(): Promise<string> {
  return await post('/order/paid/temp/id');
}

export async function payAgain(id: string): Promise<string> {
  return await post('/order/pay/again', {id});
}
export async function commentOrder(params: OrderCommentForm): Promise<boolean> {
  return await post('/order/comment/add/one', params);
}
