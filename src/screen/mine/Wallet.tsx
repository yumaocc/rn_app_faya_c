import React, {useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar} from '../../component';
import {useWallet} from '../../helper/hooks';
import {Icon} from '@ant-design/react-native';
import {globalStyles, globalStyleVariables} from '../../constants/styles';

const Wallet: React.FC = () => {
  const [wallet, updateWallet] = useWallet();
  const [showReal, setShowReal] = React.useState(false);

  useEffect(() => {
    updateWallet();
  }, [updateWallet]);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{flex: 1, backgroundColor: '#fff'}}>
      <NavigationBar
        title="我的钱包"
        safeTop={false}
        headerRight={
          <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
            <Icon name="setting" size={24} color="#333" />
          </TouchableOpacity>
        }
      />
      <ScrollView style={{flex: 1}}>
        <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
          <View style={[styles.card, styles.balance]}>
            <View style={[globalStyles.containerLR]}>
              <View style={[globalStyles.containerRow]}>
                <Text style={[globalStyles.fontPrimary, {color: '#fff'}]}>我的芽</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setShowReal(!showReal);
                  }}>
                  <View>
                    {showReal ? (
                      <MaterialIcon name="visibility" size={24} color="#fff" style={{marginLeft: globalStyleVariables.MODULE_SPACE}} />
                    ) : (
                      <MaterialIcon name="visibility-off" size={24} color="#fff" style={{marginLeft: globalStyleVariables.MODULE_SPACE}} />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
                <MaterialIcon name="arrow-forward-ios" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}>
              <Text>
                <Text style={[globalStyles.fontPrimary, {color: '#fff', fontSize: 40}]}>{showReal ? wallet.moneyYuan : '******'}</Text>
                <Text style={[globalStyles.fontTertiary, {color: '#fff'}]}>{showReal ? '个' : ''}</Text>
              </Text>
            </View>
          </View>
          <View style={[styles.card, styles.coupon]}>
            <View style={[globalStyles.containerLR]}>
              <Text style={[globalStyles.fontPrimary, {color: '#726140'}]}>卡券</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
                <MaterialIcon name="arrow-forward-ios" size={20} color="#726140" />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}>
              <Text>
                <Text style={[globalStyles.fontPrimary, {color: '#726140', fontSize: 40}]}>{wallet?.numberOfCards || 0}</Text>
                <Text style={[globalStyles.fontTertiary, {color: '#726140'}]}>张</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View />
    </SafeAreaView>
  );
};
export default Wallet;
const styles = StyleSheet.create({
  card: {
    padding: globalStyleVariables.MODULE_SPACE_BIGGER,
    borderRadius: 7,
  },
  balance: {
    backgroundColor: '#33635A',
  },
  coupon: {
    marginTop: globalStyleVariables.MODULE_SPACE_BIGGER,
    backgroundColor: '#F4D482',
  },
});
