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
        behavior: 'push',
        skipBehavior: 'back',
        completeBehavior: 'replace',
      });
    } else {
      if (!__DEV__) {
        navigation.navigate('ShootVideo');
        return;
      }
      navigation.navigate('ShootVideo');
      // navigation.navigate('IncomeOrderList');
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
