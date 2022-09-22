import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Button, NavigationBar} from '../../component';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {globalStyleVariables} from '../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation} from '../../models';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {SafeAreaView} from 'react-native-safe-area-context';

const WaitPay: React.FC = () => {
  const navigation = useNavigation<FakeNavigation>();
  const order = useSelector((state: RootState) => state.order.payOrder);
  function backToTab() {
    navigation.navigate('Tab'); // 返回Tab页
  }
  function payNow() {
    console.log('立即支付');
  }

  return (
    <View style={styles.container}>
      <NavigationBar
        title="待付款"
        headerLeft={
          <TouchableOpacity activeOpacity={0.6} onPress={backToTab}>
            <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
              <MaterialIcon name="arrow-back-ios" size={24} color="#333" />
            </View>
          </TouchableOpacity>
        }
      />
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <ScrollView style={{flex: 1}}>
          <View>
            <Text>订单编号: {order?.orderId}</Text>
          </View>
        </ScrollView>
        <Button title="立即支付" onPress={payNow} style={{height: 40, marginBottom: 10}} />
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
});
