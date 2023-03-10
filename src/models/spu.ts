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
  bizName: string;
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
  latitude: number;
  longitude: number;
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
  videoCommission: number;
  videoCommissionYuan: string;
  extField: string;
  kindTips: string;
}

export interface SKUContent {
  id: number;
  name: string;
  nums: number;
  price: number;
}

export interface SKUDetail {
  id: number;
  contentList: SKUContent[];
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
  videoCommission: number;
  videoCommissionYuan: string;
  saleStatus: SKUSaleState;
  quantityWithPkg: number;
  extField: string;
  kindTips: string;
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
  tags: string[];
  packageDetailsList: PackageDetail[];
  spuPurchaseNoticeVOS: SKUBuyNoticeF[];
  showcaseJoined: BoolEnum; // 是否加入橱窗
  collected: BoolEnum; // 是否已收藏
  spuHtml: string;
}

// BOOKING 预约须知，SALE_TIME售卖、营业时间，USE_RULE使用规则，TIPS温馨提示，POLICY取消政策
export type SKUBuyNoticeType = 'BOOKING' | 'SALE_TIME' | 'USE_RULE' | 'TIPS' | 'POLICY';

// 购买须知，后端返回的
export interface SKUBuyNoticeF {
  id?: number;
  type: SKUBuyNoticeType;
  content: string;
}

// 组织成这个格式
export type SKUBuyNotice = {
  [key in SKUBuyNoticeType]: string[];
};

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
  videoCommission: number;
  videoCommissionYuan: string;
  // saleStatus: SKUSaleState;
}

export interface BookingModelF {
  id: number;
  name: string; // 型号名称
  skuModelId: number; // 预约型号ID
  shopId: number;
  shopName: string;
  allStock: number; // 总库存
  usedStock: number; // 已用库存
  stockDateInt: number; // 库存日期
}
export interface DayBookingModelF {
  allStock: number;
  usedStock: number;
  stockDateInt: number;
  list: BookingModelF[];
}

export interface GroupedShopBookingModel {
  id: number;
  name: string;
  list: BookingModelF[];
}
