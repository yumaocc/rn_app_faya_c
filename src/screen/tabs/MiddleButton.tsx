import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {globalStyleVariables} from '../../constants/styles';
import {useIsLoggedIn, useUserDispatcher} from '../../helper/hooks';
import {FakeNavigation} from '../../models';
import Icon from '../../component/Icon';

const MiddleButton: React.FC = () => {
  const navigation = useNavigation<FakeNavigation>();
  const isLoggedIn = useIsLoggedIn();
  const [userDispatcher] = useUserDispatcher();

  function handleClick() {
    if (!isLoggedIn) {
      userDispatcher.login({
        to: 'ShootVideo',
        redirect: true,
      });
    } else {
      navigation.navigate('ShootVideo');
      // navigation.navigate('Scanner');
      // navigation.navigate('SingleWorkDetail', {id: '1575447541069455360'});
      // navigation.navigate('ScanResult', {content: '你好'});
      // navigation.navigate('Invite', {userId: '1574958869138587643'});
      // navigation.navigate('Publish');
      // navigation.navigate('TestPage');
      // navigation.navigate('SearchSPU');
      // navigation.navigate('WithdrawalRecords');
      // navigation.navigate('WalletSummaryAgent');
      // navigation.navigate('Profile');
      // navigation.navigate('PaySuccess');
      // navigation.navigate('MyShowcase');
      // navigation.navigate('Certification');
      // navigation.navigate('AddBankCard');
      // navigation.navigate('MyCode');
      // navigation.navigate('PublishVideo');
      // navigation.navigate('WaitPay');
      // navigation.navigate('SPUDetail', {id: 62});
      // navigation.navigate('User', {id: 2});
      // navigation.navigate('OrderDetail', {id: '1580101446588235776'});
      // navigation.navigate('OrderBooking', {id: '1580135056015572993'});
    }
  }
  return (
    <View style={[styles.container]}>
      <TouchableOpacity onPress={handleClick} style={[styles.round]} activeOpacity={0.9}>
        <Icon name="all_add" color="#fff" size={20} />
      </TouchableOpacity>
    </View>
  );
};
// MiddleButton.defaultProps = {
//   title: 'MiddleButton',
// };
export default MiddleButton;
const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'relative',
    top: -10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  round: {
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
    flex: 1,
    width: '100%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
