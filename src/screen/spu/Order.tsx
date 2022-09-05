import {Button} from '@ant-design/react-native';
import React from 'react';
import {View, Text, ScrollView, Image, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Form, Input, InputNumber, NavigationBar} from '../../component';
import FormItem from '../../component/Form/FormItem';
import {globalStyles, globalStyleVariables} from '../../constants/styles';

const Order: React.FC = () => {
  const {bottom} = useSafeAreaInsets();
  const initForm = {
    amount: 1,
  };
  const [form] = Form.useForm(initForm);

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
              <Image source={{uri: 'https://fakeimg.pl/30?text=loading'}} style={{width: 60, height: 60, borderRadius: 5}} />
              <View style={{flex: 1, marginLeft: globalStyleVariables.MODULE_SPACE}}>
                <View style={globalStyles.containerRow}>
                  <Icon name="store" size={20} />
                  <Text style={[globalStyles.fontStrong]} numberOfLines={1}>
                    海捞捞火锅
                  </Text>
                </View>
                <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_SMALLER, flexDirection: 'row'}]}>
                  <Text style={[globalStyles.fontTertiary]}>火锅串串</Text>
                  <Text style={[globalStyles.fontTertiary, {marginLeft: 10}]}>需要预约</Text>
                </View>
                <Text style={[globalStyles.fontStrong]} numberOfLines={2}>
                  {'超值二人餐'.repeat(10)}
                </Text>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={globalStyles.fontPrimary}>¥99</Text>
                </View>
              </View>
            </View>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_BIGGER}]} />

            <FormItem label="规格">
              <View style={globalStyles.containerRow}>
                <Text style={globalStyles.fontPrimary}>特价二人餐</Text>
                <Icon name="arrow-forward-ios" size={16} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
              </View>
            </FormItem>
            <FormItem label="数量" name="amount">
              <InputNumber />
            </FormItem>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_BIGGER}]} />
            <FormItem label="商品总价">
              <Text style={globalStyles.fontPrimary}>¥100</Text>
            </FormItem>
            <FormItem label="返芽">
              <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_BUD}]}>订单完成可返20芽</Text>
            </FormItem>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_BIGGER}]} />
            <FormItem label="姓名" name="name">
              <Input placeholder="请输入使用人姓名" />
            </FormItem>
            <FormItem label="手机号" name="telephone">
              <Input placeholder="用于接收订单短信" />
            </FormItem>
            <FormItem label="备注" name="memo">
              <Input placeholder="请输入备注（非必填）" />
            </FormItem>
          </View>
          {/* 支付方式 */}
          <View style={[globalStyles.moduleMarginTop, {backgroundColor: '#fff', paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
            {/* 微信 */}
            <TouchableOpacity activeOpacity={0.8}>
              <View style={[globalStyles.containerLR]}>
                <View style={[globalStyles.containerRow, {height: 50}]}>
                  <Image source={require('../../assets/icon-wx-pay.png')} style={{width: 24, height: 24, marginRight: 15}} />
                  <Text>微信</Text>
                </View>
                <Image source={require('../../assets/select-false.png')} style={{width: 18, height: 18}} />
              </View>
            </TouchableOpacity>
            {/* 支付宝 */}
            <TouchableOpacity activeOpacity={0.8}>
              <View style={[globalStyles.containerLR]}>
                <View style={[globalStyles.containerRow, {height: 50}]}>
                  <Image source={require('../../assets/icon-ali-pay.png')} style={{width: 24, height: 24, marginRight: 15}} />
                  <Text>支付宝</Text>
                </View>
                <Image source={require('../../assets/select-true.png')} style={{width: 18, height: 18}} />
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
