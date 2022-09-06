import {SearchParam} from '../fst/models';
import {OrderF} from '../models';
import {OrderDetailF} from '../models/spu';
import {post} from './helper';

export async function getOrderList(params: SearchParam): Promise<OrderF[]> {
  return await post('/order/page', params);
}

export async function getOrderDetail(id: string): Promise<OrderDetailF> {
  return await post('/order/details', {id});
}
