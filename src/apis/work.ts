import {PagedData, SearchParam} from '../fst/models';
import {PhotoUploadAuth, PhotoUploadAuthParams, VideoUploadAuth, VideoUploadAuthParams, WorkDetailF, WorkF, WorkPublishForm, WorkTabType, WorkType} from '../models';
import {post, postPaged} from './helper';

export async function getWorkList(type: WorkTabType, params: SearchParam): Promise<PagedData<WorkF[]>> {
  let url = '';
  switch (type) {
    case WorkTabType.Follow:
      url = '/video/main/care/page';
      break;
    case WorkTabType.Recommend:
      url = '/video/main/newest/list';
      break;
    case WorkTabType.Nearby:
      url = '/video/main/newest/list';
      break;
  }
  if (url) {
    return await postPaged(url, params);
  }
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
