import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, Animated, NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon as AIcon} from '@ant-design/react-native';
import Icon from '../../component/Icon';
import {Button, Steps} from '../../component';
import {Step} from '../../component/Steps';

import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {FakeNavigation} from '../../models';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useInfinityRotate, useIsLoggedIn, useOrderDispatcher} from '../../helper/hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import OrderItem from './OrderItem';
import {goLogin} from '../../router/Router';
import {isReachBottom} from '../../helper/system';

const OrderList: React.FC = () => {
  const [currentKey, setCurrentKey] = React.useState<string>('all');
  // const [searchName, setSearchName] = React.useState<string>('');
  // const [name, setName] = React.useState<string>('');

  const orders = useSelector((state: RootState) => state.order.orders);
  const orderList = useMemo(() => orders.list, [orders]);
  const isLoggedIn = useIsLoggedIn();
  const showEmpty = useMemo(() => orders.list.length === 0 && orders.status !== 'loading' && isLoggedIn, [orders, isLoggedIn]);
  const showNoMore = useMemo(() => !showEmpty && orders.status === 'noMore' && isLoggedIn, [orders, showEmpty, isLoggedIn]);

  const navigation = useNavigation<FakeNavigation>();
  const rotateDeg = useInfinityRotate();
  const [orderDispatcher] = useOrderDispatcher();
  const isFocused = useIsFocused();

  const steps: Step[] = [
    {title: ({active}) => <Text style={active ? styles.stepActive : styles.stepInactive}>全部</Text>, key: 'all'},
    {title: ({active}) => <Text style={active ? styles.stepActive : styles.stepInactive}>待支付</Text>, key: '1'},
    {title: ({active}) => <Text style={active ? styles.stepActive : styles.stepInactive}>已支付</Text>, key: '2'},
    {title: ({active}) => <Text style={active ? styles.stepActive : styles.stepInactive}>退款/售后</Text>, key: '3'},
    {title: ({active}) => <Text style={active ? styles.stepActive : styles.stepInactive}>待评价</Text>, key: '4'},
  ];

  // function handleBack() {
  //   navigation.canGoBack() && navigation.goBack();
  // }

  useEffect(() => {
    if (isFocused && isLoggedIn) {
      orderDispatcher.loadOrders(currentKey, '', true);
    }
  }, [currentKey, orderDispatcher, isFocused, isLoggedIn]);

  // function searchOrder() {
  //   setName(searchName);
  // }

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (isReachBottom(e) && isLoggedIn) {
      orderDispatcher.loadOrders(currentKey, '', false);
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
        <Steps steps={steps} style={styles.stepContainer} currentKey={currentKey} onChange={setCurrentKey} />
        <ScrollView style={{flex: 1, backgroundColor: '#f4f4f4'}} onMomentumScrollEnd={handleScrollEnd}>
          <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
            {!isLoggedIn && (
              <View style={[globalStyles.containerCenter, styles.emptyContainer]}>
                <View style={[globalStyles.containerCenter, {width: 50, height: 50, borderRadius: 50, backgroundColor: '#0000000D', marginBottom: 15}]}>
                  <Icon name="empty_dingdan" size={30} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                </View>
                <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>登录后可查看订单</Text>
                <Button style={{marginTop: 10}} title="去登录" type="primary" onPress={goLogin} />
              </View>
            )}
            {showEmpty && (
              <View style={[globalStyles.containerCenter, styles.emptyContainer]}>
                <View style={[globalStyles.containerCenter, {width: 50, height: 50, borderRadius: 50, backgroundColor: '#0000000D', marginBottom: 15}]}>
                  <Icon name="empty_dingdan" size={30} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                </View>
                <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>还没有订单</Text>
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
  emptyContainer: {
    paddingTop: 160,
  },
});
