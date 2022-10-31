import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {useWalletSummary} from '../../../helper/hooks';
import {FakeNavigation} from '../../../models';
import Icon from '../../../component/Icon';
import MyStatusBar from '../../../component/MyStatusBar';

const WalletSummary: React.FC = () => {
  const [showReal, setShowReal] = React.useState(true);
  const [walletSummary] = useWalletSummary();

  const navigation = useNavigation<FakeNavigation>();

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: '#fff'}}>
      <MyStatusBar />
      <NavigationBar
        title="我的芽"
        headerRight={
          <TouchableOpacity
            activeOpacity={0.8}
            style={{paddingRight: globalStyleVariables.MODULE_SPACE}}
            onPress={() => {
              navigation.navigate('Withdrawal');
            }}>
            <Text style={[globalStyles.fontSecondary, {color: globalStyleVariables.TEXT_COLOR_PRIMARY}]}>提现</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView style={[{flex: 1, padding: globalStyleVariables.MODULE_SPACE}]}>
        <View>
          <View style={globalStyles.containerRow}>
            <Text style={globalStyles.fontPrimary}>全部芽</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowReal(!showReal);
              }}>
              <View>
                <Icon name={showReal ? 'wode_qianbao_on36' : 'wode_qianbao_off36'} size={18} color="#c4c4c4" style={{marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER}} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}>
            <Text>
              <Text style={[globalStyles.fontPrimary, {fontSize: 40}]}>{showReal ? walletSummary?.canWithdrawalMoneyYuan || '-' : '******'}</Text>
              <Text style={[globalStyles.fontTertiary, {}]}>{showReal ? '个' : ''}</Text>
            </Text>
          </View>
          <View style={[globalStyles.containerRow, {marginTop: 30}]}>
            <View style={{flex: 1}}>
              <Text style={[globalStyles.fontSecondary]}>今日收益</Text>
              <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{showReal ? walletSummary?.earningsTodayYuan : '******'}</Text>
            </View>
            <View style={[globalStyles.lineVertical, {height: 10, marginHorizontal: 20}]} />
            <View style={{flex: 1}}>
              <Text style={[globalStyles.fontSecondary]}>累计收益</Text>
              <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{showReal ? walletSummary?.totalMoneyYuan : '******'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default WalletSummary;
