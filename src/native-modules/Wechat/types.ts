export enum WxLaunchMiniProgramType {
  Release = 0, // 正式版
  Test = 1, // 开发版
  Preview = 2, // 体验版
}
export interface WxLaunchMiniProgramOptions {
  userName: string;
  path?: string;
  type: WxLaunchMiniProgramType;
}
