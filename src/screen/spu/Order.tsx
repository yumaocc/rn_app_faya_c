import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Linking, Modal, TextInput, KeyboardAvoidingView, Platform, TextInputProps} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from '../../component/Icon';
import {useSelector} from 'react-redux';
import {InputNumber, NavigationBar, Popup, Select, Button} from '../../component';
import FormItem from '../../component/Form/FormItem';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {fenToYuan, findItem, moneyToYuan} from '../../fst/helper';
import {useAndroidBack, useAppState, useCommonDispatcher, useCoupons, useSPUDispatcher, useWallet} from '../../helper/hooks';
import {BookingModelF, BookingType, CouponState, FakeNavigation, OrderPayState, PackageDetail, PayChannel, SKUDetail} from '../../models';
import {RootState} from '../../redux/reducers';
import * as api from '../../apis';
import {cleanOrderForm} from '../../helper/order';
import {useNavigation} from '@react-navigation/native';
import {useSearch} from '../../fst/hooks';
import {OrderForm} from '../../models/order';
import {BoolEnum} from '../../fst/models';
import {getAliPayUrl, getWechatPayUrl} from '../../constants';
import {checkAppInstall} from '../../helper/system';
import BookingModal from '../../component/BookingModal';
import MyStatusBar from '../../component/MyStatusBar';
import moment from 'moment';

