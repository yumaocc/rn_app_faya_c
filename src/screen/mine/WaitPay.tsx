import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import {Button, NavigationBar} from '../../component';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation, OrderDetailF} from '../../models';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCommonDispatcher, useParams} from '../../helper/hooks';
import * as api from '../../apis';

const WaitPay: React.FC = () => {
  const navigation = useNavigation<FakeNavigation>();
  const id = useParams<{id: string}>().id || '1577610909918621696';
  const [orderInfo, setOrderInfo] = React.useState<OrderDetailF>(null);
  const [, setLoading] = React.useState(true);

  console.log(orderInfo);

  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    api.order
      .getOrderDetail(id)
      .then(setOrderInfo)
      .catch(commonDispatcher.error)
      .finally(() => setLoading(false));
  }, [commonDispatcher.error, id]);
  // const order = useSelector((state: RootState) => state.order.payOrder);
  function backToTab() {
    navigation.navigate('Tab'); // 返回Tab页
  }
  function payNow() {
    console.log('立即支付');
  }

  return (
    <View style={styles.container}>
      <NavigationBar
        title=""
        headerLeft={
          <View style={globalStyles.containerRow}>
            <TouchableOpacity activeOpacity={0.6} onPress={backToTab}>
              <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
                <MaterialIcon name="arrow-back-ios" size={24} color="#333" />
              </View>
            </TouchableOpacity>
            <View style={globalStyles.moduleMarginLeft}>
              <View>
                <Text style={[{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 20}]}>待支付</Text>
              </View>
              <View>
                <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_PRIMARY}]}>剩{222}自动关闭</Text>
              </View>
            </View>
          </View>
        }
      />
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}} edges={['bottom']}>
        <ScrollView style={{flex: 1, backgroundColor: '#f4f4f4'}}>
          <View style={[globalStyles.containerRow, styles.nameContainer]}>
            <Text style={styles.name}>{orderInfo?.paidName}</Text>
            <View style={[globalStyles.lineVertical, {height: 12, backgroundColor: globalStyleVariables.BORDER_COLOR, marginHorizontal: globalStyleVariables.MODULE_SPACE}]} />
            <Text style={styles.name}>{orderInfo?.paidPhone}</Text>
          </View>
          <View style={styles.orderContainer}>
            <View style={[{flexDirection: 'row', alignItems: 'flex-start'}]}>
              <Image source={orderInfo?.spuCoverImage ? {uri: orderInfo.spuCoverImage} : require('../../assets/sku_def_1_1.png')} style={styles.spuCover} />
              <View style={{flex: 1, marginLeft: globalStyleVariables.MODULE_SPACE}}>
                <View style={globalStyles.containerRow}>
                  <MaterialIcon name="store" size={20} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                  <Text style={[globalStyles.fontStrong]} numberOfLines={1}>
                    {orderInfo?.bizName}
                  </Text>
                </View>
                {/* <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_SMALLER, flexDirection: 'row'}]}>
                  <Text style={[globalStyles.fontTertiary]}>暂无标签字段</Text>
                </View> */}
                <Text style={[globalStyles.fontStrong]} numberOfLines={2}>
                  {orderInfo?.spuName}
                </Text>
                {/* <View style={{alignItems: 'flex-end'}}>
                  <Text style={globalStyles.fontPrimary}>¥{orderInfo.}</Text>
                </View> */}
              </View>
            </View>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE}]} />
            <View style={[globalStyles.containerLR, {height: 30}]}>
              <Text style={globalStyles.fontPrimary}>订单编号</Text>
              <Text style={globalStyles.fontSecondary}>{orderInfo?.orderBigId}</Text>
            </View>
            <View style={[globalStyles.containerLR, {height: 30}]}>
              <Text style={globalStyles.fontPrimary}>套餐名称</Text>
              <Text style={globalStyles.fontSecondary}>{orderInfo?.skuName}</Text>
            </View>
            <View style={[globalStyles.containerLR, {height: 30}]}>
              <Text style={globalStyles.fontPrimary}>购买数量</Text>
              <Text style={globalStyles.fontSecondary}>x{orderInfo?.list?.length || 0}</Text>
            </View>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE}]} />
            <View style={[globalStyles.containerLR, {height: 30}]}>
              <Text style={globalStyles.fontPrimary}>商品金额</Text>
              <Text style={globalStyles.fontSecondary}>暂无字段</Text>
            </View>
            <View style={[globalStyles.containerLR, {height: 30}]}>
              <Text style={globalStyles.fontPrimary}>返芽</Text>
              <Text style={globalStyles.fontSecondary}>暂无字段</Text>
            </View>
            <View style={[globalStyles.containerLR, {height: 30}]}>
              <Text style={globalStyles.fontPrimary}>优惠券</Text>
              <Text style={globalStyles.fontSecondary}>暂无字段</Text>
            </View>
            <View style={[globalStyles.containerLR, {height: 30}]}>
              <Text style={globalStyles.fontPrimary}>使用芽</Text>
              <Text style={globalStyles.fontSecondary}>暂无字段</Text>
            </View>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE}]} />
            <View>
              <Text style={[globalStyles.fontPrimary, {textAlign: 'right'}]}>
                <Text>实付款：</Text>
                <Text style={{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 18}}>¥0.00</Text>
              </Text>
            </View>
          </View>
          <View style={[globalStyles.containerLR, styles.nameContainer, {marginBottom: 20}]}>
            <Text>
              <Text>预约信息</Text>
              <Text>非必填，使用前需预约</Text>
            </Text>
            <MaterialIcon name="keyboard-arrow-right" size={24} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
          </View>
        </ScrollView>
        <View style={{marginBottom: 10, padding: globalStyleVariables.MODULE_SPACE}}>
          <Button title="立即支付" onPress={payNow} style={{height: 40}} />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WaitPay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  nameContainer: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    height: 54,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 18,
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  orderContainer: {
    backgroundColor: '#fff',
    marginTop: globalStyleVariables.MODULE_SPACE,
    padding: globalStyleVariables.MODULE_SPACE,
  },
  spuCover: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
});
