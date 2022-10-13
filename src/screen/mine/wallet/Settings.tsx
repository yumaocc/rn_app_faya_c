import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {Modal, NavigationBar} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation, UserCertificationStatus} from '../../../models';
import {useWallet} from '../../../helper/hooks';

const Settings: React.FC = () => {
  const [showWaiting, setShowWaiting] = useState(false);

  const navigation = useNavigation<FakeNavigation>();
  const [wallet] = useWallet();

  function handleClickBank() {
    const status = wallet?.status;
    switch (status) {
      case UserCertificationStatus.Success:
        navigation.navigate('BankCards');
        break;
      case UserCertificationStatus.Checking:
        setShowWaiting(true);
        break;
      default:
        navigation.navigate('Certification');
        break;
    }
  }

  function renderBanks() {
    const status = wallet?.status;

    if (status === UserCertificationStatus.UnSubmit) {
      return <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>未添加</Text>;
    }
    if (status === UserCertificationStatus.Checking) {
      return <Text style={[{fontSize: 15, color: globalStyleVariables.COLOR_WARNING_YELLOW}]}>审核中</Text>;
    }
    if (status === UserCertificationStatus.Success) {
      return <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>{wallet?.numberOfBankCards}张</Text>;
    }
    if (status === UserCertificationStatus.Failed) {
      return <Text style={[{fontSize: 15, color: globalStyleVariables.COLOR_WARNING_RED}]}>审核失败</Text>;
    }
    return null;
  }

  return (
    <View style={styles.container}>
      <NavigationBar title="钱包设置" />
      <View>
        <TouchableHighlight underlayColor="#999" onPress={handleClickBank}>
          <View style={[{paddingHorizontal: globalStyleVariables.MODULE_SPACE}, styles.settingItem]}>
            <View style={[globalStyles.containerLR, styles.settingItem]}>
              <Text style={[globalStyles.fontPrimary]}>银行卡管理</Text>
              <View style={globalStyles.containerRow}>
                {renderBanks()}
                {/* <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>未添加</Text> */}
                <MaterialIcon name="chevron-right" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} style={{marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER}} />
              </View>
            </View>
            {/* <View style={globalStyles.lineHorizontal} /> */}
          </View>
        </TouchableHighlight>
      </View>
      <Modal title="提示" visible={showWaiting} onClose={() => setShowWaiting(false)} styles={{defaultFooterWrapper: {paddingHorizontal: 20}}} style={{paddingBottom: 10}}>
        <View style={[globalStyles.containerCenter, {height: 100}]}>
          <Text>还在审核中，请耐心等待</Text>
          <View>
            <Text>请留意【易宝支付】短信内容</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  settingItem: {
    height: 50,
    backgroundColor: '#fff',
  },
});
