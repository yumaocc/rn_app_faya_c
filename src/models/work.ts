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
