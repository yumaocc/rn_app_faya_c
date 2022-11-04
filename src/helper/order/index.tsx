import {FAYA_MINI_PROGRAM_PAY_PATH} from '../../constants';
import {PayChannel, PayWay, SKUBuyNotice, SKUBuyNoticeF} from '../../models';
import {OrderForm, WxOrderInfo} from '../../models/order';
import {encodeJson} from '../common';

export function cleanOrderForm(formData: any): OrderForm {
  const {skuId: id, channel} = formData;
  let skuId;
  let packageId;
  if (id?.startsWith('sku_')) {
    skuId = Number(id.replace('sku_', ''));
  } else if (id?.startsWith('pkg_')) {
    packageId = Number(id.replace('pkg_', ''));
  }
  const payWay: PayWay = channel === PayChannel.ALIPAY ? 'USER_SCAN' : 'MINI_PROGRAM';
  return {
    ...formData,
    skuId,
    packageId,
    payWay,
  };
}

export function getShareSPULink(spuId: number, userId: string): string {
  return `https://m.faya.life/${userId ? `?a=${userId}` : ''}#/spu/detail/${spuId}`;
}

export function getShareWorkLink(workId: string, userId: string): string {
  // return `https://m.faya.life/?a=${userId}#/work/detail/${workId}`;
  return `https://m.faya.life/${userId ? `?a=${userId}` : ''}#/work/detail/${workId}`;
}

export function getWXPayPath(token: string, orderInfo: WxOrderInfo, orderForm: OrderForm) {
  return FAYA_MINI_PROGRAM_PAY_PATH + `?token=${token}&o=${encodeJson(orderInfo)}&p=${encodeJson(orderForm)}`;
}

export function convertSKUBuyNotice(buyNotices: SKUBuyNoticeF[]): SKUBuyNotice {
  const result: SKUBuyNotice = {
    BOOKING: [],
    SALE_TIME: [],
    USE_RULE: [],
    TIPS: [],
    POLICY: [],
  };
  buyNotices.forEach(buyNotice => {
    result[buyNotice.type].push(buyNotice.content);
  });
  return result;
}
