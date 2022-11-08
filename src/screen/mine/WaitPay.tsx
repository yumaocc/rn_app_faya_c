import React, {useEffect, useMemo} from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Image, Linking} from 'react-native';
import {Button, NavigationBar} from '../../component';
import Icon from '../../component/Icon';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation, OrderDetailF, OrderPayState, PayChannel} from '../../models';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAndroidBack, useAppState, useCommonDispatcher, useParams} from '../../helper/hooks';
import * as api from '../../apis';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {getAliPayUrl, getWechatPayUrl} from '../../constants';
import moment from 'moment';
import MyStatusBar from '../../component/MyStatusBar';

const WaitPay: React.FC = () => {
  const navigation = useNavigation<FakeNavigation>();
  const params = useParams<{id: string; canBack?: boolean}>();
  const id = useMemo(() => params.id, [params]);
  const canBack = useMemo(() => !!params?.canBack, [params]);
  const [orderInfo, setOrderInfo] = React.useState<OrderDetailF>(null);
  const [, setLoading] = React.useState(true);
  const [isPaying, setIsPaying] = React.useState(false);
  const appState = useAppState();
  useAndroidBack();

  const token = useSelector((state: RootState) => state.common.config.token);
  const [restSeconds, setRestSeconds] = React.useState(0);
  const [expired, setExpired] = React.useState(false);
  const showTime = useMemo(() => {
    if (restSeconds <= 0) {
      return <Text />;
    }
    const minutes = Math.floor(restSeconds / 60);
    const seconds = restSeconds % 60;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const showSep = restSeconds % 2 === 0;
    return (
      <Text>
        <Text>剩{minutesStr}</Text>
        <Text>{showSep ? ':' : ' '}</Text>
        <Text>{secondsStr}自动关闭</Text>
      </Text>
    );
  }, [restSeconds]);

  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    if (appState === 'active' && isPaying) {
      api.order
        .checkOrderPayState(id)
        .then(res => {
          const {status} = res;
          if (status === OrderPayState.PAYED) {
            navigation.replace('PaySuccess');
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
  }, [appState, isPaying, commonDispatcher, navigation, id]);

  useEffect(() => {
    if (!orderInfo) {
      return;
    }
    const {canPayAgainTimeEnd} = orderInfo;
    const now = moment();
    // const end = moment('2022-11-08 18:42:30', 'YYYY-MM-DD HH:mm:ss');
    const end = moment(canPayAgainTimeEnd, 'YYYY-MM-DD HH:mm:ss');
    const rest = end.diff(now, 'seconds');
    if (rest <= 1) {
      // 最后一秒就要过期了
      setExpired(true);
    } else {
      setRestSeconds(rest);
    }
  }, [orderInfo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (restSeconds > 1) {
        setRestSeconds(x => x - 1);
      } else {
        setExpired(true);
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [restSeconds]);

  useEffect(() => {
    api.order
      .getOrderDetail(id)
      .then(setOrderInfo)
      .catch(commonDispatcher.error)
      .finally(() => setLoading(false));
  }, [commonDispatcher.error, id]);

  function handleBack() {
    if (canBack) {
      navigation.canGoBack() && navigation.goBack();
    } else {
      navigation.navigate('Tab'); // 支付完返回Tab页
    }
  }
  async function payNow() {
    try {
      let link = '';
      if (orderInfo?.ypPayChannel === PayChannel.WECHAT) {
        const o = encodeURIComponent(
          JSON.stringify({
            skuName: orderInfo?.skuName || '',
            amount: orderInfo?.numberOfProducts || '',
            skuAmount: orderInfo?.paidAllMoneyYuan || '',
          }),
        );
        const params = `token=${token}&oid=${encodeURIComponent(id)}&o=${o}`;
        link = getWechatPayUrl(params);
        // Linking.openURL();
      } else {
        const prePayTn = await api.order.payAgain(id);
        link = getAliPayUrl(prePayTn);
      }
      Linking.openURL(link);

      setTimeout(() => {
        setIsPaying(true);
      }, 1000);
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar
        title=""
        canBack={false}
        headerLeft={
          <View style={globalStyles.containerRow}>
            <TouchableOpacity activeOpacity={0.6} onPress={handleBack}>
              <View style={[{paddingLeft: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
                <Icon name="nav_back48" width={11} height={24} color="#333" />
              </View>
            </TouchableOpacity>
            <View style={globalStyles.moduleMarginLeft}>
              <View>
                <Text style={[{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 18}]}>{expired ? '订单已过期' : '待支付'}</Text>
              </View>
              {!expired && (
                <View>
                  <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_PRIMARY, fontSize: 12, lineHeight: 15}]}>{showTime}</Text>
                </View>
              )}
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
          <View style={[styles.orderContainer]}>
            <View style={[globalStyles.containerRow, {alignItems: 'flex-start'}]}>
              <Image source={{uri: orderInfo?.spuCoverImage}} style={styles.spuCover} />
              <View>
                <View style={globalStyles.containerRow}>
                  <Icon name="shangpin_shanghu24" size={15} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                  <Text style={[globalStyles.fontPrimary, {fontSize: 12, marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER}]}>{orderInfo?.bizName}</Text>
                </View>
                <Text style={[globalStyles.fontPrimary, {lineHeight: 20, marginTop: globalStyleVariables.MODULE_SPACE}]} numberOfLines={2}>
                  {orderInfo?.spuName}
                </Text>
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
              <Text style={globalStyles.fontSecondary}>x{orderInfo?.numberOfProducts || 0}</Text>
            </View>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE}]} />
            {!!orderInfo?.willReturnUserCommission && (
              <View style={[globalStyles.containerLR, {height: 30}]}>
                <Text style={globalStyles.fontPrimary}>返芽</Text>
                <Text style={globalStyles.fontSecondary}>{orderInfo?.willReturnUserCommissionYuan}</Text>
              </View>
            )}
            <View style={[globalStyles.containerLR, {height: 30}]}>
              <Text style={globalStyles.fontPrimary}>优惠券</Text>
              <Text style={globalStyles.fontSecondary}>-¥{orderInfo?.usedCouponMoneyYuan}</Text>
            </View>
            <View style={[globalStyles.containerLR, {height: 30}]}>
              <Text style={globalStyles.fontPrimary}>使用芽</Text>
              <Text style={globalStyles.fontSecondary}>-¥{orderInfo?.usedIntegralMoneyYuan}</Text>
            </View>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE}]} />
            <View>
              <Text style={[globalStyles.fontPrimary, {textAlign: 'right'}]}>
                <Text>应支付：</Text>
                <Text style={{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 18}}>¥{orderInfo?.paidAllMoneyYuan}</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={{marginBottom: 10, padding: globalStyleVariables.MODULE_SPACE}}>
          <Button title="立即支付" type="primary" disabled={expired} onPress={payNow} style={{height: 40}} />
        </View>
      </SafeAreaView>

      {isPaying && (
        <Modal visible={true} transparent animationType="fade">
          <View style={[globalStyles.containerCenter, {flex: 1, backgroundColor: '#00000033'}]}>
            <View style={[globalStyles.containerCenter, {backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 40, borderRadius: 5}]}>
              <Text style={[globalStyles.fontPrimary]}>正在支付</Text>
            </View>
          </View>
        </Modal>
      )}
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
    paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 18,
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  orderContainer: {
    backgroundColor: '#fff',
    marginTop: globalStyleVariables.MODULE_SPACE,
    padding: globalStyleVariables.MODULE_SPACE_BIGGER,
  },
  spuCover: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
});
