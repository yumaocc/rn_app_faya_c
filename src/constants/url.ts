export function getBaseURL(): string {
  // 生产环境
  return 'https://api.faya.life';
  // return 'https://api-beta.faya.life';
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
