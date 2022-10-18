import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {globalStyleVariables} from '../../../constants/styles';
import {StylePropText, StylePropView} from '../../../models';
import Icon from '../../Icon';

type RadioStyles = {
  [key in keyof typeof styles]?: StylePropView | StylePropText;
};

interface RadioProps {
  checked?: boolean;
  style?: StylePropView;
  styles?: RadioStyles;
  children?: React.ReactNode;
  iconSize?: number;
  fontSize?: number; // 字体大小尽量使用props传入，不要在styles中设置，因为会计算行高来保持图标和文字垂直居中
  color?: string;
  onChange?: (e: boolean) => void;
}

const Radio: React.FC<RadioProps> = props => {
  const {iconSize, fontSize, color} = props;
  const [checked, setChecked] = React.useState(props.checked || false);

  useEffect(() => {
    setChecked(props.checked || false);
  }, [props.checked]);

  function handleClick() {
    setChecked(!checked);
    props.onChange && props.onChange(!checked);
  }

  return (
    <TouchableOpacity activeOpacity={0.8} style={[styles.container, props.styles.container, props.style]} onPress={handleClick}>
      <View
        style={[
          {width: iconSize, height: iconSize, borderRadius: iconSize},
          styles.iconWrapper,
          props.styles.iconWrapper,
          checked && [{backgroundColor: color}, styles.iconWrapperChecked, props.styles.iconWrapperChecked],
        ]}>
        <Icon name="all_checkbox36" size={iconSize} color="#fff" />
      </View>
      <Text style={[{fontSize, lineHeight: iconSize}, styles.label, props.styles.label]}>{props.children}</Text>
    </TouchableOpacity>
  );
};

export default Radio;
Radio.defaultProps = {
  style: {},
  styles: {},
  iconSize: 18,
  fontSize: 12,
  checked: false,
  color: globalStyleVariables.COLOR_PRIMARY,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    backgroundColor: '#fff',
    marginRight: globalStyleVariables.MODULE_SPACE_SMALLER,
    borderWidth: 1.5,
    borderColor: '#DEDEDE',
  },
  iconWrapperChecked: {
    borderWidth: 0,
  },
  label: {
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
});
