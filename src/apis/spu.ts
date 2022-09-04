import {SearchParam} from '../fst/models';
import {SPUF} from '../models';
import {post} from './helper';

export async function getSpuList(params: SearchParam): Promise<SPUF[]> {
  return await post('/spu/list/with/recent', params);
}
