import {cleanPrivateProperty} from '../fst/helper';
import {SearchParam} from '../fst/models';
import {OrderBookingForm, OrderF} from '../models';
import {OrderDetailF} from '../models';
import {OrderBookingDetailF, OrderCommentForm, OrderForm, OrderPayState, OrderRefundForm, PayOrder} from '../models';
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

export async function orderRefund(params: OrderRefundForm): Promise<boolean> {
  return await post('/order/refund', cleanPrivateProperty(params));
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

export async function skuBookingDetail(orderSmallId: string): Promise<OrderBookingDetailF> {
  return await post('/order/details/with/booking', {orderSmallId});
}

export async function booking(bookingForm: OrderBookingForm) {
  return await post('/order/booking/order', bookingForm);
}

// 取消预约
export async function cancelBooking(orderSmallId: string): Promise<boolean> {
  return await post('/order/booking/cancel', {orderSmallId});
}

export async function checkExpress(): Promise<any> {
  return await post('/order/express/inquiry', {no: 'JD0076704732627', telephone: '17726582214'});
}
