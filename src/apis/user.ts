import {post} from './helper';
import {CouponF, MineDetail, UserInfo, WalletInfo, WalletSummary} from '../models';

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

export async function getCouponList(): Promise<CouponF[]> {
  return await post('/coupon/main/mine/can/use/list');
}

export async function getMineDetail(): Promise<MineDetail> {
  return await post('/user/mine/info');
}

export async function getCodeUrl(): Promise<{datingQrCodeUrl: string; shareQrCodeUrl: string}> {
  return await post('/user/qr/result');
}
