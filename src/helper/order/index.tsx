import {PayChannel, PayWay} from '../../models';
import {OrderForm} from '../../models/order';

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
