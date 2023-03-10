import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TextInputProps,
  AppState,
  TouchableHighlight,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from '../../component/Icon';
import {useSelector} from 'react-redux';
import {InputNumber, NavigationBar, Popup, Select, Button} from '../../component';
import FormItem from '../../component/Form/FormItem';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {fenToYuan, findItem, moneyToYuan} from '../../fst/helper';
import {useAndroidBack, useCommonDispatcher, useCoupons, useParams, useSPUDispatcher, useWallet} from '../../helper/hooks';
import {BookingModelF, BookingType, CouponState, FakeNavigation, OrderPayState, PackageDetail, PayChannel, SKUDetail, SKUSaleState, UserExpressAddress} from '../../models';
import {RootState} from '../../redux/reducers';
import * as api from '../../apis';
import {cleanOrderForm, openWxToPay} from '../../helper/order';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useLog, useSearch} from '../../fst/hooks';
import {OrderForm} from '../../models/order';
import {BoolEnum} from '../../fst/models';
import {getAliPayUrl} from '../../constants';
import BookingModal from '../../component/BookingModal';
import MyStatusBar from '../../component/MyStatusBar';
import logger from '../../helper/logger';
import {getItem, setItem} from '../../helper/cache/helper';
interface ExtField {
  label: string;
  placeholder: string;
  value: string;
  required: boolean;
  key: string;
}

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
  const [checkOrderType, setCheckOrderType] = useState<number>(0); // 0 ??????id???1tempId;
  // const [canUseAlipay, setCanUseAlipay] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingModel, setBookingModel] = useState<BookingModelF>(null);
  const [showSelectCoupon, setShowSelectCoupon] = useState(false);
  const [extFields, setExtFields] = useState<ExtField[]>([]);
  // ????????????
  const [addressList, setAddressList] = useState<UserExpressAddress[]>([]);
  const [currentAddress, setCurrentAddress] = useState<UserExpressAddress>(null);
  const [showSelectAddress, setShowSelectAddress] = useState(false); // ????????????????????????
  const needAddress = useMemo(() => spu.needExpress === BoolEnum.TRUE, [spu?.needExpress]); // ??????????????????????????????
  const isFocused = useIsFocused();

  useLog('????????????ID', checkOrderId);
  useLog('????????????Type', checkOrderType);
  useAndroidBack();

  const {workMainId} = useParams<{workMainId: string}>();
  const navigation = useNavigation<FakeNavigation>();
  const [wallet] = useWallet();
  const [couponList] = useCoupons();
  const [spuDispatcher] = useSPUDispatcher();
  const [commonDispatcher] = useCommonDispatcher();
  // const [orderDispatcher] = useOrderDispatcher();
  const {bottom} = useSafeAreaInsets();

  const phoneRef = useRef<TextInput>();

  const initForm: OrderForm = {amount: 1, channel: PayChannel.WECHAT, name: '', payWay: 'MINI_PROGRAM', telephone: ''};

  const [form, setFormField, setFormFields] = useSearch<OrderForm>(initForm);
  useEffect(() => {
    if (!sku?.extField) {
      return;
    }
    try {
      const fields = JSON.parse(sku.extField) as ExtField[];
      const extFields = fields.map((f: ExtField, index: number) => ({
        ...f,
        value: '',
        key: 'extField_' + index + '_' + f.label,
      }));
      setExtFields(extFields);
    } catch (error) {
      console.error('error', error);
      return;
    }
  }, [sku]);

  useEffect(() => {
    async function f() {
      const name = await getItem('payName');
      const phone = await getItem('payPhone');
      setFormFields({name, telephone: phone});
    }
    f();
  }, [setFormFields]);

  // ?????????sku?????????????????????1????????????????????????
  const canBooking = useMemo(() => !currentSkuIsPackage && form.amount === 1 && spu?.bookingType === BookingType.URL, [currentSkuIsPackage, form.amount, spu.bookingType]);
  const skuId = useMemo(() => {
    if (!canBooking || currentSkuIsPackage) {
      return null;
    }
    return (sku as SKUDetail)?.id;
  }, [canBooking, currentSkuIsPackage, sku]);

  const payChannel = useMemo(() => form.channel, [form.channel]);

  useEffect(() => {
    if (needAddress && !currentAddress && isFocused) {
      api.user
        .getAddressList({pageIndex: 1, pageSize: 100})
        .then(res => {
          let foundDefault = res.find(address => address.hasDefault === BoolEnum.TRUE);
          if (!foundDefault) {
            foundDefault = res[0];
          }
          setCurrentAddress(foundDefault);
          setAddressList(res);
        })
        .catch(commonDispatcher.error);
    }
  }, [needAddress, commonDispatcher, currentAddress, isFocused]);

  // ???????????????sku
  const flatSKUList = useMemo(() => {
    const skuList =
      spu?.skuList
        ?.filter(pkg => pkg.saleStatus === SKUSaleState.ON_SALE)
        .map(e => {
          return {
            value: 'sku_' + e.id,
            label: e.skuName,
            isPackage: false,
          };
        }) || [];
    const packages =
      spu?.packageDetailsList
        ?.filter(pkg => pkg.saleStatus === SKUSaleState.ON_SALE)
        .map(e => {
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

  const totalCommission = useMemo(() => {
    if (!sku?.userCommissionYuan) {
      return 0;
    }
    return parseFloat((Number(sku.userCommissionYuan) * form.amount).toFixed(2));
  }, [sku, form.amount]);

  const totalSaved = useMemo(() => {
    let saved = 0;
    if (currentSelectedCoupon) {
      saved = currentSelectedCoupon.money;
    }
    const integralMoney = form.integralMoney;
    if (integralMoney) {
      saved += integralMoney * 100; // ??????????????????????????????????????????
    }
    return saved;
  }, [currentSelectedCoupon, form.integralMoney]);

  // ????????????
  const shouldPay = useMemo(() => totalPrice - totalSaved, [totalPrice, totalSaved]);
  const minPurchaseAmount = useMemo(() => {
    if (currentSkuIsPackage) {
      return 1;
    } else {
      const min = (sku as SKUDetail).minPurchaseQuantity || 1;
      return min;
    }
  }, [currentSkuIsPackage, sku]);

  const maxPurchaseAmount = useMemo(() => {
    if (currentSkuIsPackage) {
      return (sku as PackageDetail)?.stockAmount;
    } else {
      const max = (sku as SKUDetail)?.maxPurchaseQuantity || 0;
      if (max === 0) {
        return 99999;
      }
      return max;
    }
  }, [currentSkuIsPackage, sku]);

  const canUseCoupons = useMemo(() => {
    return couponList?.filter(coupon => coupon.status === CouponState.Unused && coupon.amountThreshold < totalPrice) || [];
  }, [couponList, totalPrice]);

  useEffect(() => {
    if (form.amount < minPurchaseAmount) {
      setFormField('amount', minPurchaseAmount);
    }
  }, [form.amount, minPurchaseAmount, setFormField]);
  // useWhyDidYouUpdate('Order', {form, sku, spu, currentSkuIsPackage, totalPrice, totalSaved, shouldPay, canUseCoupons, commission});

  // ????????????????????????????????????????????????????????????????????????
  useEffect(() => {
    if (currentSelectedCoupon && currentSelectedCoupon.amountThreshold > totalPrice) {
      setFormField('couponId', null);
    }
  }, [currentSelectedCoupon, setFormField, totalPrice]);

  // ????????????
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
  }, [sku, currentSkuIsPackage, setFormField]);

  useEffect(() => {
    if (!form.name && commonConfig.buyUserName) {
      setFormField('name', commonConfig.buyUserName);
    }
    if (!form.telephone && commonConfig.buyUserPhone) {
      setFormField('telephone', commonConfig.buyUserPhone);
    }
  }, [commonConfig, form.name, form.telephone, setFormField]);

  // useEffect(() => {
  //   async function f() {
  //     try {
  //       const aliPayInstalled = await checkAppInstall('alipay');
  //       setCanUseAlipay(aliPayInstalled);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   f();
  // }, []);

  useEffect(() => {
    const subscribe = AppState.addEventListener('change', nextState => {
      if (nextState === 'active' && isPaying) {
        console.log(`??????????????????, ?????????????????????id: ${checkOrderId}, type: ${checkOrderType}`);
        api.order
          .checkOrderPayState(checkOrderId, checkOrderType)
          .then(res => {
            const {status, id} = res;
            console.log('???????????????', res);
            if (status === OrderPayState.PAYED) {
              navigation.replace('PaySuccess');
            } else if (status === OrderPayState.UNPAY) {
              navigation.replace('WaitPay', {id});
            } else {
              logger.warn('Order.tsx/effect/checkPay', {msg: '????????????????????????', checkOrderId, checkOrderType});
              setIsPaying(false);
            }
          })
          .catch(e => {
            commonDispatcher.error(e);
            setIsPaying(false);
          })
          .finally(() => {});
      }
    });
    return () => {
      subscribe.remove();
    };
  }, [checkOrderId, checkOrderType, commonDispatcher, isPaying, navigation]);

  // ????????????????????????????????????redux
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
  function onInputExtField(key: string, val: string) {
    const newFields = extFields.map(field => {
      if (field.key === key) {
        return {...field, value: val};
      } else {
        return field;
      }
    });
    setExtFields(newFields);
  }
  function check(formData: OrderForm): string {
    const {name, telephone, amount, idCard} = formData;
    if (needAddress && !currentAddress) {
      return '?????????????????????';
    }
    if (!name) {
      return '???????????????';
    }
    if (!telephone) {
      return '??????????????????';
    }
    if (!amount) {
      return '?????????????????????';
    }
    if (minPurchaseAmount && amount < minPurchaseAmount) {
      return `?????????????????????${minPurchaseAmount}???`;
    }
    if (maxPurchaseAmount && amount > maxPurchaseAmount) {
      return `?????????????????????${maxPurchaseAmount}???`;
    }
    if (spu.needIdCard && !idCard) {
      return '???????????????????????????????????????';
    }
    const fieldLen = extFields.length;
    for (let i = 0; i < fieldLen; i++) {
      const field = extFields[i];
      if (field.required && !field.value) {
        return `?????????${field.label}`;
      }
    }
  }
  async function submit() {
    const formData = cleanOrderForm(form);
    let memo = formData.memo || '';
    const fields = extFields || [];
    fields.forEach(field => {
      if (field.value) {
        memo += `${memo ? '\n' : ''}${field.label}:${field.value};`;
      }
    });
    formData.memo = memo;
    if (needAddress && currentAddress) {
      formData.addressId = currentAddress.id;
      formData.name = currentAddress.name;
      formData.telephone = currentAddress.contactPhone;
    }
    if (shareUserId) {
      formData.agentUserId = shareUserId; // ????????????
    }
    if (workMainId) {
      formData.videoId = workMainId; // ????????????
    }
    const {channel} = formData;
    const errorMsg = check(formData);
    if (bookingModel && canBooking) {
      // ???????????????????????????
      formData.bizShopId = bookingModel?.shopId;
      formData.skuModelId = bookingModel?.skuModelId;
      formData.stockDateInt = bookingModel.stockDateInt;
    }
    if (errorMsg) {
      return commonDispatcher.error(errorMsg);
    }
    let link = '';
    setItem('payName', formData.name);
    setItem('payPhone', formData.telephone);
    try {
      if (channel === PayChannel.WECHAT) {
        const tempOrderId = await api.order.getOrderTempId();
        setCheckOrderType(1);
        setCheckOrderId(tempOrderId);
        const success = await openWxToPay(
          encodeURIComponent(token),
          {
            spuName: spu.name,
            skuName: (sku as SKUDetail).skuName || (sku as PackageDetail).packageName,
            skuAmount: moneyToYuan(shouldPay),
            amount: form.amount,
          },
          {...formData, tempId: tempOrderId},
        );
        if (!success) {
          logger.fatal('Order.tsx/#submit', {msg: '???????????????????????????', tempOrderId, formData: JSON.stringify(formData)});
        }
      } else {
        const res = await api.order.makeOrder(formData);
        setCheckOrderId(res.orderId);
        link = getAliPayUrl(res.prePayTn);
        try {
          Linking.openURL(link);
        } catch (error) {
          logger.error('Order.tsx/#submit.OPENLINK', {msg: '?????????????????????', link, error});
        }
      }
      setIsPaying(true);
    } catch (error) {
      commonDispatcher.error(error);
    }
  }
  function openSelectAddress() {
    setShowSelectAddress(true);
  }

  function goAddNewAddress() {
    setShowSelectAddress(false);
    navigation.navigate('AddAddress');
  }

  function handleSelectAddress(address: UserExpressAddress) {
    setShowSelectAddress(false);
    setCurrentAddress(address);
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
        return `${canUseCoupons.length}?????????`;
      } else {
        return '?????????????????????';
      }
    }
    const foundCoupon = findItem(couponList, item => item.id === form.couponId);
    const couponMoney = moneyToYuan(foundCoupon?.money) || 0;
    return `-??${couponMoney}`;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4', position: 'relative'}}>
      <MyStatusBar />
      <NavigationBar title="????????????" style={{backgroundColor: '#fff'}} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}} keyboardVerticalOffset={-bottom}>
        <ScrollView style={{flex: 1}} keyboardDismissMode="on-drag">
          {needAddress && (
            <View>
              <View>
                {currentAddress ? (
                  <>
                    <TouchableHighlight onPress={openSelectAddress} underlayColor="#999">
                      <View style={[globalStyles.containerLR, {padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}]}>
                        <View>
                          <View>
                            <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>
                              {currentAddress.province}
                              {currentAddress.city}
                              {currentAddress.area}
                            </Text>
                          </View>
                          <View>
                            <Text style={[globalStyles.fontPrimary, {fontSize: 18}]}>{currentAddress.detailAddress}</Text>
                          </View>
                          <View style={[globalStyles.containerRow]}>
                            <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>
                              {currentAddress.name} {currentAddress.contactPhone}
                            </Text>
                          </View>
                        </View>
                        <Icon name="all_arrowR36" size={18} color="#999" />
                      </View>
                    </TouchableHighlight>
                    <View style={{height: 10, backgroundColor: '#f4f4f4'}} />
                  </>
                ) : (
                  <View style={[{paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff'}]}>
                    <TouchableOpacity onPress={goAddNewAddress}>
                      <View style={[globalStyles.containerRow, {backgroundColor: '#f4f4f4', borderRadius: 7, padding: 15}]}>
                        <Icon name="fabu_weizhi48" size={24} color={globalStyleVariables.COLOR_PRIMARY} />
                        <Text style={[globalStyles.fontPrimary, {flex: 1, color: globalStyleVariables.COLOR_PRIMARY}]}>?????????????????????</Text>
                        <Icon name="all_arrowR36" size={18} color="#999" />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
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
                  {spu?.bookingType === BookingType.URL && <Text style={[globalStyles.fontTertiary]}>????????????</Text>}
                </View>
                <Text style={[globalStyles.fontStrong]} numberOfLines={2}>
                  {spu?.name}
                </Text>
              </View>
            </View>
            <View style={[globalStyles.lineHorizontal, {marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}]} />

            <FormItem label="??????" {...formItemProps}>
              <Select value={form.skuId} options={flatSKUList} placeholder="???????????????" onChange={handleSKUChange} />
            </FormItem>
            <FormItem label="??????" {...formItemProps}>
              <InputNumber digit={0} value={form.amount} onChange={val => setFormField('amount', val)} min={minPurchaseAmount} max={maxPurchaseAmount} />
            </FormItem>
            <View style={[globalStyles.lineHorizontal]} />
            <FormItem label="????????????" {...formItemProps}>
              <Text style={globalStyles.fontPrimary}>??{moneyToYuan(totalPrice)}</Text>
            </FormItem>
            {!!totalCommission && (
              <FormItem label="??????" {...formItemProps}>
                <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_BUD}]}>??????????????????{totalCommission}???</Text>
              </FormItem>
            )}

            <View style={[globalStyles.lineHorizontal]} />
            {!needAddress && (
              <>
                <FormItem label="??????" {...formItemProps}>
                  <TextInput
                    onSubmitEditing={() => phoneRef.current.focus()}
                    value={form.name}
                    onChangeText={val => setFormField('name', val)}
                    placeholder="????????????????????????"
                    {...formItemInputProps}
                    style={styles.formItemInput}
                  />
                </FormItem>
                <FormItem label="?????????" {...formItemProps}>
                  <TextInput
                    value={form.telephone}
                    keyboardType="phone-pad"
                    onChangeText={val => setFormField('telephone', val)}
                    placeholder="????????????????????????"
                    ref={phoneRef}
                    {...formItemInputProps}
                    style={styles.formItemInput}
                  />
                </FormItem>
              </>
            )}
            {spu?.needIdCard === BoolEnum.TRUE && (
              <FormItem label="?????????" {...formItemProps}>
                <TextInput
                  value={form.idCard}
                  onChangeText={val => setFormField('idCard', val)}
                  placeholder="??????????????????????????????"
                  {...formItemInputProps}
                  style={styles.formItemInput}
                />
              </FormItem>
            )}
            {extFields.map(field => {
              return (
                <FormItem label={field.label} {...formItemProps} key={field.key}>
                  <TextInput
                    onSubmitEditing={() => phoneRef.current.focus()}
                    value={field.value}
                    onChangeText={val => onInputExtField(field.key, val)}
                    placeholder={field.placeholder}
                    {...formItemInputProps}
                    style={styles.formItemInput}
                  />
                </FormItem>
              );
            })}
            <View style={[globalStyles.lineHorizontal]} />
            {wallet?.canUseIntegral === BoolEnum.TRUE && (
              <FormItem
                {...formItemProps}
                label={
                  <View style={globalStyles.containerRow}>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 15}]}>???????????????</Text>
                    <Text style={[globalStyles.fontTertiary]}>{wallet?.money ? `???${wallet?.moneyYuan}` : '?????????0'}</Text>
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
                  placeholder={wallet?.money ? '?????????????????????' : '????????????'}
                />
              </FormItem>
            )}
            {wallet?.canUseCoupon === BoolEnum.TRUE && (
              <FormItem label="?????????" {...formItemProps}>
                {renderCouponEntry()}
              </FormItem>
            )}
            <FormItem label="??????" {...formItemProps}>
              <TextInput
                value={form.memo}
                onChangeText={val => setFormField('memo', val)}
                placeholder="??????????????????????????????"
                {...formItemInputProps}
                style={styles.formItemInput}
              />
              {/* <Input placeholder="??????????????????????????????" /> */}
            </FormItem>
          </View>

          {/* ???????????? */}
          {canBooking && (
            <View style={[globalStyles.moduleMarginTop, {backgroundColor: '#fff', paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
              <TouchableOpacity activeOpacity={0.8} onPress={openBooking}>
                <View style={[globalStyles.containerLR, {height: 50, backgroundColor: '#fff'}]}>
                  <Text style={globalStyles.fontPrimary}>????????????</Text>
                  <View style={[globalStyles.containerRow, {flex: 1, justifyContent: 'flex-end', marginLeft: 10}]}>
                    {!bookingModel ? (
                      <Text style={[globalStyles.fontTertiary, {fontSize: 15, fontWeight: 'normal'}]}>?????????</Text>
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

          {/* ???????????? */}
          {sku?.kindTips && (
            <View style={[globalStyles.moduleMarginTop, {backgroundColor: '#fff', padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
              <Text style={[globalStyles.fontTertiary, {color: globalStyleVariables.COLOR_WARNING_YELLOW}]}>{sku?.kindTips}</Text>
            </View>
          )}

          {/* ???????????? */}
          <View style={[globalStyles.moduleMarginTop, {backgroundColor: '#fff', paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
            {/* ?????? */}
            <TouchableOpacity activeOpacity={0.8} onPress={() => setFormField('channel', PayChannel.WECHAT)}>
              <View style={[globalStyles.containerLR]}>
                <View style={[globalStyles.containerRow, {height: 50}]}>
                  <Image source={require('../../assets/icon-wx-pay.png')} style={{width: 24, height: 24, marginRight: 15}} />
                  <Text>??????</Text>
                </View>
                {payChannel === PayChannel.WECHAT ? (
                  <Image source={require('../../assets/select-true.png')} style={{width: 18, height: 18}} />
                ) : (
                  <Image source={require('../../assets/select-false.png')} style={{width: 18, height: 18}} />
                )}
                {/* <Image source={require(payChannel === PayChannel.WECHAT ? '../../assets/select-true.png' : '../../assets/select-false.png')} style={{width: 18, height: 18}} /> */}
              </View>
            </TouchableOpacity>
            {/* ????????? */}
            {/* {canUseAlipay && ( */}
            <TouchableOpacity activeOpacity={0.8} onPress={() => setFormField('channel', PayChannel.ALIPAY)}>
              <View style={[globalStyles.containerLR]}>
                <View style={[globalStyles.containerRow, {height: 50}]}>
                  <Image source={require('../../assets/icon-ali-pay.png')} style={{width: 24, height: 24, marginRight: 15}} />
                  <Text>?????????</Text>
                </View>
                {payChannel === PayChannel.ALIPAY ? (
                  <Image source={require('../../assets/select-true.png')} style={{width: 18, height: 18}} />
                ) : (
                  <Image source={require('../../assets/select-false.png')} style={{width: 18, height: 18}} />
                )}
              </View>
            </TouchableOpacity>
            {/* )} */}
          </View>
          {/* </Form> */}
        </ScrollView>

        <View style={{backgroundColor: '#fff', paddingBottom: bottom}}>
          <View style={[globalStyles.containerRow, {padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
            <View>
              <Text style={[{color: globalStyleVariables.COLOR_PRIMARY}]}>
                <Text>??</Text>
                <Text style={[{fontSize: 30, lineHeight: 30}]}>{moneyToYuan(shouldPay)}</Text>
              </Text>
              <Text style={[globalStyles.fontTertiary]}>????????? ??{moneyToYuan(totalSaved)}???</Text>
            </View>
            <Button type="primary" title="????????????" onPress={submit} style={{flex: 1, height: 40, marginLeft: globalStyleVariables.MODULE_SPACE}} />
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* ??????????????? */}
      {isPaying && (
        <Modal visible={true} transparent animationType="fade">
          <View style={[globalStyles.containerCenter, {flex: 1, backgroundColor: '#00000033'}]}>
            <View style={[globalStyles.containerCenter, {backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 40, borderRadius: 5}]}>
              <Text style={[globalStyles.fontPrimary]}>????????????</Text>
            </View>
          </View>
        </Modal>
      )}

      {/* ???????????? */}
      {showBooking && <BookingModal bindModel={bookingModel} visible={true} skuId={skuId} onClose={() => setShowBooking(false)} onSelect={setBookingModel} />}

      {/* ??????????????? */}
      {showSelectCoupon && (
        <Popup visible={true} round={5} onClose={() => setShowSelectCoupon(false)}>
          <View style={[globalStyles.containerCenter, {height: 40}]}>
            <Text style={[globalStyles.fontPrimary]}>???????????????({canUseCoupons?.length}?????????)</Text>
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
                            <Text style={{fontSize: 15}}>??</Text>
                            <Text style={{fontSize: 30}}>{coupon.moneyYuan}</Text>
                          </Text>
                          <Text style={{color: '#7C5C35', fontSize: 12}}>???{moneyToYuan(coupon.amountThreshold)}??????</Text>
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
              title="??????????????????"
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
      {showSelectAddress && (
        <Popup visible={true} round={5} onClose={() => setShowSelectAddress(false)}>
          <View style={[{height: 50}]}>
            <View style={[globalStyles.containerCenter, {height: 50}]}>
              <Text style={[globalStyles.fontPrimary]}>??????????????????</Text>
            </View>
            <View style={[globalStyles.containerCenter, {height: 50, position: 'absolute', right: 15}]}>
              <TouchableOpacity onPress={goAddNewAddress}>
                <Text style={{color: globalStyleVariables.COLOR_LINK}}>????????????</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={[{maxHeight: 250}]}>
            <View style={{padding: 20}}>
              {addressList.map((address, index) => {
                const marginTop = index === 0 ? 0 : globalStyleVariables.MODULE_SPACE;
                return (
                  <TouchableHighlight key={address.id} onPress={() => handleSelectAddress(address)} style={{marginTop}} underlayColor="#999">
                    <View style={[{padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}]}>
                      <View>
                        <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>
                          {address.province}
                          {address.city}
                          {address.area}
                        </Text>
                      </View>
                      <View>
                        <Text style={[globalStyles.fontPrimary, {fontSize: 18}]}>{address.detailAddress}</Text>
                      </View>
                      <View style={[globalStyles.containerRow]}>
                        <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>
                          {address.name} {address.contactPhone}
                        </Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                );
              })}
            </View>
          </ScrollView>
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
