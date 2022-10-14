import {SwipeAction} from '@ant-design/react-native';
import React, {useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
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
            <SwipeAction
              key={i}
              right={[
                {
                  onPress: () => {
                    handleUnbindCard(card);
                  },
                  text: <MaterialIcon name="delete" size={24} color="#fff" />,
                  backgroundColor: '#f00',
                  color: '#fff',
                },
              ]}>
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
        {/* <SwipeAction right={[{text: <MaterialIcon name="delete" size={24} color="#f00" />, backgroundColor: '#fff', color: '#fff'}]}>
          <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
            <View style={[globalStyles.containerRow, styles.item]}>
              <Text>中国工商银行（6228480402564890018）</Text>
            </View>
            <View style={globalStyles.lineHorizontal} />
          </View>
        </SwipeAction> */}
        <View style={[styles.item, globalStyles.containerRow, {paddingLeft: globalStyleVariables.MODULE_SPACE}]}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleAddCard}>
            <View style={[globalStyles.containerRow]}>
              <MaterialIcon name="add" color={globalStyleVariables.COLOR_CASH} size={24} />
              <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_CASH}]}>添加银行卡</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showUnbind && (
        <Modal
          title="提示"
          visible={true}
          onClose={() => setShowUnbind(false)}
          okText="确定解绑"
          showCancel
          style={{paddingHorizontal: 20, paddingBottom: 10}}
          onOk={unbindBankCard}>
          <View style={[{height: 100}, globalStyles.containerCenter]}>
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
