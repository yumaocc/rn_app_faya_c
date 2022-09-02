import React from 'react';
import {View, StyleSheet} from 'react-native';
import {globalStyleVariables} from '../../constants/styles';

type IconName = 'delete';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = props => {
  const {size, color} = props;
  return (
    <View style={[styles.container, {height: size, width: size}]}>
      <View style={{backgroundColor: color}} />
    </View>
  );
};
Icon.defaultProps = {
  size: 15,
  color: globalStyleVariables.TEXT_COLOR_SECONDARY,
};
export default Icon;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
});
