import {BoolEnum} from '../fst/models';
import {LoadingState} from './common';

export enum WorkTabType {
  Follow = 'Follow',
  Recommend = 'Recommend',
  Nearby = 'Nearby',
}

// 个人中心的作品tab类型
export enum MyWorkTabType {
  Work = 1,
  Private = 2,
  Like = 3,
  Collect = 4,
}

export interface WorkTab {
  title: string;
  key: string;
  type: WorkTabType;
}

export enum WorkType {
  Video = 0,
  Photo = 1,
}

export enum WorkVisibleAuth {
  Public = 0,
  Private = 1,
  Friend = 2,
}

export interface WorkPublishForm {
  addressDetails?: string;
  allowedDownload?: BoolEnum;
  allowedForward?: BoolEnum;
  bindSpuId?: number;
  content?: string;
  coverPic?: string;
  hasPrivate?: WorkVisibleAuth;
  latitude?: number;
  longitude?: number;
  mainId?: string;
  type?: WorkType;
}

export interface WorkF {
  mainId: string;
  type: WorkType;
  coverImage: string;
  videoUrl: string;
  userName: string;
  userAvatar: string;
  numberOfLikes: number;
  content: string;
  liked: BoolEnum;
}

export interface WorkList {
  list: WorkF[];
  index: number;
  status: LoadingState;
}

export interface WorkFile {
  coverPic: string;
  videoUrl: string; // 图片也取这个地址
}
export interface WorkDetailF {
  mainId: string;
  numberOfCollects: number;
  numberOfLikes: number;
  fileList: WorkFile[];
  liked: BoolEnum;
  collected: BoolEnum;
  numberOfComments: number;
  spuId?: number;
  spuName: string;
  theRemainingNumberOfDays: number;
  type: WorkType;
  userId: number;
  userName: string;
  // TODO: 缺了用户头像，不过不着急，暂时也没有头像
  content: string;
}

export interface VideoInfo {
  duration: number;
  path: string;
  coverPath: string;
  fileName: string;
}

export interface PublishConfig {
  allowDownload: BoolEnum;
  allowForward: BoolEnum;
  hasPrivate: WorkVisibleAuth;
  autoSaveAfterPublish: boolean;
  addressName?: string;
  latitude?: number;
  longitude?: number;
  content: string;
  publishType: WorkType;
}

export interface VideoUploadAuthParams {
  description?: string;
  fileName: string;
  mainId: string;
  tags?: string;
  title: string;
}

export interface VideoUploadAuth {
  uploadAddress: string;
  uploadAuth: string;
}

export interface PhotoUploadAuthParams {
  imageExt?: string;
  imageType?: 'cover' | 'default';
  mainId: string;
}

export interface PhotoUploadAuth {
  uploadAddress: string;
  uploadAuth: string;
}

export enum UserWorkTabType {
  Work = 1,
  // Private = 2,
  Like = 3,
  // Collect = 4,
}
export interface UserTab {
  title: string;
  type: UserWorkTabType;
}
export interface UserCenterWork {
  id: number;
  tabs: UserTab[];
  currentTabType: UserWorkTabType;
  works: {
    [UserWorkTabType.Work]: WorkList;
    [UserWorkTabType.Like]: WorkList;
  };
}
