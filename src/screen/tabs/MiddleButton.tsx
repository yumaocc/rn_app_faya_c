import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {globalStyleVariables} from '../../constants/styles';
import {useUserDispatcher} from '../../helper/hooks';
import {FakeNavigation} from '../../models';
import {RootState} from '../../redux/reducers';
import Icon from '../../component/Icon';

const MiddleButton: React.FC = () => {
  const navigation = useNavigation<FakeNavigation>();
  const token = useSelector((state: RootState) => state.common.token);
  const [userDispatcher] = useUserDispatcher();

  function handleClick() {
    if (!token) {
      userDispatcher.login({
        to: 'ShootVideo',
        redirect: true,
      });
    } else {
      // navigation.navigate('ShootVideo');
      // navigation.navigate('TestPage');
      // navigation.navigate('WalletSummaryAgent');
      // navigation.navigate('Profile');
      // navigation.navigate('PaySuccess');
      navigation.navigate('MyShowcase');
      // navigation.navigate('Certification');
      // navigation.navigate('AddBankCard');
      // navigation.navigate('Publish');
      // navigation.navigate('PublishVideo');
      // navigation.navigate('WaitPay');
      // navigation.navigate('SPUDetail', {id: 62});
      // navigation.navigate('User', {id: 3});
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
