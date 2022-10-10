import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {NavigationBar} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation} from '../../../models';

const Settings: React.FC = () => {
  const navigation = useNavigation<FakeNavigation>();
  function goBankCards() {
    navigation.navigate('BankCards');
  }
  return (
    <View style={styles.container}>
      <NavigationBar title="钱包设置" />
      <View>
        <TouchableHighlight onPress={goBankCards} underlayColor="#999">
          <View style={[{paddingHorizontal: globalStyleVariables.MODULE_SPACE}, styles.settingItem]}>
            <View style={[globalStyles.containerLR, styles.settingItem]}>
              <Text style={[globalStyles.fontPrimary]}>银行卡管理</Text>
              <View style={globalStyles.containerRow}>
                <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>未添加</Text>
                <MaterialIcon name="chevron-right" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} style={{marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER}} />
              </View>
            </View>
            {/* <View style={globalStyles.lineHorizontal} /> */}
          </View>
        </TouchableHighlight>
      </View>
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
