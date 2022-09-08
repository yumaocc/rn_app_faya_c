import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Button, InputNumber, NavigationBar, Select} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';

const Withdrawal: React.FC = () => {
  const bankCard = [1];
  const [cashMoney, setCashMoney] = React.useState(0);
  const [id, setId] = React.useState(1);

  return (
    <>
      <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: '#fff'}}>
        <NavigationBar
          title="提现"
          headerRight={
            <TouchableOpacity activeOpacity={0.8}>
              <MaterialIcon name="more-horiz" size={24} color="#333" style={{marginRight: 20}} />
            </TouchableOpacity>
          }
        />
        <ScrollView style={[{flex: 1}]}>
          <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
            {!bankCard?.length && (
              <View>
                <Text style={globalStyles.fontPrimary}>到账银行卡</Text>
                <TouchableOpacity activeOpacity={0.8}>
                  <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
                    <MaterialIcon name="add" size={24} color={globalStyleVariables.COLOR_CASH} />
                    <Text style={[globalStyles.fontPrimary, {fontSize: 20, color: globalStyleVariables.COLOR_CASH}]}>添加银行卡</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {!!bankCard?.length && (
              <View>
                <Text style={globalStyles.fontPrimary}>到账银行卡</Text>
                <TouchableOpacity activeOpacity={0.5}>
                  <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE, height: 48}]}>
                    <View style={[globalStyles.containerRow, {flex: 1}]}>
                      <MaterialIcon name="credit-card" size={24} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                      <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>工商银行(尾号1234)</Text>
                    </View>
                    <MaterialIcon name="chevron-right" size={24} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                  </View>
                </TouchableOpacity>
                <View style={[globalStyles.lineHorizontal, {marginBottom: globalStyleVariables.MODULE_SPACE}]} />
                <Text style={globalStyles.fontPrimary}>提现金额</Text>
                <View style={[globalStyles.containerRow, {height: 45, marginTop: 20}]}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 40, padding: 0, includeFontPadding: false}]}>¥</Text>
                  <InputNumber digit={2} controls={false} styles={myStyles} value={cashMoney} onChange={setCashMoney} placeholder="0" />
                </View>
                <View style={[globalStyles.lineHorizontal, {marginBottom: globalStyleVariables.MODULE_SPACE}]} />
                <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
                  <Text style={[globalStyles.fontSecondary]}>当前芽100个，可提现¥50，</Text>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => setCashMoney(50)}>
                    <Text style={[globalStyles.fontSecondary, {color: globalStyleVariables.COLOR_CASH}]}>全部提现</Text>
                  </TouchableOpacity>
                </View>
                <View style={[globalStyles.containerCenter, {marginTop: 90}]}>
                  <Button title="确定" style={styles.button} />
                </View>
              </View>
            )}
            <Select
              options={[
                {label: '建行1', value: 1},
                {label: '农行1', value: 2},
              ]}
              value={id}
              onChange={setId}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default Withdrawal;

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 40,
    borderColor: globalStyleVariables.COLOR_CASH,
    backgroundColor: globalStyleVariables.COLOR_CASH,
  },
});

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    width: '100%',
    textAlign: 'left',
    fontSize: 40,
    color: '#333',
    fontWeight: '500',
    padding: 0,
    includeFontPadding: false,
  },
});
