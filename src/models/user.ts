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
