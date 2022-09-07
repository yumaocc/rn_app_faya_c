import {Button} from '@ant-design/react-native';
import React, {useEffect, useMemo} from 'react';
import {View, Text, ScrollView, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {Form, Input, InputNumber, NavigationBar, Select} from '../../component';
import FormItem from '../../component/Form/FormItem';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {moneyToYuan} from '../../fst/helper';
import {useSPUDispatcher} from '../../helper/hooks';
import {BookingType, PackageDetail, PayChannel, SKUDetail} from '../../models';
import {RootState} from '../../redux/reducers';

const Order: React.FC = () => {
  const spu = useSelector((state: RootState) => state.spu.currentSPU);
  const sku = useSelector((state: RootState) => state.spu.currentSKU);
  const skuIsPackage = useSelector((state: RootState) => state.spu.currentSKUIsPackage);
  const [spuDispatcher] = useSPUDispatcher();
  const {bottom} = useSafeAreaInsets();
  const initForm = {
    amount: 1,
    channel: PayChannel.WECHAT,
  };
  const [form] = Form.useForm(initForm);
  const payChannel = useMemo(() => form.getFieldValue('channel'), [form]);

  // 可以切换的sku
  const flatSKUList = useMemo(() => {
    const skuList = spu?.skuList?.map(e => {
      return {
        value: 'sku_' + e.id,
        label: e.skuName,
        isPackage: false,
      };
    });
    const packages = spu?.packageDetailsList?.map(e => {
      return {
        value: 'pkg_' + e.packageId,
        label: e.packageName,
        isPackage: true,
      };
    });
    return [...skuList, ...packages];
  }, [spu]);

  const salePrice = useMemo(() => {
    if (skuIsPackage) {
      return (sku as PackageDetail)?.packageSalePrice;
    } else {
      return (sku as SKUDetail)?.salePrice;
    }
  }, [sku, skuIsPackage]);

  const totalPrice = useMemo(() => {
    return Math.round(salePrice) * form.getFieldValue('amount') || 0;
  }, [salePrice, form]);

  const poster = useMemo(() => {
    if (spu.posters?.length) {
      return spu.posters[0];
    }
  }, [spu]);

  useEffect(() => {
    let id = '';
    if (skuIsPackage) {
      id = 'pkg_' + (sku as PackageDetail)?.packageId;
    } else {
      id = 'sku_' + (sku as SKUDetail)?.id;
    }
    form.setFieldValue('skuId', id);
  }, [sku, skuIsPackage]); // eslint-disable-line react-hooks/exhaustive-deps

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
  function check() {
    console.log(form.getFieldsValue());
  }

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
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
              <InputNumber />
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
            <FormItem
              label={
                <View style={globalStyles.containerRow}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 16}]}>使用芽抵扣</Text>
                  <View style={[globalStyles.tagWrapper, {backgroundColor: '#0000001A', marginLeft: globalStyleVariables.MODULE_SPACE}]}>
                    <Text style={[globalStyles.tag, {color: globalStyleVariables.TEXT_COLOR_PRIMARY}]}>可用1000, 余999</Text>
                  </View>
                </View>
              }
              name="integralMoney">
              <Input type="number" />
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
              <Text style={[{fontSize: 30, lineHeight: 30}]}>19.00</Text>
            </Text>
            <Text style={[globalStyles.fontTertiary]}>共优惠 ¥100.00元</Text>
          </View>
          <Button type="primary" onPress={check} style={{flex: 1, height: 40, marginLeft: globalStyleVariables.MODULE_SPACE}}>
            提交订单
          </Button>
        </View>
      </View>
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
  t: {
    backgroundColor: '#6cf',
    padding: 0,
    lineHeight: 30,
    includeFontPadding: false,
  },
});
