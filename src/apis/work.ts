import {SearchParam} from '../fst/models';
import {PhotoUploadAuth, PhotoUploadAuthParams, VideoUploadAuth, VideoUploadAuthParams, WorkDetailF, WorkPublishForm, WorkType} from '../models';
import {post} from './helper';

// 推荐视频列表
export async function getRecommendWorks(params: SearchParam) {
  return await post('/video/main/newest/list', params);
}

// 关注的视频列表
export async function getFollowWorks(params: SearchParam) {
  return await post('/video/main/care/page', params);
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

export async function getPublishMainID(type: WorkType): Promise<string> {
  return await post('/video/main/vod/init/main/id', {type});
}

export async function getUploadVideoAuth(params: VideoUploadAuthParams): Promise<VideoUploadAuth> {
  return await post('/video/main/vod/get/pass', params);
}
export async function getUploadPhotoAuth(params: PhotoUploadAuthParams): Promise<PhotoUploadAuth> {
  return await post('/video/main/vod/get/photo/pass', params);
}

export async function realPublish(params: WorkPublishForm): Promise<boolean> {
  return await post('/video/main/vod/content/add', params);
}
