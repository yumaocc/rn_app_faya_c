import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {globalStyles} from '../../constants/styles';
import {StylePropView} from '../../models';
import Icon from '../Icon';

import {icons} from '../Icon/icons';

export type IconName = keyof typeof icons;

interface EmptyProps {
  icon?: IconName;
  text?: string;
  size?: number;
  style?: StylePropView;
}

const Empty: React.FC<EmptyProps> = props => {
  return (
    <View style={[styles.container, props.style]}>
      <View style={[styles.iconWrap, globalStyles.containerCenter]}>
        <Icon name={props.icon} color="#333" size={props.size} />
      </View>
      <View style={{marginTop: 15}}>
        <Text style={globalStyles.fontTertiary}>{props.text}</Text>
      </View>
    </View>
  );
};

export default Empty;
Empty.defaultProps = {
  style: {},
  size: 24,
  icon: 'empty_dingdan',
  text: '空空如也',
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#0000000d',
  },
});
