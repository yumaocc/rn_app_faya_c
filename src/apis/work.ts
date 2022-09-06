import {SearchParam} from '../fst/models';
import {WorkDetailF} from '../models';
import {post} from './helper';

export async function getRecommendWorks(params: SearchParam) {
  return await post('/video/main/newest/list', params);
}
export async function getWorkDetail(id: string): Promise<WorkDetailF> {
  return await post('/video/main/details', {id});
}

export async function likeWork(id: string): Promise<boolean> {
  return await post('/video/like/one', {id});
}

export async function collectWork(id: string): Promise<boolean> {
  return await post('/video/collect/one', {id});
}
