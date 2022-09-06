import {SearchParam} from '../fst/models';
import {OrderF} from '../models';
import {post} from './helper';

export async function getOrderList(params: SearchParam): Promise<OrderF[]> {
  return await post('/order/page', params);
}
