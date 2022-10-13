import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TextInputProps, TouchableOpacity} from 'react-native';
import {Button, NavigationBar} from '../../../component';
import FormItem from '../../../component/Form/FormItem';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useCommonDispatcher, useUserDispatcher, useWallet} from '../../../helper/hooks';
import * as api from '../../../apis';
import {FakeNavigation} from '../../../models';
import {useNavigation} from '@react-navigation/native';

const AddBankCard: React.FC = () => {
  const [agree, setAgree] = useState(false);
  const [bankCard, setBankCard] = useState('');
  const [loading, setLoading] = useState(false);
  const disabled = useMemo(() => {
    return !agree || !bankCard || loading;
  }, [agree, bankCard, loading]);

  const [commonDispatcher] = useCommonDispatcher();
  const [userDispatcher] = useUserDispatcher();
  const navigation = useNavigation<FakeNavigation>();
  const [wallet, updateWallet] = useWallet();

  async function submit() {
    if (!bankCard) {
      return commonDispatcher.error('请输入银行卡号');
    }
    try {
      setLoading(true);
      await api.user.addNewBankCard(bankCard);
      commonDispatcher.success('新增成功');
      setLoading(false);
      updateWallet(); // 刷新钱包信息
      userDispatcher.loadBankCards(); // 刷新银行卡
      navigation.canGoBack() && navigation.goBack();
    } catch (error) {
      setLoading(false);
      commonDispatcher.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <NavigationBar title="添加银行卡" />
      <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
        <View style={[{marginVertical: globalStyleVariables.MODULE_SPACE}, globalStyles.containerCenter]}>
          <Text style={globalStyles.fontTertiary}>请绑定持卡人本人的银行卡</Text>
        </View>
        <FormItem {...formItemProps} label="持卡人">
          <Text style={[globalStyles.fontTertiary, {fontSize: 15, paddingRight: globalStyleVariables.MODULE_SPACE}]}>{wallet?.cardholder}</Text>
        </FormItem>
        <FormItem {...formItemProps} label="银行卡号">
          <TextInput {...formItemInputProps} keyboardType="numeric" value={bankCard} onChangeText={setBankCard} placeholder="请输入银行卡号" />
        </FormItem>

        {/* 协议 */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => setAgree(!agree)} style={{marginTop: 10}}>
          <View style={[globalStyles.containerRow]}>
            {agree ? (
              <MaterialIcon name="check-circle" size={24} color={globalStyleVariables.COLOR_CASH} />
            ) : (
              <MaterialIcon name="radio-button-unchecked" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
            )}
            {/* todo: 协议内容和链接 */}
            <Text style={{marginLeft: globalStyleVariables.MODULE_SPACE}}>已阅读并同意《实名认证服务协议》</Text>
          </View>
        </TouchableOpacity>

        <View style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}>
          <Button loading={loading} style={styles.button} textStyle={{fontSize: 15}} disabled={disabled} onPress={submit} title="确认添加" />
        </View>
      </View>
    </View>
  );
};

export default AddBankCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: globalStyleVariables.COLOR_CASH,
    borderColor: globalStyleVariables.COLOR_CASH,
  },
});

const formItemProps = {
  hiddenBorderTop: true,
  styles: {container: {paddingVertical: 7}, children: {}},
};

const formItemInputProps: TextInputProps = {
  placeholderTextColor: globalStyleVariables.TEXT_COLOR_TERTIARY,
  clearButtonMode: 'while-editing',
  style: {
    padding: 0,
    fontSize: 15,
    paddingRight: globalStyleVariables.MODULE_SPACE,
    textAlign: 'right',
    width: '100%',
    flex: 1,
    height: 20,
  },
};
