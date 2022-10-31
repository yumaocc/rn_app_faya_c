import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image, StatusBar} from 'react-native';
import {Button, NavigationBar} from '../../component';
import {globalStyles} from '../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation} from '../../models';

const PaySuccess: React.FC = () => {
  const navigation = useNavigation<FakeNavigation>();
  function backToTab() {
    navigation.navigate('Tab'); // 返回Tab页
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationBar title="支付结果" canBack={false} onBack={backToTab} />
      <ScrollView style={{flex: 1}}>
        <View style={[globalStyles.containerCenter, {marginTop: 60}]}>
          <Image source={require('../../assets/pay-success.png')} style={styles.image} />
          <Text style={{marginTop: 10}}>支付成功</Text>
          <View style={[globalStyles.containerRow, {marginTop: 30}]}>
            <Button type="ghost" title="继续购买" onPress={backToTab} style={styles.button} />
            <Button title="查看订单" type="primary" style={[{marginLeft: 20}, styles.button]} onPress={() => navigation.navigate('OrderList')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PaySuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 85,
    height: 85,
  },
  button: {
    height: 30,
  },
});
