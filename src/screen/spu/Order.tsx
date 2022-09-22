import {Button} from '@ant-design/react-native';
import React, {useEffect, useMemo} from 'react';
import {View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Linking, Modal} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {Form, Input, InputNumber, NavigationBar, Select} from '../../component';
import FormItem from '../../component/Form/FormItem';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {findItem, moneyToYuan} from '../../fst/helper';
import {useAppState, useCommonDispatcher, useCoupons, useSPUDispatcher, useWallet} from '../../helper/hooks';
import {BookingType, CouponState, OrderPayState, PackageDetail, PayChannel, SKUDetail} from '../../models';
import {RootState} from '../../redux/reducers';
import * as api from '../../apis';
import {cleanOrderForm} from '../../helper/order';
import {useOrderDispatcher} from '../../helper/hooks/dispatchers';

const Order: React.FC = () => {
  const spu = useSelector((state: RootState) => state.spu.currentSPU);
  const sku = useSelector((state: RootState) => state.spu.currentSKU);
  const currentSkuIsPackage = useSelector((state: RootState) => state.spu.currentSKUIsPackage);
  const payOrder = useSelector((state: RootState) => state.order.payOrder);
  const [isPaying, setIsPaying] = React.useState(false);
  const appState = useAppState();

  const [wallet] = useWallet();
  const [couponList] = useCoupons();
  const [spuDispatcher] = useSPUDispatcher();
  const [commonDispatcher] = useCommonDispatcher();
  const [orderDispatcher] = useOrderDispatcher();
  const {bottom} = useSafeAreaInsets();
  const initForm = {
    amount: 1,
    channel: PayChannel.WECHAT,
  };
  const [form] = Form.useForm(initForm);
  const payChannel = useMemo(() => form.getFieldValue('channel'), [form]);

  // 可以切换的sku
  const flatSKUList = useMemo(() => {
    const skuList =
      spu?.skuList?.map(e => {
        return {
          value: 'sku_' + e.id,
          label: e.skuName,
          isPackage: false,
        };
      }) || [];
    const packages =
      spu?.packageDetailsList?.map(e => {
        return {
          value: 'pkg_' + e.packageId,
          label: e.packageName,
          isPackage: true,
        };
      }) || [];
    return [...skuList, ...packages];
  }, [spu]);

  const salePrice = useMemo(() => {
    if (currentSkuIsPackage) {
      return (sku as PackageDetail)?.packageSalePrice || 0;
    } else {
      return (sku as SKUDetail)?.salePrice || 0;
    }
  }, [sku, currentSkuIsPackage]);

  const totalPrice = useMemo(() => {
    return Math.round(salePrice) * form.getFieldValue('amount') || 0;
  }, [salePrice, form]);

  const currentSelectedCoupon = useMemo(() => {
    return couponList?.find(coupon => coupon.id === form.getFieldValue('couponId'));
  }, [couponList, form]);

  const totalSaved = useMemo(() => {
    let saved = 0;
    if (currentSelectedCoupon) {
      saved = currentSelectedCoupon.money;
    }
    const integralMoney = form.getFieldValue('integralMoney');
    if (integralMoney) {
      saved += integralMoney;
    }
    return saved;
  }, [currentSelectedCoupon, form]);

  // 实际应付
  const shouldPay = useMemo(() => totalPrice - totalSaved, [totalPrice, totalSaved]);
  const minPurchaseAmount = useMemo(() => {
    if (currentSkuIsPackage) {
      return 1;
    } else {
      return (sku as SKUDetail).minPurchaseQuantity;
    }
  }, [currentSkuIsPackage, sku]);

  const maxPurchaseAmount = useMemo(() => {
    if (currentSkuIsPackage) {
      return (sku as PackageDetail)?.stockAmount;
    } else {
      return (sku as SKUDetail)?.maxPurchaseQuantity;
    }
  }, [currentSkuIsPackage, sku]);

  const canUseCoupons = useMemo(() => {
    return couponList?.filter(coupon => coupon.status === CouponState.Unused && coupon.amountThreshold < totalPrice) || [];
  }, [couponList, totalPrice]);

  // 总金额变更导致当前优惠券不满足条件，则取消优惠券
  useEffect(() => {
    if (currentSelectedCoupon && currentSelectedCoupon.amountThreshold > totalPrice) {
      form.setFieldsValue({couponId: null});
    }
  }, [currentSelectedCoupon, form, totalPrice]);

  const poster = useMemo(() => {
    if (spu?.posters?.length) {
      return spu.posters[0];
    }
  }, [spu]);

  useEffect(() => {
    let id = '';
    if (currentSkuIsPackage) {
      id = 'pkg_' + (sku as PackageDetail)?.packageId;
    } else {
      id = 'sku_' + (sku as SKUDetail)?.id;
    }
    form.setFieldValue('skuId', id);
  }, [sku, currentSkuIsPackage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (appState === 'active' && isPaying) {
      api.order
        .checkOrderPayState(payOrder?.orderId)
        .then(res => {
          if (res === OrderPayState.PAYED) {
            console.log('支付完成');
            // todo: 支付完成
          } else {
            console.log('支付未完成');
            // todo: 支付未完成
          }
        })
        .catch(e => {
          commonDispatcher.error(e);
        });
    }
  }, [appState, isPaying, payOrder, commonDispatcher]);

  // 用户换了套餐，这里同步到redux
  function handleSKUChange(e = '') {
    const id = e.split('_')[1];
    if (e.startsWith('sku_')) {
      const foundSKU = spu?.skuList?.find(sku => String(sku.id) === id);
      if (foundSKU) {
        spuDispatcher.changeSKU(foundSKU, false);
      }
    } else if (e.startsWith('pkg_')) {
      const foundPackage = spu?.packageDetailsList?.find(pkg => String(pkg.packageId) === id);
      if (foundPackage) {
        spuDispatcher.changeSKU(foundPackage, true);
      }
    }
  }
  async function check() {
    // todo: 检查合法性
    const formData = cleanOrderForm(form.getFieldsValue());
    const {channel} = formData;
    let link = '';
    try {
      if (channel === PayChannel.WECHAT) {
        // todo: 微信支付链接
        link = 'https://baidu.com';
      } else {
        const res = await api.order.makeOrder(formData);
        orderDispatcher.setPayOrder(res);
        link = `alipays://platformapi/startapp?saId=10000007&clientVersion=3.7.0.0718&qrcode=${res.prePayTn}&_s=web-other`;
      }

      Linking.openURL(link);
      setIsPaying(true);
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4', position: 'relative'}}>
      <NavigationBar title="确认订单" style={{backgroundColor: '#fff'}} />
      <ScrollView style={{flex: 1}}>
        <Form form={form} itemStyle={{children: styles.formChildren, container: styles.formItem}} hiddenLine>
          <View style={{padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}}>
            <View style={[{flexDirection: 'row'}]}>
              <Image source={{uri: poster || 'https://fakeimg.pl/30?text=loading'}} style={{width: 60, height: 60, borderRadius: 5}} />
              <View style={{flex: 1, marginLeft: globalStyleVariables.MODULE_SPACE}}>
                <View style={globalStyles.containerRow}>
                  <Icon name="store" size={20} />
                  <Text style={[globalStyles.fontStrong]} numberOfLines={1}>
                    {spu?.bizName}
                  </Text>
                </View>
                <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_SMALLER, flexDirection: 'row'}]}>
                  <Text style={[globalStyles.fontTertiary]}>暂无标签字段</Text>
                  {spu?.bookingType === BookingType.URL && <Text style={[globalStyles.fontTertiary, {marginLeft: 10}]}>需要预约</Text>}
                </View>
                <Text style={[globalStyles.fontStrong]} numberOfLines={2}>
                  {spu?.name}
                </Text>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={globalStyles.fontPrimary}>¥{moneyToYuan(salePrice)}</Text>
                </View>
              </View>
            </View>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_BIGGER}]} />

            <FormItem label="规格" name="skuId">
              <Select options={flatSKUList} placeholder="请选择规格" onChange={handleSKUChange} />
            </FormItem>
            <FormItem label="数量" name="amount">
              <InputNumber min={minPurchaseAmount} max={maxPurchaseAmount} />
            </FormItem>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_BIGGER}]} />
            <FormItem label="商品总价">
              <Text style={globalStyles.fontPrimary}>¥{moneyToYuan(totalPrice)}</Text>
            </FormItem>
            <FormItem label="返芽">
              <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_BUD}]}>订单完成可返xx芽</Text>
            </FormItem>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_BIGGER}]} />
            <FormItem label="姓名" name="name">
              <Input placeholder="请输入使用人姓名" />
            </FormItem>
            <FormItem label="手机号" name="telephone">
              <Input placeholder="用于接收订单短信" />
            </FormItem>
            {spu?.needIdCard ? (
              <FormItem label="身份证" name="idCard">
                <Input placeholder="请输入使用人身份证号" />
              </FormItem>
            ) : null}
            <FormItem
              name="integralMoney"
              label={
                <View style={globalStyles.containerRow}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 16}]}>使用芽抵扣</Text>
                  <View style={[globalStyles.tagWrapper, {backgroundColor: '#0000001A', marginLeft: globalStyleVariables.MODULE_SPACE}]}>
                    <Text style={[globalStyles.tag, {color: globalStyleVariables.TEXT_COLOR_PRIMARY}]}>{wallet?.money ? wallet?.moneyYuan : '余额为0'}</Text>
                  </View>
                </View>
              }>
              <Input disabled={!wallet?.money} type="number" placeholder={wallet?.money ? '请输入抵扣金额' : '无法抵扣'} />
            </FormItem>
            <FormItem label="优惠券" name="couponId">
              <Select
                disabled={canUseCoupons?.length === 0}
                options={canUseCoupons?.map(coupon => ({value: coupon.id, label: `¥${moneyToYuan(coupon.money)}`})) || []}
                placeholder="请选择优惠券">
                {e => {
                  if (!e) {
                    if (canUseCoupons?.length) {
                      return <Text>{canUseCoupons?.length}张可用</Text>;
                    } else {
                      return <Text>暂无可用优惠券</Text>;
                    }
                  }
                  const foundCoupon = findItem(couponList, item => item.id === e.value);
                  const couponMoney = moneyToYuan(foundCoupon?.money) || 0;
                  return <Text>-¥{couponMoney}</Text>;
                }}
              </Select>
            </FormItem>

            <FormItem label="备注" name="memo">
              <Input placeholder="请输入备注（非必填）" />
            </FormItem>
          </View>
          {/* 支付方式 */}
          <View style={[globalStyles.moduleMarginTop, {backgroundColor: '#fff', paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
            {/* 微信 */}
            <TouchableOpacity activeOpacity={0.8} onPress={() => form.setFieldValue('channel', PayChannel.WECHAT)}>
              <View style={[globalStyles.containerLR]}>
                <View style={[globalStyles.containerRow, {height: 50}]}>
                  <Image source={require('../../assets/icon-wx-pay.png')} style={{width: 24, height: 24, marginRight: 15}} />
                  <Text>微信</Text>
                </View>
                {payChannel === PayChannel.WECHAT ? (
                  <Image source={require('../../assets/select-true.png')} style={{width: 18, height: 18}} />
                ) : (
                  <Image source={require('../../assets/select-false.png')} style={{width: 18, height: 18}} />
                )}
                {/* <Image source={require(payChannel === PayChannel.WECHAT ? '../../assets/select-true.png' : '../../assets/select-false.png')} style={{width: 18, height: 18}} /> */}
              </View>
            </TouchableOpacity>
            {/* 支付宝 */}
            <TouchableOpacity activeOpacity={0.8} onPress={() => form.setFieldValue('channel', PayChannel.ALIPAY)}>
              <View style={[globalStyles.containerLR]}>
                <View style={[globalStyles.containerRow, {height: 50}]}>
                  <Image source={require('../../assets/icon-ali-pay.png')} style={{width: 24, height: 24, marginRight: 15}} />
                  <Text>支付宝</Text>
                </View>
                {payChannel === PayChannel.ALIPAY ? (
                  <Image source={require('../../assets/select-true.png')} style={{width: 18, height: 18}} />
                ) : (
                  <Image source={require('../../assets/select-false.png')} style={{width: 18, height: 18}} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </Form>
      </ScrollView>
      <View style={{backgroundColor: '#fff', paddingBottom: bottom}}>
        <View style={[globalStyles.containerRow, {padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
          <View>
            <Text style={[{color: globalStyleVariables.COLOR_PRIMARY}]}>
              <Text>¥</Text>
              <Text style={[{fontSize: 30, lineHeight: 30}]}>{moneyToYuan(shouldPay)}</Text>
            </Text>
            <Text style={[globalStyles.fontTertiary]}>共优惠 ¥{moneyToYuan(totalSaved)}元</Text>
          </View>
          <Button type="primary" onPress={check} style={{flex: 1, height: 40, marginLeft: globalStyleVariables.MODULE_SPACE}}>
            提交订单
          </Button>
        </View>
      </View>
      <Modal visible={isPaying} transparent animationType="fade">
        <View style={[globalStyles.containerCenter, {flex: 1, backgroundColor: '#00000033'}]}>
          <View style={[globalStyles.containerCenter, {backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 40, borderRadius: 5}]}>
            <Text style={[globalStyles.fontPrimary]}>正在支付</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default Order;

export const styles = StyleSheet.create({
  formChildren: {
    height: 20,
  },
  formItem: {
    paddingVertical: 7,
  },
});
