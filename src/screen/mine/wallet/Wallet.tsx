import React, {useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar} from '../../../component';
import {useUserDispatcher, useWallet} from '../../../helper/hooks';
import Icon from '../../../component/Icon';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation} from '../../../models';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import MyStatusBar from '../../../component/MyStatusBar';

const Wallet: React.FC = () => {
  const [wallet] = useWallet();
  const [showReal, setShowReal] = React.useState(true);
  const userDetail = useSelector((state: RootState) => state.user.myDetail);

  const navigation = useNavigation<FakeNavigation>();
  const [userDispatcher] = useUserDispatcher();

  useEffect(() => {
    if (!userDetail) {
      userDispatcher.getMyDetail();
    }
  }, [userDetail, userDispatcher]);

  function showSummary() {
    // todo: 判断是否是代理
    if (!userDetail?.level) {
      navigation.navigate('WalletSummary');
    } else {
      navigation.navigate('WalletSummaryAgent');
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{flex: 1, backgroundColor: '#fff'}}>
      <MyStatusBar />
      <NavigationBar
        title="我的钱包"
        safeTop={false}
        headerRight={
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('WalletSettings');
            }}
            style={{paddingRight: globalStyleVariables.MODULE_SPACE}}>
            <Icon name="nav_setting" size={24} color="#333" />
          </TouchableOpacity>
        }
      />
      <ScrollView style={{flex: 1}}>
        <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
          <TouchableOpacity activeOpacity={0.8} onPress={showSummary}>
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
                      <Icon
                        name={showReal ? 'wode_qianbao_on36' : 'wode_qianbao_off36'}
                        size={18}
                        color="#c4c4c4"
                        style={{marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER}}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <Icon name="all_arrowR36" size={20} color="#fff" />
              </View>
              <View style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}>
                <Text>
                  <Text style={[globalStyles.fontPrimary, {color: '#fff', fontSize: 40}]}>{showReal ? wallet?.moneyYuan ?? '-' : '******'}</Text>
                  <Text style={[globalStyles.fontTertiary, {color: '#fff'}]}>{showReal ? '个' : ''}</Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('CouponList');
            }}>
            <View style={[styles.card, styles.coupon]}>
              <View style={[globalStyles.containerLR]}>
                <Text style={[globalStyles.fontPrimary, {color: '#726140'}]}>卡券</Text>
                <Icon name="all_arrowR36" size={20} color="#726140" />
              </View>
              <View style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}>
                <Text>
                  <Text style={[globalStyles.fontPrimary, {color: '#726140', fontSize: 40}]}>{wallet?.numberOfCards || 0}</Text>
                  <Text style={[globalStyles.fontTertiary, {color: '#726140'}]}>张</Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
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
