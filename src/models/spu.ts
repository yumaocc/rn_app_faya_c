import {BoolEnum, DateTimeString} from '../fst/models';

export interface SPUF {
  spuId: number;
  poster: string; // 封面图
  spuName: string;
  saleAmount: number;
  originPrice: number;
  originPriceYuan: string;
  salePrice: number;
  salePriceYuan: string;
  commissionRangeLeftMoney: number;
  commissionRangeLeftMoneyYuan: string;
  commissionRangeRightMoney: number;
  commissionRangeRightMoneyYuan: string;
  categoryName: string;
  tags: string[];
}

export enum SPUStatus {
  SoldOut = 0, // 未上线
  OnSale = 1, // 在售
  Checking = 2, // 审核中
  Checked = 3, // 审核通过
  Rejected = 4, // 审核失败
}

export enum BookingType {
  NONE = 0,
  PHONE = 1,
  URL = 2,
}

export enum SPUType {
  Explosive = 0, // 爆款
}

// 0正常售卖，1已下架，2库存售罄
export enum SKUSaleState {
  ON_SALE = 0,
  SOLD_OUT = 1,
  SOLD_OUT_WITH_NO_STOCK = 2,
}

export interface SPUShop {
  id?: number;
  addressDetail: string;
  contactPhone: string;
  shopName: string;
  distanceFromMe: string;
}
export interface PackageDetail {
  hasShow: BoolEnum;
  packageId: number;
  packageName: string;
  packageSalePrice: number;
  packageSalePriceYuan: string;
  packageOriginPrice: number;
  packageOriginPriceYuan: string;
  saleAmount: number;
  stockAmount: number;
  saleStatus: SKUSaleState;
  list: SKUDetail[];
  userCommission: number;
  userCommissionYuan: string;
}

export interface SKUDetail {
  id: number;
  maxPurchaseQuantity: number; // 最大购买数量
  minPurchaseQuantity: number; // 最小购买数量
  originPrice: number;
  originPriceYuan: string;
  quantityPerPurchase: number; // 每次购买数量
  salePrice: number;
  salePriceYuan: string;
  saleAmount: number;
  skuName: string;
  skuStockAmount: number;
  userCommission: number; // 用户佣金
  userCommissionYuan: string;
  saleStatus: SKUSaleState;
}

export interface SPUDetailF {
  id: number;
  status: SPUStatus;
  name: string;
  subName: string; // 副标题
  bizName: string; // 商家名称
  collectAmount: number; // 收藏数
  theRemainingNumberOfDays: number; // 倒计时天
  posters: string[]; // 封面图
  banners: string[]; // 轮播图
  openSkuStock: BoolEnum; // 是否开启sku库存
  quantityPerPurchase: number; // 每次购买数量
  maxPurchaseQuantity: number; // 最大购买数量
  minPurchaseQuantity: number; // 最小购买数量
  spuType: SPUType; // 产品类型
  needExpress: BoolEnum; // 是否需要快递
  needIdCard: BoolEnum; // 是否需要身份证
  hasSoldout: BoolEnum; // 是否已售罄
  soldoutTime: DateTimeString;
  saleBeginTime: DateTimeString;
  saleEndTime: DateTimeString;
  useBeginTime: DateTimeString;
  useEndTime: DateTimeString;
  invalidTime: DateTimeString; // 失效时间
  shareCount: number; // 分享数
  showBeginTime: DateTimeString; // 展示开始时间
  showEndTime: DateTimeString; // 展示结束时间
  storeMutualExclusion: BoolEnum; // 店铺是否互斥
  bookingType: BookingType; // 预约方式
  bookingEarlyDay: number; // 提前几天预约
  bookingBeginTime: DateTimeString; // 预约开始时间
  codeType: number; // 发码方式
  needShowTime: number;
  shopList: SPUShop[];
  skuList: SKUDetail[];
  packageDetailsList: PackageDetail[];
}

export enum PayChannel {
  WECHAT = 'WECHAT',
  ALIPAY = 'ALIPAY',
}
export type PayWay = 'USER_SCAN' | 'MINI_PROGRAM' | 'WECHAT_OFFIACCOUNT' | 'ALIPAY_LIFE' | 'H5PAY' | 'JS_PAY' | 'SDK_PAY';

export interface SKUShowInfo {
  id: string;
  saleAmount: number;
  skuName: string;
  stockAmount: number;
  originPrice: number;
  originPriceYuan: string;
  salePrice: number;
  salePriceYuan: string;
  // saleStatus: SKUSaleState;
}
