import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from '../../../component/Icon';
import {Button, InputNumber, NavigationBar, Popup} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {stringToNumber} from '../../../fst/helper';
import {useWalletSummary, useBankCards, useWallet, useCommonDispatcher, useAndroidBack, useUserDispatcher} from '../../../helper/hooks';
import Popover from 'react-native-popover-view';
import {BankCardF, FakeNavigation, UserCertificationStatus} from '../../../models';
import {useNavigation} from '@react-navigation/native';
import * as api from '../../../apis';
import MyStatusBar from '../../../component/MyStatusBar';

const Withdrawal: React.FC = () => {
  const [cashMoney, setCashMoney] = useState(0);
  const [showSelectBank, setShowSelectBank] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectBankCard, setSelectBankCard] = useState<BankCardF>(null);

  const [walletSummary] = useWalletSummary();
  const [bankCards] = useBankCards();
  const [wallet, updateWallet] = useWallet();
  const navigation = useNavigation<FakeNavigation>();
  const [commonDispatcher] = useCommonDispatcher();
  const [userDispatcher] = useUserDispatcher();
  useAndroidBack();

  useEffect(() => {
    if (!selectBankCard && bankCards?.length) {
      setSelectBankCard(bankCards[0]);
    }
  }, [bankCards, selectBankCard]);

  function addBankCard() {
    setShowSelectBank(false);
    if (wallet?.status === UserCertificationStatus.Success) {
      navigation.navigate('AddBankCard');
    } else {
      navigation.navigate('Certification');
    }
  }
  function handleChangeCard(card: BankCardF) {
    setSelectBankCard(card);
    setShowSelectBank(false);
  }
  function cashAll() {
    setCashMoney(stringToNumber(walletSummary?.canWithdrawalMoneyYuan));
  }

  async function handleWithdrawal() {
    if (!cashMoney) {
      return commonDispatcher.error('请输入提现金额');
    }
    if (!selectBankCard) {
      return commonDispatcher.error('请选择银行卡');
    }
    try {
      await api.user.userWithDraw(cashMoney, selectBankCard.id);
      commonDispatcher.success('提现申请提交成功');
      updateWallet();
      userDispatcher.getWalletSummary(); // 更新钱包详情
      navigation.canGoBack() && navigation.goBack();
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  function handleShowRecords() {
    setShowMenu(false);
    navigation.navigate('WithdrawalRecords');
  }

  return (
    <>
      <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: '#fff'}}>
        <MyStatusBar />
        <NavigationBar
          title="提现"
          headerRight={
            <Popover
              isVisible={showMenu}
              popoverStyle={{borderRadius: globalStyleVariables.RADIUS_MODAL}}
              onRequestClose={() => {
                setShowMenu(false);
              }}
              animationConfig={{
                delay: 0,
                duration: 200,
              }}
              from={
                <TouchableOpacity activeOpacity={0.8} onPress={() => setShowMenu(true)}>
                  <Icon name="nav_more" size={24} color="#333" style={{marginRight: 20}} />
                </TouchableOpacity>
              }
              backgroundStyle={{backgroundColor: '#00000011'}}
              arrowSize={{width: 0, height: 0}}>
              <View style={styles.popoverMenu}>
                <TouchableOpacity activeOpacity={0.8}>
                  <View style={styles.popoverItem}>
                    <Text style={styles.popoverText}>常见疑问</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Popover>
          }
        />
        <ScrollView style={[{flex: 1}]} keyboardDismissMode="on-drag">
          <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
            {!bankCards?.length && (
              <View>
                <Text style={globalStyles.fontPrimary}>到账银行卡</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={addBankCard}>
                  <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
                    <Icon name="all_plus48" size={24} color={globalStyleVariables.COLOR_CASH} />
                    <Text style={[globalStyles.fontPrimary, {fontSize: 20, color: globalStyleVariables.COLOR_CASH}]}>添加银行卡</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {!!bankCards?.length && (
              <View>
                <Text style={globalStyles.fontPrimary}>到账银行卡</Text>
                <TouchableOpacity activeOpacity={0.5} onPress={() => setShowSelectBank(true)}>
                  <View style={[styles.bankCardItem, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
                    <View style={[globalStyles.containerRow, {flex: 1}]}>
                      <Text style={[styles.bankText]}>
                        {selectBankCard?.bankCodeName}({selectBankCard?.accountNo})
                      </Text>
                    </View>
                    <Icon name="all_arrowR36" size={24} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                  </View>
                </TouchableOpacity>
                <View style={[globalStyles.lineHorizontal, {marginBottom: globalStyleVariables.MODULE_SPACE}]} />
                <Text style={globalStyles.fontPrimary}>提现金额</Text>
                <View style={[globalStyles.containerRow, {height: 45, marginTop: 20}]}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 40, padding: 0, includeFontPadding: false}]}>¥</Text>
                  <InputNumber min={-Infinity} digit={2} controls={false} styles={inputStyle} value={cashMoney} onChange={setCashMoney} placeholder="0" />
                </View>
                <View style={[globalStyles.lineHorizontal, {marginBottom: globalStyleVariables.MODULE_SPACE}]} />
                <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
                  <Text style={[globalStyles.fontSecondary]}>当前可提现¥{walletSummary?.canWithdrawalMoneyYuan}</Text>
                  {!!walletSummary?.canWithdrawalMoney && (
                    <>
                      <Text>，</Text>
                      <TouchableOpacity activeOpacity={0.8} onPress={cashAll}>
                        <Text style={[globalStyles.fontSecondary, {color: globalStyleVariables.COLOR_CASH}]}>全部提现</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                <View style={[globalStyles.containerCenter, {marginTop: 90}]}>
                  <Button title="确定" cash style={styles.button} onPress={handleWithdrawal} />
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity activeOpacity={0.8} onPress={handleShowRecords}>
          <View style={[globalStyles.containerCenter, {paddingBottom: 20}]}>
            <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_LINK}]}>提现记录</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>

      <Popup visible={showSelectBank} onClose={() => setShowSelectBank(false)} style={styles.model}>
        <View style={styles.banksContainer}>
          {bankCards?.map(card => {
            return (
              <TouchableOpacity activeOpacity={0.5} onPress={() => handleChangeCard(card)} key={card.id}>
                <View style={[styles.bankCardItem]}>
                  <Text style={[styles.bankText]}>
                    {card?.bankCodeName}({card?.accountNo})
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity activeOpacity={0.5} onPress={addBankCard}>
            <View style={[styles.bankCardItem, {borderBottomWidth: 0}]}>
              <Icon name="all_plus48" size={24} color={globalStyleVariables.COLOR_CASH} />
              <Text style={[styles.bankText, {color: globalStyleVariables.COLOR_CASH}]}>添加银行卡</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Popup>
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
  model: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  banksContainer: {
    padding: globalStyleVariables.MODULE_SPACE,
  },
  bankText: {
    fontSize: 15,
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
    fontWeight: '500',
    marginLeft: globalStyleVariables.MODULE_SPACE,
  },
  bankCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: globalStyleVariables.BORDER_COLOR,
  },
  popoverMenu: {
    padding: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
    borderRadius: 5,
    width: 100,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: globalStyleVariables.BORDER_COLOR,
  },
  popoverItem: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popoverText: {
    fontSize: 15,
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
});

const inputStyle = StyleSheet.create({
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
