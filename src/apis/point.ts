/**
 * 埋点数据上报
 */

import {post} from './helper';

// 用户开始观看作品时触发
export async function reportWorkPreview(mainId: string) {
  return await post('/video/main/preview/one', {mainId});
}

// 用户观看作品结束时触发
export async function reportWorkWatchFinished(mainId: string) {
  return await post('/video/main/watch/finished/one', {mainId});
}
