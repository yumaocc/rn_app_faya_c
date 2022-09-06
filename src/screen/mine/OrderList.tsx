import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Button, Steps} from '../../component';
import {Step} from '../../component/Steps';

import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {FakeNavigation, OrderF, OrderStatus} from '../../models';
import * as api from '../../apis';
import {dictOrderState} from '../../helper/dictionary';
import {useNavigation} from '@react-navigation/native';

const OrderList: React.FC = () => {
  const [orders, setOrders] = React.useState<OrderF[]>([]);

  const navigation = useNavigation<FakeNavigation>();

  const steps: Step[] = [
    {title: ({active}) => <Text style={active ? styles.stepActive : styles.stepInactive}>全部</Text>, key: 'all'},
    {title: ({active}) => <Text style={active ? styles.stepActive : styles.stepInactive}>未支付</Text>, key: 'waitPay'},
    {title: ({active}) => <Text style={active ? styles.stepActive : styles.stepInactive}>退款/售后</Text>, key: 'refund'},
  ];

  function handleBack() {
    console.log('back');
  }

  useEffect(() => {
    async function f() {
      const res = await api.order.getOrderList({pageIndex: 1, pageSize: 10});
      // console.log(res);
      setOrders(res);
    }
    f();
  }, []);

  return (
    <>
      <SafeAreaView edges={['top']} style={{backgroundColor: '#f4f4f4', flex: 1}}>
        <View style={[globalStyles.containerRow, {paddingHorizontal: globalStyleVariables.MODULE_SPACE, height: 50, backgroundColor: '#fff'}]}>
          <TouchableOpacity activeOpacity={0.5} onPress={handleBack}>
            <View style={styles.arrowContainer}>
              <View style={styles.arrow} />
            </View>
          </TouchableOpacity>
          {/* 搜索框 */}
          <View style={[styles.searchBar]}>
            <Icon name="search" size={20} color="#999" style={{marginRight: globalStyleVariables.MODULE_SPACE}} />
            <TextInput style={styles.inputCore} placeholder="搜索订单号/商品名称" />
            {/* <InputItem style={styles.inputCore} placeholder="搜索订单号/商品名称" /> */}
          </View>
          <TouchableOpacity activeOpacity={0.5}>
            <Text style={[globalStyles.fontPrimary, {fontSize: 16}]}>搜索</Text>
          </TouchableOpacity>
        </View>
        <Steps steps={steps} style={styles.stepContainer} />
        <ScrollView style={{flex: 1}}>
          <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
            {orders.map(order => {
              return (
                <View key={order.id} style={styles.order}>
                  <View style={[globalStyles.containerRow, {alignItems: 'flex-start'}]}>
                    <Image source={{uri: order.spuCoverImage}} style={styles.orderCover} />
                    <View style={{flex: 1}}>
                      <View style={[globalStyles.containerLR]}>
                        <View>
                          <Text style={globalStyles.fontPrimary}>{order.bizName}</Text>
                        </View>
                        <View>
                          <Text style={[order.status === OrderStatus.Paid && {color: globalStyleVariables.COLOR_PRIMARY}]}>{dictOrderState(order.status)}</Text>
                        </View>
                      </View>
                      <Text style={[globalStyles.fontStrong]}>{order.skuName}</Text>
                      <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_SMALLER}]} />
                      <View style={globalStyles.containerLR}>
                        <Text style={globalStyles.fontTertiary}>数量</Text>
                        <Text style={globalStyles.fontPrimary}>x{order.quantityOfOrder}</Text>
                      </View>
                      <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_SMALLER}]} />
                      <View style={globalStyles.containerLR}>
                        <View style={[globalStyles.containerRow, {alignItems: 'flex-end'}]}>
                          <Text style={[globalStyles.fontTertiary, {paddingBottom: 3}]}>实付</Text>
                          <Text style={[globalStyles.fontPrimary, {padding: 0, marginLeft: 10}]}>
                            <Text>¥</Text>
                            <Text style={{fontSize: 20}}>{order.paidRealMoneyYuan}</Text>
                          </Text>
                        </View>
                        <Button
                          onPress={() => {
                            navigation.navigate('OrderDetail', {id: order.orderBigIdStr});
                          }}
                          title="立即使用"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
OrderList.defaultProps = {
  title: 'OrderList',
};
export default OrderList;
const styles = StyleSheet.create({
  stepContainer: {
    backgroundColor: '#fff',
    height: 40,
  },
  stepActive: {
    color: globalStyleVariables.COLOR_PRIMARY,
  },
  stepInactive: {
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  arrowContainer: {
    paddingLeft: globalStyleVariables.MODULE_SPACE,
    alignItems: 'center',
    height: 40,
    flexDirection: 'row',
  },
  arrow: {
    width: 12,
    height: 12,
    marginRight: 5,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    transform: [{rotate: '-45deg'}],
  },
  searchBar: {
    flex: 1,
    height: 35,
    flexDirection: 'row',
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#0000000D',
    marginHorizontal: globalStyleVariables.MODULE_SPACE,
    borderRadius: 35,
  },
  inputCore: {
    flex: 1,
    padding: 0,
  },
  order: {
    backgroundColor: '#fff',
    marginBottom: globalStyleVariables.MODULE_SPACE,
    borderRadius: 5,
    padding: globalStyleVariables.MODULE_SPACE,
  },
  orderCover: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
});
