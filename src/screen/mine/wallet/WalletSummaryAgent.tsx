import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useWalletSummary} from '../../../helper/hooks';
import {FakeNavigation} from '../../../models';
import Icon from '../../../component/Icon';
import MyStatusBar from '../../../component/MyStatusBar';

const WalletSummaryAgent: React.FC = () => {
  const [showReal, setShowReal] = React.useState(true);
  const [walletSummary] = useWalletSummary();

  const navigation = useNavigation<FakeNavigation>();

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: '#fff'}}>
      <MyStatusBar barStyle="light-content" />
      <NavigationBar
        title="我的芽"
        style={{
          backgroundColor: '#33635A',
        }}
        color="#fff"
        headerRight={
          <TouchableOpacity
            activeOpacity={0.8}
            style={{paddingRight: globalStyleVariables.MODULE_SPACE}}
            onPress={() => {
              navigation.navigate('Withdrawal');
            }}>
            <Text style={[globalStyles.fontSecondary, {color: '#fff'}]}>提现</Text>
          </TouchableOpacity>
        }
      />
      <View style={[styles.container]}>
        <View style={globalStyles.containerRow}>
          <Text style={[globalStyles.fontPrimary, {color: '#ffffff88'}]}>全部芽</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setShowReal(!showReal);
            }}>
            <View>
              <MaterialIcon name={showReal ? 'visibility' : 'visibility-off'} size={18} color="#ffffff88" style={{marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER}} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}>
          <Text>
            <Text style={[globalStyles.fontPrimary, {fontSize: 40, color: '#fff'}]}>{showReal ? walletSummary?.canWithdrawalMoneyYuan || '-' : '******'}</Text>
            <Text style={[globalStyles.fontTertiary, {color: '#ffffff88'}]}>{showReal ? '个' : ''}</Text>
          </Text>
        </View>
        <View style={[globalStyles.containerRow, {marginTop: 30}]}>
          <View style={{flex: 1}}>
            <Text style={[globalStyles.fontSecondary, {color: '#ffffff88'}]}>今日收益</Text>
            <Text style={[globalStyles.fontPrimary, {fontSize: 25, color: '#fff'}]}>{showReal ? walletSummary?.earningsTodayYuan : '******'}</Text>
          </View>
          <View style={[globalStyles.lineVertical, {height: 10, marginHorizontal: 20, backgroundColor: '#ffffff33'}]} />
          <View style={{flex: 1}}>
            <Text style={[globalStyles.fontSecondary, {color: '#ffffff88'}]}>暂存收益</Text>
            <Text style={[globalStyles.fontPrimary, {fontSize: 25, color: '#fff'}]}>{showReal ? walletSummary?.stagingMoneyYuan : '******'}</Text>
          </View>
        </View>
        <View style={[globalStyles.containerRow, {marginTop: 30}]}>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('IncomeOrderList')}>
              <View style={[globalStyles.containerRow]}>
                <Text style={[globalStyles.fontSecondary, {color: '#ffffff88'}]}>累计收益</Text>
                <Icon name="all_arrowR36" size={16} color="#ffffff88" />
              </View>
            </TouchableOpacity>
            <Text style={[globalStyles.fontPrimary, {fontSize: 25, color: '#fff'}]}>{showReal ? walletSummary?.totalMoneyYuan : '******'}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={[{flex: 1, backgroundColor: '#fff'}]}>
        <View style={{padding: 20}}>
          <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>赚芽攻略</Text>
          <View style={{marginTop: 20}}>
            <View style={[globalStyles.containerRow]}>
              <View style={[globalStyles.containerCenter, {width: 50, height: 50, backgroundColor: '#00000008', borderRadius: 5}]}>
                <Icon name="wode_qianbao_fenxiang" size={24} color="#333" />
              </View>
              <View style={{flex: 1, marginLeft: globalStyleVariables.MODULE_SPACE_BIGGER}}>
                <Text style={globalStyles.fontPrimary}>把商品分享给更多人购买，订单交易成功后可以获取佣金哦。</Text>
              </View>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <View style={[globalStyles.containerRow]}>
              <View style={[globalStyles.containerCenter, {width: 50, height: 50, backgroundColor: '#00000008', borderRadius: 5}]}>
                <Icon name="wode_qianbao_tuiguangma" size={24} color="#333" />
              </View>
              <View style={{flex: 1, marginLeft: globalStyleVariables.MODULE_SPACE_BIGGER}}>
                <Text style={globalStyles.fontPrimary}>通过组队码组建自己的团队，当团队成员成功分享商品，你也可以躺赚佣金。</Text>
              </View>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <View style={[globalStyles.containerRow]}>
              <View style={[globalStyles.containerCenter, {width: 50, height: 50, backgroundColor: '#00000008', borderRadius: 5}]}>
                <Icon name="wode_qianbao_chuchuang" size={24} color="#333" />
              </View>
              <View style={{flex: 1, marginLeft: globalStyleVariables.MODULE_SPACE_BIGGER}}>
                <Text style={globalStyles.fontPrimary}>把商品添加到橱窗，并拍摄相关视频。可以获得带货佣金。</Text>
              </View>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <View style={[globalStyles.containerRow]}>
              <View style={[globalStyles.containerCenter, {width: 50, height: 50, backgroundColor: '#00000008', borderRadius: 5}]}>
                <Icon name="wode_qianbao_shipin" size={24} color="#333" />
              </View>
              <View style={{flex: 1, marginLeft: globalStyleVariables.MODULE_SPACE_BIGGER}}>
                <Text style={globalStyles.fontPrimary}>拍摄高质量的视频并链接商品，获取更多曝光机会，赚取更多佣金。</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default WalletSummaryAgent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#33635A',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
