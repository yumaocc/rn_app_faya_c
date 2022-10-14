import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import {Button, NavigationBar} from '../../component';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation} from '../../models';

const PaySuccess: React.FC = () => {
  const navigation = useNavigation<FakeNavigation>();
  function backToTab() {
    navigation.navigate('Tab'); // 返回Tab页
  }
  return (
    <View style={styles.container}>
      <NavigationBar
        title="支付结果"
        canBack={false}
        headerLeft={
          <TouchableOpacity activeOpacity={0.6} onPress={backToTab}>
            <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
              <MaterialIcon name="arrow-back-ios" size={24} color="#333" />
            </View>
          </TouchableOpacity>
        }
      />
      <ScrollView style={{flex: 1}}>
        <View style={[globalStyles.containerCenter, {marginTop: 60}]}>
          <Image source={require('../../assets/pay-success.png')} style={styles.image} />
          <Text style={{marginTop: 10}}>支付成功</Text>
          <View style={[globalStyles.containerRow, {marginTop: 30}]}>
            <Button type="ghost" title="继续购买" onPress={backToTab} style={styles.button} />
            <Button title="查看订单" type="primary" style={[{marginLeft: 20}, styles.button]} onPress={() => navigation.replace('OrderList')} />
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
