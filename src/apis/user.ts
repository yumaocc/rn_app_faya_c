import RNFS from 'react-native-fs';
import {post} from './helper';
import {
  AgentHomeInfo,
  BankCardF,
  CouponF,
  CouponFilterState,
  LocationCity,
  MineDetail,
  ModifyProfileForm,
  MyCodeUrl,
  OtherUserDetail,
  UserCertificationForm,
  UserExpressAddress,
  UserInfo,
  WalletInfo,
  WalletSummary,
  WithdrawalRecord,
} from '../models';
import {Platform} from 'react-native';
import {SearchParam} from '../fst/models';

export async function userLogin(params: SearchParam): Promise<UserInfo> {
  return await post<UserInfo, SearchParam>('/user/login', params);
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

export async function getCodeUrl(): Promise<MyCodeUrl> {
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

// 上传实名认证信息
// type: 0 普通, 1 营业执照, 2 身份证正面, 3 身份证反面, 4 银行卡
export async function uploadCertificationFile(uri: string, fileName: string, type: number): Promise<any> {
  const formData = new FormData();
  let newUri = uri;
  if (Platform.OS === 'ios') {
    // ios上后缀名称为jpg会导致上传的图片尺寸变大。见： https://github.com/facebook/react-native/issues/27099
    newUri = uri + '.upload';
    await RNFS.copyFile(uri, newUri);
  }
  const file = {uri: newUri, type: 'image/jpeg', name: fileName};
  formData.append('file', file as any);
  formData.append('type', String(type));
  formData.append('withWho', 'consumer');
  return await post('/yeepay/file/upload', formData, {headers: {'Content-Type': 'multipart/form-data'}});
}

export async function userCertification(form: UserCertificationForm): Promise<boolean> {
  return await post('/yeepay/create/personal', form);
}

// type: 9个人实名认证
export async function sendMainVerifyCode(phone: string, type = 0): Promise<boolean> {
  return await post('/msg/main/verify/code', {telephone: phone, type});
}

export async function getMyBankCardList(): Promise<BankCardF[]> {
  return await post('/user/wallet/bank/card/list');
}

export async function addNewBankCard(bankCard: string): Promise<boolean> {
  return await post('/user/wallet/add/bank/card', {bankCard});
}

export async function unBindBankCard(id: number): Promise<boolean> {
  return await post('/user/wallet/remove/bank/card', {bankCardId: id});
}

export async function userWithDraw(money: number, accountId: number): Promise<boolean> {
  return await post('/yeepay/withdraw/money', {money, type: 'consumer', accountId});
}
export async function agentInfo(): Promise<AgentHomeInfo> {
  return await post('/user/agent/info');
}

export async function getLocationByGPS(latitude: number, longitude: number): Promise<LocationCity> {
  return await post('/location/with/company/by/gps', {latitude, longitude});
}

export async function getWithdrawRecord(params: SearchParam): Promise<WithdrawalRecord[]> {
  return await post('/user/withdrawal/log/page', params);
}
export async function modifyProfile(params: ModifyProfileForm): Promise<boolean> {
  return await post('/user/modify/info', params);
}

// 注册达人
export async function agentRegister(shareUserId: string): Promise<number> {
  return await post('/user/become/talent', {shareUserId});
}

// 游客id
export async function getTouristId(): Promise<string> {
  const res = await post<{touristsSnowId: string}, unknown>('/user/tourists/create/one');
  return res?.touristsSnowId;
}

// 收货地址相关
// 新增收货地址
export async function addNewAddress(params: SearchParam): Promise<boolean> {
  return await post('/user/address/add/one', params);
}
// 收货地址列表
export async function getAddressList(params: SearchParam): Promise<UserExpressAddress[]> {
  return await post('/user/address/my/list', params);
}
// 编辑收货地址
export async function editAddress(params: Partial<UserExpressAddress>): Promise<boolean> {
  return await post('/user/address/modify/one', params);
}
// 删除收货地址
export async function deleteAddress(id: number): Promise<boolean> {
  return await post('/user/address/del/one', {id});
}