const Order: React.FC = () => {
  const spu = useSelector((state: RootState) => state.spu.currentSPU);
  const sku = useSelector((state: RootState) => state.spu.currentSKU);
  const currentSkuIsPackage = useSelector((state: RootState) => state.spu.currentSKUIsPackage);
  // const payOrder = useSelector((state: RootState) => state.order.payOrder);
  const token = useSelector((state: RootState) => state.common.config.token);
  const shareUserId = useSelector((state: RootState) => state.common.config.shareUserId);
  const commonConfig = useSelector((state: RootState) => state.common.config);

  const [isPaying, setIsPaying] = useState(false);
  const [checkOrderId, setCheckOrderId] = useState<string>('');
  const [checkOrderType, setCheckOrderType] = useState<number>(0); // 0 订单id，1tempId;
  const [canUseAlipay, setCanUseAlipay] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingModel, setBookingModel] = useState<BookingModelF>(null);
  const bookingDate = useMemo(() => {
    if (!bookingModel?.stockDateInt) {
      return null;
    }
    return moment(bookingModel.stockDateInt, 'YYYYMMDD');
  }, [bookingModel]);
  const [showSelectCoupon, setShowSelectCoupon] = useState(false);
  // useLog('checkid', checkOrderId);
  useAndroidBack();

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
  const canBooking = useMemo(() => !currentSkuIsPackage && form.amount === 1 && spu?.bookingType === BookingType.URL, [currentSkuIsPackage, form.amount, spu.bookingType]);
  const skuId = useMemo(() => {
    if (!canBooking || currentSkuIsPackage) {
      return null;
    }
    return (sku as SKUDetail)?.id;
  }, [canBooking, currentSkuIsPackage, sku]);

  const payChannel = useMemo(() => form.channel, [form.channel]);

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
      saved += integralMoney * 100; // 输入的代币是元，需要转换成分
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

  // useWhyDidYouUpdate('Order', {form, sku, spu, currentSkuIsPackage, totalPrice, totalSaved, shouldPay, canUseCoupons, commission});

  // 总金额变更导致当前优惠券不满足条件，则取消优惠券
  useEffect(() => {
    if (currentSelectedCoupon && currentSelectedCoupon.amountThreshold > totalPrice) {
      setFormField('couponId', null);
    }
  }, [currentSelectedCoupon, setFormField, totalPrice]);

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
    if (!form.name && commonConfig.buyUserName) {
      setFormField('name', commonConfig.buyUserName);
    }
    if (!form.telephone && commonConfig.buyUserPhone) {
      setFormField('telephone', commonConfig.buyUserPhone);
    }
  }, [commonConfig, form.name, form.telephone, setFormField]);

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
  }, [appState, checkOrderId, checkOrderType, commonDispatcher, isPaying, navigation]);

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
    if (shareUserId) {
      formData.agentUserId = shareUserId; // 达人分享
    }
    const {channel} = formData;
    const errorMsg = check(formData);
    if (bookingModel && canBooking) {
      // 如果填写了预约信息
      formData.bizShopId = bookingModel?.shopId;
      formData.skuModelId = bookingModel?.skuModelId;
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
  function renderCouponEntry() {
    const hasValidCoupons = canUseCoupons?.length > 0;
    if (!hasValidCoupons) {
      return <Text style={[globalStyles.fontTertiary, {fontSize: 15, fontWeight: 'normal'}]}>{getCouponText()}</Text>;
    } else {
      return (
        <TouchableOpacity onPress={() => setShowSelectCoupon(true)}>
          <Text style={globalStyles.fontPrimary}>{getCouponText()}</Text>
        </TouchableOpacity>
      );
    }
  }
  function getCouponText() {
    if (!form.couponId) {
      if (canUseCoupons?.length) {
        return `${canUseCoupons.length}张可用`;
      } else {
        return '暂无可用优惠券';
      }
    }
    const foundCoupon = findItem(couponList, item => item.id === form.couponId);
    const couponMoney = moneyToYuan(foundCoupon?.money) || 0;
    return `-¥${couponMoney}`;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4', position: 'relative'}}>
      <MyStatusBar />
      <NavigationBar title="确认订单" style={{backgroundColor: '#fff'}} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
        <ScrollView style={{flex: 1}} keyboardDismissMode="on-drag">
          {/* <Form form={form} itemStyle={{children: styles.formChildren, container: styles.formItem}} hiddenLine> */}

          <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER, paddingTop: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}}>
            <View style={[{flexDirection: 'row'}]}>
              <Image source={poster ? {uri: poster} : require('../../assets/sku_def_1_1.png')} style={{width: 60, height: 60, borderRadius: 5}} />
              <View style={{flex: 1, marginLeft: globalStyleVariables.MODULE_SPACE}}>
                <View style={globalStyles.containerRow}>
                  <Icon name="shangpin_shanghu24" size={18} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                  <Text style={[globalStyles.fontStrong]} numberOfLines={1}>
                    {spu?.bizName}
                  </Text>
                </View>
                <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_SMALLER, flexDirection: 'row'}]}>
                  {spu?.tags?.length &&
                    spu.tags.map((tag, index) => {
                      return (
                        <Text key={index} style={[globalStyles.fontTertiary, {marginRight: globalStyleVariables.MODULE_SPACE_SMALLER}]}>
                          {tag}
                        </Text>
                      );
                    })}
                  {spu?.bookingType === BookingType.URL && <Text style={[globalStyles.fontTertiary]}>需要预约</Text>}
                </View>
                <Text style={[globalStyles.fontStrong]} numberOfLines={2}>
                  {spu?.name}
                </Text>
              </View>
            </View>
            <View style={[globalStyles.lineHorizontal, {marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}]} />

            {/* <FormItem label="规格" name="skuId">
            <Select options={flatSKUList} placeholder="请选择规格" onChange={handleSKUChange} />
          </FormItem> */}
            <FormItem label="规格" {...formItemProps}>
              <Select value={form.skuId} options={flatSKUList} placeholder="请选择规格" onChange={handleSKUChange} />
            </FormItem>
            <FormItem label="数量" {...formItemProps}>
              <InputNumber digit={0} value={form.amount} onChange={val => setFormField('amount', val)} min={minPurchaseAmount} max={maxPurchaseAmount} />
            </FormItem>
            <View style={[globalStyles.lineHorizontal]} />
            <FormItem label="商品总价" {...formItemProps}>
              <Text style={globalStyles.fontPrimary}>¥{moneyToYuan(totalPrice)}</Text>
            </FormItem>
            {!!commission && (
              <FormItem label="返芽" {...formItemProps}>
                <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_BUD}]}>订单完成可返{commission}芽</Text>
              </FormItem>
            )}
            <View style={[globalStyles.lineHorizontal]} />
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
            <View style={[globalStyles.lineHorizontal]} />
            <FormItem
              {...formItemProps}
              label={
                <View style={globalStyles.containerRow}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 15}]}>使用芽抵扣</Text>
                  <Text style={[globalStyles.fontTertiary]}>{wallet?.money ? `余${wallet?.moneyYuan}` : '余额为0'}</Text>
                </View>
              }>
              <InputNumber
                styles={{container: {flex: 1}, inputContainer: {flex: 1}, input: {textAlign: 'right', width: '100%', fontSize: 15}}}
                controls={false}
                min={0}
                digit={2}
                max={fenToYuan(wallet?.money)}
                value={form.integralMoney}
                disabled={!wallet?.money}
                onChange={val => setFormField('integralMoney', val)}
                placeholder={wallet?.money ? '请输入抵扣金额' : '无法抵扣'}
              />
            </FormItem>
            <FormItem label="优惠券" {...formItemProps}>
              {renderCouponEntry()}
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
            <View style={[globalStyles.moduleMarginTop, {backgroundColor: '#fff', paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
              <TouchableOpacity activeOpacity={0.8} onPress={openBooking}>
                <View style={[globalStyles.containerLR, {height: 50, backgroundColor: '#fff'}]}>
                  <Text style={globalStyles.fontPrimary}>预约信息</Text>
                  <View style={[globalStyles.containerRow, {flex: 1, justifyContent: 'flex-end', marginLeft: 10}]}>
                    {!bookingModel ? (
                      <Text style={[globalStyles.fontTertiary, {fontSize: 15, fontWeight: 'normal'}]}>非必填</Text>
                    ) : (
                      <Text numberOfLines={2} style={[globalStyles.fontPrimary, {flex: 1, fontSize: 15, textAlign: 'right'}]}>
                        {`${bookingModel?.stockDateInt} ${bookingModel?.name} ${bookingModel?.shopName}`}
                      </Text>
                    )}
                    <Icon name="all_arrowR36" size={18} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* 支付方式 */}
          <View style={[globalStyles.moduleMarginTop, {backgroundColor: '#fff', paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
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

        <View style={{backgroundColor: '#fff', paddingBottom: bottom}}>
          <View style={[globalStyles.containerRow, {padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
            <View>
              <Text style={[{color: globalStyleVariables.COLOR_PRIMARY}]}>
                <Text>¥</Text>
                <Text style={[{fontSize: 30, lineHeight: 30}]}>{moneyToYuan(shouldPay)}</Text>
              </Text>
              <Text style={[globalStyles.fontTertiary]}>共优惠 ¥{moneyToYuan(totalSaved)}元</Text>
            </View>
            <Button type="primary" title="提交订单" onPress={submit} style={{flex: 1, height: 40, marginLeft: globalStyleVariables.MODULE_SPACE}} />
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* 支付中弹窗 */}
      {isPaying && (
        <Modal visible={true} transparent animationType="fade">
          <View style={[globalStyles.containerCenter, {flex: 1, backgroundColor: '#00000033'}]}>
            <View style={[globalStyles.containerCenter, {backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 40, borderRadius: 5}]}>
              <Text style={[globalStyles.fontPrimary]}>正在支付</Text>
            </View>
          </View>
        </Modal>
      )}

      {/* 预约弹窗 */}
      {showBooking && <BookingModal month={bookingDate} selectDay={bookingDate} visible={true} skuId={skuId} onClose={() => setShowBooking(false)} onSelect={setBookingModel} />}

      {/* 优惠券弹窗 */}
      {showSelectCoupon && (
        <Popup visible={true} round={5} onClose={() => setShowSelectCoupon(false)}>
          <View style={[globalStyles.containerCenter, {height: 40}]}>
            <Text style={[globalStyles.fontPrimary]}>选择优惠券({canUseCoupons?.length}张可用)</Text>
          </View>
          <ScrollView style={[{height: 250}]}>
            <View style={{padding: 20}}>
              {canUseCoupons.map((coupon, index) => {
                const marginTop = index === 0 ? 0 : globalStyleVariables.MODULE_SPACE;
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={coupon.id}
                    style={{marginTop}}
                    onPress={() => {
                      setFormField('couponId', coupon.id);
                      setShowSelectCoupon(false);
                    }}>
                    <View key={coupon.id} style={[styles.couponItem, {marginTop, backgroundColor: '#F9CE8F'}]}>
                      <View style={globalStyles.containerRow}>
                        <View style={[{width: 100}, globalStyles.containerCenter]}>
                          <Text style={{color: '#7C5C35'}}>
                            <Text style={{fontSize: 15}}>¥</Text>
                            <Text style={{fontSize: 30}}>{coupon.moneyYuan}</Text>
                          </Text>
                          <Text style={{color: '#7C5C35', fontSize: 12}}>满{moneyToYuan(coupon.amountThreshold)}可用</Text>
                        </View>
                        <View style={[globalStyles.lineVertical, {marginHorizontal: 20, height: 12, backgroundColor: '#0000001A'}]} />
                        <View style={{flex: 1}}>
                          <Text style={{color: '#7C5C35', fontSize: 15, fontWeight: '600'}}>{coupon.name}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <View style={[{padding: globalStyleVariables.MODULE_SPACE}]}>
            <Button
              title="不使用优惠券"
              type="primary"
              style={{height: 40}}
              onPress={() => {
                setShowSelectCoupon(false);
                setFormField('couponId', null);
              }}
            />
          </View>
        </Popup>
      )}
    </View>
  );
};
export default Order;

export const styles = StyleSheet.create({
  formChildren: {
    height: 20,
  },
  formItem: {
    paddingVertical: 12,
  },
  formItemInput: {
    fontSize: 15,
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
    // paddingRight: globalStyleVariables.MODULE_SPACE,
    textAlign: 'right',
    width: '100%',
  },
  couponItem: {
    paddingVertical: 24,
    paddingHorizontal: 15,
    borderRadius: 7,
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
