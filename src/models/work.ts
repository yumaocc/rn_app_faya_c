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
