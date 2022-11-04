import React, {ReactNode} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, TextStyle, ViewStyle} from 'react-native';
import {globalStyles, globalStyleVariables} from '../constants/styles';
import {StylePropView} from '../models';
import Icon from './Icon';

export type OperateItemStyles = {
  [key in keyof typeof styles]: ViewStyle | TextStyle;
};
interface OperateItemProps {
  label?: string | ReactNode;
  children?: ReactNode;
  showArrow?: boolean;
  canPress?: boolean;
  style?: StylePropView;
  styles?: Partial<OperateItemStyles>;
  onPress?: () => void;
}

const OperateItem: React.FC<OperateItemProps> = props => {
  const {label, children, showArrow, canPress, styles: propStyles, onPress} = props;

  function renderLabel() {
    if (typeof label === 'string') {
      return <Text style={[globalStyles.fontSecondary, styles.label, propStyles.label]}>{label}</Text>;
    }
  }
  function handlePress() {
    if (canPress && onPress) {
      onPress();
    }
  }
  return (
    <TouchableHighlight underlayColor="#999" onPress={handlePress} style={[styles.container, propStyles.container, props.style]}>
      <View style={[globalStyles.containerRow, styles.item, propStyles.item]}>
        {renderLabel()}
        <View style={[styles.children, propStyles.children]}>{children}</View>
        {showArrow && <Icon name="all_arrowR36" size={18} color={globalStyleVariables.TEXT_COLOR_SECONDARY} />}
      </View>
    </TouchableHighlight>
  );
};
OperateItem.defaultProps = {
  canPress: true,
  styles: {},
  showArrow: false,
  label: '请设置操作名称',
  onPress: () => {},
};
export default OperateItem;

const styles = StyleSheet.create({
  container: {
    height: 60,
  },
  item: {
    flex: 1,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
  },
  children: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {},
});
