import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {globalStyleVariables} from '../constants/styles';
import {StylePropText, StylePropView} from '../models';

interface ButtonProps {
  title: string;
  style?: StylePropView;
  disabled?: boolean;
  ghost?: boolean;
  textStyle?: StylePropText;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = props => {
  const {title, disabled, ghost} = props;

  const containerStyle: StylePropView[] = [styles.container];
  const textStyle: StylePropText[] = [styles.text];
  if (ghost) {
    containerStyle.push(styles.ghostContainer);
    textStyle.push(styles.ghostText);
  }
  containerStyle.push(props.style);
  textStyle.push(props.textStyle);

  if (disabled) {
    containerStyle.push({opacity: 0.5});
    return (
      <View style={containerStyle}>
        <Text style={textStyle}>{title}</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={props.onPress}>
      <View style={containerStyle}>
        <Text style={textStyle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
Button.defaultProps = {
  onPress: () => {},
  disabled: false,
  ghost: false,
};
export default Button;
const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: globalStyleVariables.COLOR_PRIMARY,
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
    borderRadius: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: globalStyleVariables.COLOR_PRIMARY,
  },
});
