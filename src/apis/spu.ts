import {DateTimeString, SearchParam} from '../fst/models';
import {DayBookingModelF, SPUDetailF, SPUF} from '../models';
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

export async function getBookingModal(skuId: number, beginTime: DateTimeString, endTime: DateTimeString): Promise<DayBookingModelF[]> {
  return await post('/spu/date/stock/month', {skuId, beginTime, endTime});
}

export async function collectSPU(id: number): Promise<boolean> {
  return await post('/user/spu/collect/one', {id});
}

export async function joinToShowCase(id: number): Promise<boolean> {
  return await post('/user/showcase/spu/add/one', {id});
}
