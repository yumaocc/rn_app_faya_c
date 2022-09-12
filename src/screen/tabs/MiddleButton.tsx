import {Icon} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {globalStyleVariables} from '../../constants/styles';
import {FakeNavigation} from '../../models';

const MiddleButton: React.FC = () => {
  const navigation = useNavigation<FakeNavigation>();

  function handleClick() {
    navigation.navigate('Publish');
  }
  return (
    <TouchableOpacity onPress={handleClick} style={styles.container} activeOpacity={0.9}>
      <Icon name="plus" color="#fff" size={20} />
    </TouchableOpacity>
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
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
    position: 'relative',
    top: -10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
