import React from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {InputNumber, NavigationBar} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';

const Order: React.FC = () => {
  const [buyCount, setBuyCount] = React.useState(1);
  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: '#f4f4f4'}}>
      <NavigationBar title="确认订单" />
      <ScrollView style={{flex: 1}}>
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
          <View style={[globalStyles.containerLR, {}]}>
            <Text style={globalStyles.fontPrimary}>规格</Text>
            <View style={globalStyles.containerRow}>
              <Text style={globalStyles.fontPrimary}>特价二人餐</Text>
              <Icon name="arrow-forward-ios" size={16} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
            </View>
          </View>
          <View style={[globalStyles.containerLR, {backgroundColor: '#fff'}]}>
            <Text style={globalStyles.fontPrimary}>数量</Text>
            <InputNumber value={buyCount} onChange={setBuyCount} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Order;
