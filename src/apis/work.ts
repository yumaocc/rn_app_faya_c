import {SearchParam} from '../fst/models';
import {post} from './helper';

export async function getRecommendWorks(params: SearchParam) {
  return await post('/video/main/newest/list', params);
}
