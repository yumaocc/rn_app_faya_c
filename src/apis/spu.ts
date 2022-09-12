import {SearchParam} from '../fst/models';
import {SPUDetailF, SPUF} from '../models';
import {post} from './helper';

export async function getSpuList(params: SearchParam): Promise<SPUF[]> {
  return await post('/spu/list/with/recent', params);
}

export async function getSPUDetail(id: number): Promise<SPUDetailF> {
  return await post('/spu/details', {id});
}
export async function getShowcaseSPUList(params: SearchParam): Promise<SPUF[]> {
  return await post('/user/showcase/spu/page', params);
}
