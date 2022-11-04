import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar} from '../../../component';
import Icon from '../../../component/Icon';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {moneyToYuan} from '../../../fst/helper';
import {useCoupons, useInvalidCoupons, useUsedCoupons} from '../../../helper/hooks';
import {CouponF, CouponState} from '../../../models';

const CouponList: React.FC = () => {
  const [couponList] = useCoupons();
  const [usedCoupons] = useUsedCoupons();
  const [invalidCoupons] = useInvalidCoupons();

  function renderCouponItem(coupon: CouponF, index: number) {
    const marginTop = index === 0 ? 0 : globalStyleVariables.MODULE_SPACE;
    const valid = coupon.status === CouponState.Unused;
    const backgroundColor = valid ? '#F9CE8F' : '#e3e3e3';
    const color = valid ? '#7C5C35' : globalStyleVariables.TEXT_COLOR_TERTIARY;

    return (
      <View key={coupon.id} style={[styles.couponItem, {marginTop, backgroundColor}]}>
        <View style={globalStyles.containerRow}>
          <View style={[{width: 100}, globalStyles.containerCenter]}>
            <Text style={{color}}>
              <Text style={{fontSize: 15}}>¥</Text>
              <Text style={{fontSize: 30}}>{coupon.moneyYuan}</Text>
            </Text>
            <Text style={{color, fontSize: 12}}>满{moneyToYuan(coupon.amountThreshold)}可用</Text>
          </View>
          <View style={[globalStyles.lineVertical, {marginHorizontal: 20, height: 12, backgroundColor: '#0000001A'}]} />
          <View style={{flex: 1}}>
            <Text style={{color, fontSize: 15, fontWeight: '600'}}>{coupon.name}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['bottom']} style={{flex: 1}}>
        <NavigationBar title="优惠券" />
        <ScrollView style={{flex: 1}}>
          <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
            {couponList?.length ? (
              couponList.map(renderCouponItem)
            ) : (
              <View style={[{marginTop: 120}, globalStyles.containerCenter]}>
                <View style={[globalStyles.containerCenter, {width: 50, height: 50, borderRadius: 25, backgroundColor: '#0000000D'}]}>
                  <Icon name="empty_quan" size={24} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                </View>
                <Text style={[globalStyles.fontTertiary, {marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}]}>暂无可用优惠券</Text>
              </View>
            )}

            {!!usedCoupons?.length && (
              <>
                <View style={{marginTop: 40, marginBottom: 15}}>
                  <Text>已使用</Text>
                </View>
                {usedCoupons.map(renderCouponItem)}
              </>
            )}
            {!!invalidCoupons?.length && (
              <>
                <View style={{marginTop: 40, marginBottom: 15}}>
                  <Text>已失效</Text>
                </View>
                {invalidCoupons.map(renderCouponItem)}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default CouponList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  couponItem: {
    paddingVertical: 24,
    paddingHorizontal: 15,
    borderRadius: 7,
  },
});
