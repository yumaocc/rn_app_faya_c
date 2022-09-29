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
  name: string; // 优惠券名字
  refundInvalidTime: string; // 退款作废时间
  status: CouponState;
  type: CouponType;
  usedMoney: number; // 已使用金额
  usedTime: string; // 使用时间
}

export interface WalletInfo {
  money: number;
  moneyYuan: string;
  numberOfCards: number;
}

// 我的用户信息
export interface MineDetail {
  account: string;
  nickName: string;
  age: string;
  avatar: string;
  backgroudPic: string;
  level: string;
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
