import {post} from './helper';
import {CouponF, CouponFilterState, MineDetail, OtherUserDetail, UserInfo, WalletInfo, WalletSummary} from '../models';

export async function userLogin(phone: string, code: string): Promise<UserInfo> {
  return await post<UserInfo, {code: string; telephone: string}>('/user/login', {
    telephone: phone,
    code,
  });
}

// 发送验证码
export async function sendVerifyCode(phone: string) {
  return await post<boolean, {telephone: string}>('/user/login/verify/code', {
    telephone: phone,
  });
}

export async function getWallet(): Promise<WalletInfo> {
  return await post('/user/wallet/mine/info');
}

export async function getWalletSummary(): Promise<WalletSummary> {
  return await post('/user/wallet/mine/info/with/bean/sprouts');
}

export async function getCouponList(status: CouponFilterState = 0): Promise<CouponF[]> {
  return await post('/coupon/main/mine/can/use/list', {status});
}

export async function getMineDetail(): Promise<MineDetail> {
  return await post('/user/mine/info');
}

export async function getCodeUrl(): Promise<{datingQrCodeUrl: string; shareQrCodeUrl: string}> {
  return await post('/user/qr/result');
}

export async function getOtherUserInfo(id: number): Promise<OtherUserDetail> {
  return await post('/user/other/user/info', {id});
}

export async function followUser(id: number): Promise<boolean> {
  return await post('/user/fans/follow/one', {id});
}

// // 通知
// export async function systemNotifyCount(): Promise<boolean> {
//   return await post('/user/msg/official/notice/count');
// }

// export async function userMessageList(): Promise<boolean> {
//   return await post('/user/msg/list');
// }
