import {WxLaunchMiniProgramType} from '../native-modules/Wechat';
import {getEnv} from './env';

export function getBaseURL(): string {
  const env = getEnv();
  switch (env) {
    case 'development':
      return 'https://api-beta.faya.life';
    // return 'https://api.faya.life';
    case 'production':
    default:
      return 'https://api.faya.life';
  }
}

export function getWxLaunchMiniProgramType(): WxLaunchMiniProgramType {
  const env = getEnv();
  switch (env) {
    case 'development':
      return WxLaunchMiniProgramType.Preview; // 跳转开发版会导致场景值不正确，无法返回APP，所以开发环境跳转到体验版
    case 'production':
    default:
      return WxLaunchMiniProgramType.Release;
  }
}

// 隐私政策网址
export const PRIVACY_POLICY_URL = 'https://faya-manually-file.faya.life/protocol/faya-privacy.html';

// 用户协议
export const USER_AGREEMENT_URL = 'https://faya-manually-file.faya.life/protocol/faya-user.html';

export function getAliPayUrl(code: string) {
  return `alipays://platformapi/startapp?saId=10000007&clientVersion=3.7.0.0718&qrcode=${code}&_s=web-other`;
}
// https://cloud1-5gcdmvry620ba3e9-1313439264.tcloudbaseapp.com/jump.html

export function getWechatPayUrl(params: string) {
  return 'https://cloud1-5gcdmvry620ba3e9-1313439264.tcloudbaseapp.com/jump.html?' + params;
}
