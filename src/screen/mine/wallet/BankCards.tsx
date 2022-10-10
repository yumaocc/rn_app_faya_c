import {SwipeAction} from '@ant-design/react-native';
import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {NavigationBar} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useBankCards} from '../../../helper/hooks';

const BankCards: React.FC = () => {
  const [bankCards] = useBankCards();
  return (
    <View style={styles.container}>
      <NavigationBar title="银行卡管理" />
      <ScrollView style={{flex: 1}}>
        {bankCards.map((card, i) => {
          return (
            <SwipeAction key={i} right={[{text: '解绑', backgroundColor: '#f00', color: '#fff'}]}>
              <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
                <View style={[globalStyles.containerRow, styles.item]}>
                  <Text>
                    {card.bankCodeName}（{card.accountNo}）
                  </Text>
                </View>
                <View style={globalStyles.lineHorizontal} />
              </View>
            </SwipeAction>
          );
        })}
        {/* <SwipeAction right={[{text: '解绑', backgroundColor: '#f00', color: '#fff'}]}>
          <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
            <View style={[globalStyles.containerRow, styles.item]}>
              <Text>中国工商银行（6228480402564890018）</Text>
            </View>
            <View style={globalStyles.lineHorizontal} />
          </View>
        </SwipeAction> */}
        <View style={[styles.item, globalStyles.containerRow, {paddingLeft: globalStyleVariables.MODULE_SPACE}]}>
          <TouchableOpacity activeOpacity={0.8}>
            <View style={[globalStyles.containerRow]}>
              <MaterialIcon name="add" color={globalStyleVariables.COLOR_CASH} size={24} />
              <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_CASH}]}>添加银行卡</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default BankCards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    height: 50,
  },
});
