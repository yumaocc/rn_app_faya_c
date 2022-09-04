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
