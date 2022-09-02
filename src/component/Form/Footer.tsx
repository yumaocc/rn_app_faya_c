import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {globalStyles} from '../../constants/styles';
import {StylePropView} from '../../models';

interface FooterProps {
  style?: StylePropView;
}

const Footer: React.FC<FooterProps> = props => {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={globalStyles.fontTertiary}>已经到底了</Text>
    </View>
  );
};
export default Footer;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
});
