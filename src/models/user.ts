import {Asset} from 'react-native-image-picker';
import {BoolEnum} from '../fst/models';
import {ValidRoute} from './route';

export enum UserState {
  NORMAL = 0,
  BLOCKED = 1, // 禁止登录
}

export interface UserInfo {
  id: number;
  telephone: string;
  status: UserState;
  token: string;
}

export interface GoLoginParams {
  to?: ValidRoute;
  back?: boolean;
  params?: any;
  redirect?: boolean;
}

export enum CouponState {
  Unused = 0,
  Used = 1,
  InvalidByRefund = 2,
  InvalidByDirect = 3,
}

export enum CouponFilterState {
  Unused = 0,
  Used = 1,
  Invalid = 2,
}

export enum CouponType {
  NoLimit = 0,
}

export interface CouponF {
  id: number;
  bindUserId: number;
  bindUserTime: string; // 领取时间
  amountThreshold: number; // 满多少可用
  createdByCom: number; // 创建人
  createdTime: string;
  justInvalidTime: string; // 直接作废时间
  justInvalidUserIdCom: number; // 操作直接作废的公司员工
  money: number; // 优惠券金额
  moneyYuan: string;
  name: string; // 优惠券名字
  refundInvalidTime: string; // 退款作废时间
  status: CouponState;
  type: CouponType;
  usedMoney: number; // 已使用金额
  usedTime: string; // 使用时间
}

export enum UserCertificationStatus {
  UnSubmit = 0,
  Success = 1,
  Failed = 2,
  Checking = 3,
}

export interface UserCertificationDetail {
  id: number;
  bankCard: string;
  bankCompanyName: string;
  bankTelephone: string;
  cardholder: string;
  idCard: string;
  idCardBack: string;
  idCardBackOss: string;
  idCardFront: string;
  idCardFrontOss: string;
  reason: string;
  status: UserCertificationStatus;
}

export interface WalletInfo {
  money: number;
  moneyYuan: string;
  numberOfCards: number;
  numberOfBankCards: number;
  cardholder: string;
  status: UserCertificationStatus;
  details: UserCertificationDetail;
}

// 我的用户信息
export interface MineDetail {
  account: string;
  nickName: string;
  age: string;
  avatar: string;
  backgroudPic: string;
  level: number;
  say: string;
  nums: {
    fansNums: number;
    followNums: number;
    likeNums: number;
  };
}

export interface OtherUserDetail extends MineDetail {
  hasCare: BoolEnum;
}

export enum UserLevel {
  NORMAL = 0,
}

export interface WalletSummary {
  level: UserLevel;
  canWithdrawalMoney: number;
  canWithdrawalMoneyYuan: string;
  earningsToday: number;
  earningsTodayYuan: string;
  stagingMoney: number;
  stagingMoneyYuan: string;
  totalMoney: number;
  totalMoneyYuan: string;
}

// export interface SystemNotifySummary {
//   interactiveMessageCount: number;
//   newestFriendCount: number;
//   systemNotificationCount: number;
//   windowMessageCount: number;
// }

export interface UserCertificationForm {
  cardNo: string; // 银行卡号
  code: string; // 验证码
  idCardBack: string;
  _idCardBack: Asset;
  idCardBackOss: string;
  idCardFront: string;
  _idCardFront: Asset;
  idCardFrontOss: string;
  idNo: string; // 身份证号
  mobileNo: string; // 手机号
  name: string; // 姓名
}

export interface BankCardF {
  id: number;
  accountNo: string;
  bankCode: string; // 银行代码
  bankCodeName: string; // 银行名称
}
