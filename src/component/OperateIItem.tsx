import React, {ReactNode} from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {globalStyles, globalStyleVariables} from '../constants/styles';
import {StylePropView} from '../models';
import Icon from './Icon';

interface OperateItemProps {
  label?: string | ReactNode;
  children?: ReactNode;
  showArrow?: boolean;
  canPress?: boolean;
  style?: StylePropView;
  onPress?: () => void;
}

const OperateItem: React.FC<OperateItemProps> = props => {
  const {label, children, showArrow, canPress, onPress} = props;

  function renderLabel() {
    if (typeof label === 'string') {
      return <Text style={[globalStyles.fontSecondary]}>{label}</Text>;
    }
  }
  function handlePress() {
    if (canPress && onPress) {
      onPress();
    }
  }
  return (
    <TouchableHighlight underlayColor="#999" onPress={handlePress} style={[styles.container, props.style]}>
      <View style={[globalStyles.containerRow, styles.item]}>
        {renderLabel()}
        <View style={styles.children}>{children}</View>
        {showArrow && <Icon name="all_arrowR36" size={18} color={globalStyleVariables.TEXT_COLOR_SECONDARY} />}
      </View>
    </TouchableHighlight>
  );
};
OperateItem.defaultProps = {
  canPress: true,
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
});
