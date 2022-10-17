import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Icon as AIcon} from '@ant-design/react-native';
import Icon from '../../component/Icon';
import {Steps} from '../../component';
import {Step} from '../../component/Steps';

import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {FakeNavigation} from '../../models';
import {useNavigation} from '@react-navigation/native';
import {useInfinityRotate, useOrderDispatcher} from '../../helper/hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import OrderItem from './OrderItem';

const OrderList: React.FC = () => {
  const [currentKey, setCurrentKey] = React.useState<string>('all');
  const [searchName, setSearchName] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');

  const orders = useSelector((state: RootState) => state.order.orders);
  const orderList = useMemo(() => orders.list, [orders]);
  const showEmpty = useMemo(() => orders.list.length === 0 && orders.status !== 'loading', [orders]);
  const showNoMore = useMemo(() => !showEmpty && orders.status === 'noMore', [orders, showEmpty]);

  const navigation = useNavigation<FakeNavigation>();
  const rotateDeg = useInfinityRotate();
  const [orderDispatcher] = useOrderDispatcher();

  const steps: Step[] = [
    {title: ({active}) => <Text style={active ? styles.stepActive : styles.stepInactive}>全部</Text>, key: 'all'},
    {title: ({active}) => <Text style={active ? styles.stepActive : styles.stepInactive}>待支付</Text>, key: '1'},
    {title: ({active}) => <Text style={active ? styles.stepActive : styles.stepInactive}>已支付</Text>, key: '2'},
    {title: ({active}) => <Text style={active ? styles.stepActive : styles.stepInactive}>退款/售后</Text>, key: '3'},
    {title: ({active}) => <Text style={active ? styles.stepActive : styles.stepInactive}>待评价</Text>, key: '4'},
  ];

  function handleBack() {
    navigation.canGoBack() && navigation.goBack();
  }

  useEffect(() => {
    orderDispatcher.loadOrders(currentKey, name, true);
  }, [currentKey, name, orderDispatcher]);

  function searchOrder() {
    setName(searchName);
  }

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var scrollViewHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    const offset = 50;
    const isReachBottom = offsetY + scrollViewHeight + offset >= contentSizeHeight;
    if (isReachBottom) {
      orderDispatcher.loadOrders(currentKey, name, false);
    }
  }

  function goDetail(id: string) {
    navigation.navigate('OrderDetail', {id});
  }
  function goComment(id: string) {
    navigation.navigate('OrderComment', {id});
  }

  return (
    <>
      <SafeAreaView edges={['top']} style={{backgroundColor: '#fff', flex: 1}}>
        <View style={[globalStyles.containerRow, {height: 50, backgroundColor: '#fff', paddingRight: globalStyleVariables.MODULE_SPACE}]}>
          <TouchableOpacity activeOpacity={0.5} onPress={handleBack}>
            <View style={styles.arrowContainer}>
              <View style={styles.arrow} />
            </View>
          </TouchableOpacity>
          {/* 搜索框 */}
          <View style={[styles.searchBar]}>
            <Icon name="all_input_search36" size={18} color="#999" style={{marginRight: globalStyleVariables.MODULE_SPACE}} />
            <TextInput
              style={styles.inputCore}
              placeholder="搜索订单号/商品名称"
              value={searchName}
              onChangeText={setSearchName}
              onSubmitEditing={searchOrder}
              returnKeyType="search"
              returnKeyLabel="搜索"
              clearButtonMode="while-editing"
            />
            {/* <InputItem style={styles.inputCore} placeholder="搜索订单号/商品名称" /> */}
          </View>
          <TouchableOpacity activeOpacity={0.5} onPress={searchOrder}>
            <Text style={[globalStyles.fontPrimary, {fontSize: 16}]}>搜索</Text>
          </TouchableOpacity>
        </View>
        <Steps steps={steps} style={styles.stepContainer} currentKey={currentKey} onChange={setCurrentKey} />
        <ScrollView style={{flex: 1, backgroundColor: '#f4f4f4'}} onMomentumScrollEnd={handleScrollEnd}>
          <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
            {showEmpty && (
              <View style={globalStyles.containerCenter}>
                <MaterialIcon name="info" size={30} color="#999" style={{marginBottom: globalStyleVariables.MODULE_SPACE}} />
                <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>空空如也</Text>
              </View>
            )}
            {orderList.map(order => {
              return (
                <OrderItem
                  key={order.id}
                  order={order}
                  onGoDetail={goDetail}
                  onGoComment={goComment}
                  onPayAgain={orderId => {
                    navigation.navigate('WaitPay', {id: orderId, canBack: true});
                  }}
                />
              );
            })}
            {orders.status === 'loading' && (
              <View style={[globalStyles.containerCenter]}>
                <Animated.View style={[styles.searchIconContainer, {transform: [{rotate: rotateDeg.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']})}]}]}>
                  <AIcon name="loading-3-quarters" color={globalStyleVariables.TEXT_COLOR_TERTIARY} size={30} />
                </Animated.View>
                <Text style={[globalStyles.fontTertiary, {fontSize: 15, marginTop: 10}]}>正在加载中...</Text>
              </View>
            )}
            {showNoMore && (
              <View style={globalStyles.containerCenter}>
                <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>没有更多了</Text>
              </View>
            )}
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
  searchIconContainer: {
    width: 30,
    height: 30,
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
});
