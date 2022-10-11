import {Button} from '@ant-design/react-native';
import React, {useEffect, useMemo, useRef} from 'react';
import {View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Linking, Modal, StatusBar, TextInput, KeyboardAvoidingView, Platform, TextInputProps} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {InputNumber, NavigationBar, Select} from '../../component';
import FormItem from '../../component/Form/FormItem';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {findItem, moneyToYuan} from '../../fst/helper';
import {useAppState, useCommonDispatcher, useCoupons, useSPUDispatcher, useWallet} from '../../helper/hooks';
import {BookingModelF, BookingType, CouponState, FakeNavigation, OrderPayState, PackageDetail, PayChannel, SKUDetail} from '../../models';
import {RootState} from '../../redux/reducers';
import * as api from '../../apis';
import {cleanOrderForm} from '../../helper/order';
// import {useOrderDispatcher} from '../../helper/hooks/dispatchers';
import {useNavigation} from '@react-navigation/native';
import {useSearch} from '../../fst/hooks';
import {OrderForm} from '../../models/order';
import {BoolEnum} from '../../fst/models';
import {getAliPayUrl, getWechatPayUrl} from '../../constants';
import {checkAppInstall} from '../../helper/system';
import BookingModal from '../../component/BookingModal';

const Order: React.FC = () => {
  const spu = useSelector((state: RootState) => state.spu.currentSPU);
  const sku = useSelector((state: RootState) => state.spu.currentSKU);
  const currentSkuIsPackage = useSelector((state: RootState) => state.spu.currentSKUIsPackage);
  // const payOrder = useSelector((state: RootState) => state.order.payOrder);
  const token = useSelector((state: RootState) => state.common.token);

  const [isPaying, setIsPaying] = React.useState(false);
  const [checkOrderId, setCheckOrderId] = React.useState<string>('');
  const [checkOrderType, setCheckOrderType] = React.useState<number>(0); // 0 订单id，1tempId;
  const [canUseAlipay, setCanUseAlipay] = React.useState(false);
  const [showBooking, setShowBooking] = React.useState(false);
  const [bookingModel, setBookingModel] = React.useState<BookingModelF>(null);

  const appState = useAppState();
  const navigation = useNavigation<FakeNavigation>();
  const [wallet] = useWallet();
  const [couponList] = useCoupons();
  const [spuDispatcher] = useSPUDispatcher();
  const [commonDispatcher] = useCommonDispatcher();
  // const [orderDispatcher] = useOrderDispatcher();
  const {bottom} = useSafeAreaInsets();

  const phoneRef = useRef<TextInput>();

  const initForm: OrderForm = {amount: 1, channel: PayChannel.WECHAT, name: '', payWay: 'MINI_PROGRAM', telephone: ''};

  const [form, setFormField] = useSearch<OrderForm>(initForm);
  // 当前是sku，且购买数量为1时才显示提前预约
  const canBooking = useMemo(() => !currentSkuIsPackage && form.amount === 1 && spu.bookingType === BookingType.URL, [currentSkuIsPackage, form.amount, spu.bookingType]);

  // const [form] = Form.useForm(initForm);
  const payChannel = useMemo(() => form.channel, [form]);

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
    return Math.round(salePrice * form.amount || 0);
  }, [salePrice, form.amount]);

  const currentSelectedCoupon = useMemo(() => {
    return couponList?.find(coupon => coupon.id === form.couponId);
  }, [couponList, form.couponId]);

  const totalSaved = useMemo(() => {
    let saved = 0;
    if (currentSelectedCoupon) {
      saved = currentSelectedCoupon.money;
    }
    const integralMoney = form.integralMoney;
    if (integralMoney) {
      saved += integralMoney;
    }
    return saved;
  }, [currentSelectedCoupon, form.integralMoney]);

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

  const commission = useMemo(() => {
    return sku?.userCommissionYuan || '';
  }, [sku]);

  // 总金额变更导致当前优惠券不满足条件，则取消优惠券
  useEffect(() => {
    if (currentSelectedCoupon && currentSelectedCoupon.amountThreshold > totalPrice) {
      setFormField('couponId', null);
    }
  }, [currentSelectedCoupon, form, setFormField, totalPrice]);

  // 获取封面
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
    setFormField('skuId', id);
    // form.setFieldValue('skuId', id);
  }, [sku, currentSkuIsPackage, setFormField]);

  useEffect(() => {
    async function f() {
      try {
        const aliPayInstalled = await checkAppInstall('alipay');
        setCanUseAlipay(aliPayInstalled);
      } catch (error) {
        console.log(error);
      }
    }
    f();
  }, []);

  useEffect(() => {
    if (appState === 'active' && isPaying) {
      api.order
        .checkOrderPayState(checkOrderId, checkOrderType)
        .then(res => {
          const {status, id} = res;
          console.log(res);
          if (status === OrderPayState.PAYED) {
            navigation.replace('PaySuccess');
          } else if (status === OrderPayState.UNPAY) {
            navigation.replace('WaitPay', {id});
          } else {
            setIsPaying(false);
          }
        })
        .catch(e => {
          commonDispatcher.error(e);
          setIsPaying(false);
        })
        .finally(() => {});
    }
  }, [appState, isPaying, commonDispatcher, navigation, checkOrderId, checkOrderType]);

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
    setFormField('skuId', e);
  }
  function check(formData: OrderForm): string {
    const {name, telephone, amount, idCard} = formData;
    if (!name) {
      return '请输入姓名';
    }
    if (!telephone) {
      return '请输入手机号';
    }
    if (!amount) {
      return '请输入购买数量';
    }
    if (minPurchaseAmount && amount < minPurchaseAmount) {
      return `该商品至少购买${minPurchaseAmount}件`;
    }
    if (maxPurchaseAmount && amount > maxPurchaseAmount) {
      return `该商品最多购买${maxPurchaseAmount}件`;
    }
    if (spu.needIdCard && !idCard) {
      return '该商品下单需要填写身份证号';
    }
  }
  async function submit() {
    const formData = cleanOrderForm(form);
    const {channel} = formData;
    const errorMsg = check(formData);
    if (bookingModel && canBooking) {
      // 如果填写了预约信息
      formData.bizShopId = bookingModel?.shopId;
      formData.skuModelId = bookingModel?.id;
      formData.stockDateInt = bookingModel.stockDateInt;
    }
    if (errorMsg) {
      return commonDispatcher.error(errorMsg);
    }
    let link = '';
    try {
      if (channel === PayChannel.WECHAT) {
        const tempOrderId = await api.order.getOrderTempId();
        setCheckOrderType(1);
        setCheckOrderId(tempOrderId);
        const orderInfo = encodeURIComponent(
          JSON.stringify({
            skuName: (sku as SKUDetail).skuName || (sku as PackageDetail).packageName,
            skuAmount: moneyToYuan(shouldPay),
            amount: form.amount,
          }),
        );
        const payInfo = encodeURIComponent(JSON.stringify({...formData, tempId: tempOrderId}));
        link = getWechatPayUrl(`token=${encodeURIComponent(token)}&o=${orderInfo}&p=${payInfo}`);
      } else {
        const res = await api.order.makeOrder(formData);
        setCheckOrderId(res.orderId);
        link = getAliPayUrl(res.prePayTn);
      }
      Linking.openURL(link);
      setTimeout(() => {
        setIsPaying(true);
      }, 1000);
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  function openBooking() {
    setShowBooking(true);
  }

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4', position: 'relative'}}>
      <StatusBar barStyle="dark-content" />
      <NavigationBar title="确认订单" style={{backgroundColor: '#fff'}} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView style={{flex: 1}} keyboardDismissMode="on-drag">
          {/* <Form form={form} itemStyle={{children: styles.formChildren, container: styles.formItem}} hiddenLine> */}

          <View style={{padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}}>
            <View style={[{flexDirection: 'row'}]}>
              <Image source={poster ? {uri: poster} : require('../../assets/sku_def_1_1.png')} style={{width: 60, height: 60, borderRadius: 5}} />
              <View style={{flex: 1, marginLeft: globalStyleVariables.MODULE_SPACE}}>
                <View style={globalStyles.containerRow}>
                  <MaterialIcon name="store" size={20} />
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

            {/* <FormItem label="规格" name="skuId">
            <Select options={flatSKUList} placeholder="请选择规格" onChange={handleSKUChange} />
          </FormItem> */}
            <FormItem label="规格" {...formItemProps}>
              <Select value={form.skuId} options={flatSKUList} placeholder="请选择规格" onChange={handleSKUChange} />
            </FormItem>
            <FormItem label="数量" {...formItemProps}>
              <InputNumber value={form.amount} onChange={val => setFormField('amount', val)} min={minPurchaseAmount} max={maxPurchaseAmount} />
            </FormItem>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_BIGGER}]} />
            <FormItem label="商品总价" {...formItemProps}>
              <Text style={globalStyles.fontPrimary}>¥{moneyToYuan(totalPrice)}</Text>
            </FormItem>
            {!!commission && (
              <FormItem label="返芽" {...formItemProps}>
                <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_BUD}]}>订单完成可返{commission}芽</Text>
              </FormItem>
            )}
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_BIGGER}]} />
            <FormItem label="姓名" {...formItemProps}>
              <TextInput
                onSubmitEditing={() => phoneRef.current.focus()}
                value={form.name}
                onChangeText={val => setFormField('name', val)}
                placeholder="请输入使用人姓名"
                {...formItemInputProps}
                style={styles.formItemInput}
              />
              {/* <Input placeholder="请输入使用人姓名" /> */}
            </FormItem>
            <FormItem label="手机号" {...formItemProps}>
              <TextInput
                value={form.telephone}
                keyboardType="phone-pad"
                onChangeText={val => setFormField('telephone', val)}
                placeholder="用于接收订单短信"
                ref={phoneRef}
                {...formItemInputProps}
                style={styles.formItemInput}
              />
            </FormItem>
            {spu?.needIdCard === BoolEnum.TRUE && (
              <FormItem label="身份证" {...formItemProps}>
                <TextInput
                  value={form.idCard}
                  onChangeText={val => setFormField('idCard', val)}
                  placeholder="请输入使用人身份证号"
                  {...formItemInputProps}
                  style={styles.formItemInput}
                />
              </FormItem>
            )}
            <FormItem
              {...formItemProps}
              label={
                <View style={globalStyles.containerRow}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 16}]}>使用芽抵扣</Text>
                  <View style={[globalStyles.tagWrapper, {backgroundColor: '#0000001A', marginLeft: globalStyleVariables.MODULE_SPACE}]}>
                    <Text style={[globalStyles.tag, {color: globalStyleVariables.TEXT_COLOR_PRIMARY}]}>{wallet?.money ? wallet?.moneyYuan : '余额为0'}</Text>
                  </View>
                </View>
              }>
              <InputNumber
                styles={{container: {flex: 1, paddingRight: globalStyleVariables.MODULE_SPACE}, inputContainer: {flex: 1}, input: {textAlign: 'right', width: '100%'}}}
                controls={false}
                min={0}
                max={wallet?.money}
                value={form.integralMoney}
                disabled={!wallet?.money}
                onChange={val => setFormField('integralMoney', val)}
                placeholder={wallet?.money ? '请输入抵扣金额' : '无法抵扣'}
              />
            </FormItem>
            <FormItem label="优惠券" {...formItemProps}>
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

            <FormItem label="备注" {...formItemProps}>
              <TextInput
                value={form.memo}
                onChangeText={val => setFormField('memo', val)}
                placeholder="请输入备注（非必填）"
                {...formItemInputProps}
                style={styles.formItemInput}
              />
              {/* <Input placeholder="请输入备注（非必填）" /> */}
            </FormItem>
          </View>

          {/* 预约信息 */}
          {canBooking && (
            <View style={[globalStyles.moduleMarginTop, {backgroundColor: '#fff', paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
              <TouchableOpacity activeOpacity={0.8} onPress={openBooking}>
                <View style={[globalStyles.containerLR, {height: 50, paddingHorizontal: globalStyleVariables.MODULE_SPACE, backgroundColor: '#fff'}]}>
                  <Text>预约信息</Text>
                  <View style={[globalStyles.containerRow, {flex: 1, justifyContent: 'flex-end', marginLeft: 10}]}>
                    {!bookingModel ? (
                      <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>非必填</Text>
                    ) : (
                      <Text numberOfLines={2} style={[globalStyles.fontPrimary, {flex: 1, fontSize: 15, textAlign: 'right'}]}>
                        {`${bookingModel?.stockDateInt} ${bookingModel?.name} ${bookingModel?.shopName}`}
                      </Text>
                    )}
                    <MaterialIcon name="chevron-right" size={20} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* 支付方式 */}
          <View style={[globalStyles.moduleMarginTop, {backgroundColor: '#fff', paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
            {/* 微信 */}
            <TouchableOpacity activeOpacity={0.8} onPress={() => setFormField('channel', PayChannel.WECHAT)}>
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
            {canUseAlipay && (
              <TouchableOpacity activeOpacity={0.8} onPress={() => setFormField('channel', PayChannel.ALIPAY)}>
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
            )}
          </View>
          {/* </Form> */}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={{backgroundColor: '#fff', paddingBottom: bottom}}>
        <View style={[globalStyles.containerRow, {padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
          <View>
            <Text style={[{color: globalStyleVariables.COLOR_PRIMARY}]}>
              <Text>¥</Text>
              <Text style={[{fontSize: 30, lineHeight: 30}]}>{moneyToYuan(shouldPay)}</Text>
            </Text>
            <Text style={[globalStyles.fontTertiary]}>共优惠 ¥{moneyToYuan(totalSaved)}元</Text>
          </View>
          <Button type="primary" onPress={submit} style={{flex: 1, height: 40, marginLeft: globalStyleVariables.MODULE_SPACE}}>
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
      <BookingModal visible={showBooking} skuId={spu?.id} onClose={() => setShowBooking(false)} onSelect={setBookingModel} />
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
  formItemInput: {
    fontSize: 15,
    paddingRight: globalStyleVariables.MODULE_SPACE,
    textAlign: 'right',
    width: '100%',
  },
});

const formItemProps = {
  hiddenBorderBottom: true,
  hiddenBorderTop: true,
  styles: {container: styles.formItem, children: styles.formChildren},
};

const formItemInputProps: TextInputProps = {
  placeholderTextColor: globalStyleVariables.TEXT_COLOR_TERTIARY,
  clearButtonMode: 'while-editing',
};
