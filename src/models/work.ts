import {BoolEnum} from '../fst/models';

export enum WorkTabType {
  Follow = 'Follow',
  Recommend = 'Recommend',
  Nearby = 'Nearby',
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
  mainId?: number;
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
}
export interface WorkDetailF {
  mainId: string;
  numberOfCollects: number;
  numberOfLikes: number;
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
}
