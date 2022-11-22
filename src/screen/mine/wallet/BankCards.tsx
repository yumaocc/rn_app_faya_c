import React, {useState} from 'react';
import Icon from '../../../component/Icon';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight} from 'react-native';
import {Modal, NavigationBar} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useBankCards, useCommonDispatcher, useWallet} from '../../../helper/hooks';
import {useNavigation} from '@react-navigation/native';
import {BankCardF, FakeNavigation, UserCertificationStatus} from '../../../models';
import * as api from '../../../apis';

const BankCards: React.FC = () => {
  const [showUnbind, setShowUnbind] = useState(false);
  const [selectCard, setSelectCard] = useState<BankCardF>();

  const [bankCards, updateBankCards] = useBankCards();
  const [wallet, updateWallet] = useWallet();
  const navigation = useNavigation<FakeNavigation>();
  const [commonDispatcher] = useCommonDispatcher();

  function handleAddCard() {
    if (wallet.status !== UserCertificationStatus.Success) {
      navigation.navigate('Certification');
    } else {
      navigation.navigate('AddBankCard');
    }
  }

  async function unbindBankCard() {
    try {
      await api.user.unBindBankCard(selectCard?.id);
      commonDispatcher.success('解绑成功');
      updateBankCards();
      updateWallet();
    } catch (error) {
      commonDispatcher.error(error);
      throw error;
    }
  }

  function handleUnbindCard(bankCard: BankCardF) {
    setSelectCard(bankCard);
    setShowUnbind(true);
  }

  return (
    <View style={styles.container}>
      <NavigationBar title="银行卡管理" />
      <ScrollView style={{flex: 1}}>
        {bankCards.map((card, i) => {
          return (
            <TouchableHighlight underlayColor="#999" key={i} onPress={() => handleUnbindCard(card)}>
              <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE, backgroundColor: '#fff'}}>
                <View style={[globalStyles.containerRow, styles.item]}>
                  <Text>
                    {card.bankCodeName}（{card.accountNo}）
                  </Text>
                </View>
                <View style={globalStyles.lineHorizontal} />
              </View>
            </TouchableHighlight>
          );
        })}
        <View style={[styles.item, globalStyles.containerRow, {paddingLeft: globalStyleVariables.MODULE_SPACE}]}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleAddCard}>
            <View style={[globalStyles.containerRow]}>
              <Icon name="all_plus48" color={globalStyleVariables.COLOR_CASH} size={24} />
              <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_CASH}]}>添加银行卡</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showUnbind && (
        <Modal title="提示" visible={true} onClose={() => setShowUnbind(false)} okText="确定解绑" showCancel onOk={unbindBankCard}>
          <View style={[{height: 100}, globalStyles.containerCenter, {paddingHorizontal: 20}]}>
            <Text>
              确定解绑银行卡{selectCard?.bankCodeName}（{selectCard?.accountNo}）吗？
            </Text>
          </View>
        </Modal>
      )}
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
