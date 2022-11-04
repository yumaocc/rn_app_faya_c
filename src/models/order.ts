import {BoolEnum, DateTimeString} from '../fst/models';
import {BookingType, PayChannel, PayWay} from './spu';

export interface OrderForm {
  addressId?: string; // 收货地址
  agentUserId?: string;
  amount: number;
  bizShopId?: number; // 预约店铺ID
  channel: PayChannel;
  couponId?: number; // 优惠券id
  idCard?: string;
  integralMoney?: number; // 代币抵扣
  memo?: string;
  name: string;
  packageId?: number;
  payWay: PayWay;
  showCaseId?: string; // 从哪个橱窗过来的
  skuId?: number;
  skuModelId?: number; // 预约型号
  stockDateInt?: number; // 预约日期 20220101
  telephone: string;
  videoId?: string; // 从哪个视频过来
  wxOpenId?: string;
}

export interface PayOrder {
  orderId: string;
  prePayTn: string;
  uniqueOrderNo: string;
}
export enum OrderPayState {
  UNPAY = 0,
  PAYED = 1,
  CANCEL = 2,
  TIMEOUT = 3,
}

export enum OrderStatus {
  All = -1,
  WaitPay = 0,
  Paid = 1,
  Canceled = 2,
  Timeout = 3,
  Completed = 4,
  Refunding = 5,
  RefundFailed = 51,
  Refunded = 6,
  Booked = 7,
}
export interface OrderF {
  id: number;
  bizName: string;
  orderBigId: number;
  canGetCommentPackage: BoolEnum;
  needBooking: BoolEnum;
  evaluated: BoolEnum;
  orderBigIdStr: string;
  orderMiddleId: number;
  orderSmallId: number;
  paidRealMoney: number;
  paidRealMoneyYuan: string;
  quantityOfOrder: number;
  skuName: string;
  spuCoverImage: string;
  status: OrderStatus;
}

export interface OrderDetailF {
  id: number;
  skuName: string;
  bookingTime: DateTimeString;
  canBookingTime: DateTimeString;
  createdTime: DateTimeString;
  useBeginTime: DateTimeString;
  useEndTime: DateTimeString;
  bizName: string;
  status: OrderStatus;
  spuCoverImage: string;
  spuId: number;
  code: string; // 电子码
  codeUrl: string; // 电子码地址
  codeEncrypt: string; // 电子码加密
  canUseShops: OrderShop[];
  orderSmallId: string;
  orderMiddleId: string;
  orderBigId: string;
  list: OrderPackage[];
  paidName: string;
  paidPhone: string;
  canPayAgainTimeEnd: DateTimeString;
  spuName: string;
  usedCouponMoney: number;
  usedCouponMoneyYuan: string;
  usedIntegralMoney: number;
  usedIntegralMoneyYuan: string;
  willReturnUserCommission: number;
  willReturnUserCommissionYuan: string;
  ypPayChannel: PayChannel;
  ypPayWay: PayWay;
  paidAllMoney: number;
  paidAllMoneyYuan: string;
  numberOfProducts: number;
  canRefundNumberOfProducts: number;
  needBooking: BoolEnum;
}

export interface OrderPackage {
  packageName: string;
  packageId: number;
  onePackageMoney: number;
  onePackageMoneyYuan: string;
  list: OrderPackageSKU[];
}
export interface OrderPackageSKU {
  orderSmallId: string;
  status: OrderStatus;
  skuName: string;
  codeUrl: string;
  code: string;
  bookingName: string;
  bookingContactPhone: string;
  bookingDateAndShopAndModel: string;
  bookingMemo: string;
  skuModelDateStockId: string;
}

export interface OrderShop {
  id: number;
  shopName: string;
  shopAddress: string;
  shopContactPhone: string;
  latitude?: number;
  longitude?: number;
}

export interface OrderCommentForm {
  content: string;
  descriptionMatchesScore: number;
  // diningEnvironmentScore: number;
  // diningExperienceScore: number;
  businessEnvironmentScore: number;
  useExperienceScore: number;
  orderBigId: string;
  serviceAttitudeScore: number;
  syncToVideo: BoolEnum;
  fileList: string[];
  _fileList: any[];
}

export interface OrderRefundForm {
  fileList: string[];
  _fileList: any[];
  orderBigId: string;
  quantity: number;
  reason: string;
}

export interface OrderBookingForm {
  name: string;
  contactPhone: string;
  memo: string;
  bizShopId: number;
  orderSmallId: string;
  skuModelId: number;
  stockDateInt: number;
}

export interface OrderBookingDetailF {
  bizName: string;
  bookingBeginTime: string;
  bookingCanCancel: BoolEnum; // 能否取消
  bookingCancelDay: number; // 提前几天取消
  bookingDateInt: number;
  bookingEarlyDay: string;
  bookingType: BookingType;
  contactPhone: string;
  memo: string;
  name: string;
  orderSmallId: string;
  reserved: BoolEnum;
  skuId: number;
  skuModelName: string;
  skuModelId: number;
  shopId: number;
  shopName: string;
}
