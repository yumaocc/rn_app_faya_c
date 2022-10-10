import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated, TextStyle} from 'react-native';
import {globalStyleVariables} from '../constants/styles';
import {useInfinityRotate} from '../helper/hooks';
import {StylePropText, StylePropView} from '../models';
import {Icon} from '@ant-design/react-native';

interface ButtonProps {
  title: string;
  style?: StylePropView;
  disabled?: boolean;
  ghost?: boolean;
  textStyle?: StylePropText;
  loading?: boolean;
  containerStyle?: StylePropView;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = props => {
  const {title, disabled, ghost} = props;

  const containerStyle: StylePropView[] = [styles.container];
  let textStyle: TextStyle = styles.text;
  const rotate = useInfinityRotate();
  if (ghost) {
    containerStyle.push(styles.ghostContainer);
    textStyle = Object.assign(textStyle, styles.ghostText);
    // textStyle.push(styles.ghostText);
  }
  containerStyle.push(props.style);
  // textStyle.push(props.textStyle);
  textStyle = Object.assign(textStyle, props.textStyle);

  if (disabled) {
    containerStyle.push({opacity: 0.5});
    return (
      <View style={[containerStyle, props.containerStyle]}>
        <Text style={textStyle}>{title}</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={props.onPress} style={props.containerStyle}>
      <View style={containerStyle}>
        {props.loading && (
          <Animated.View
            style={[
              {
                transform: [{rotate: rotate.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']})}],
                width: 15,
                height: 15,
                marginRight: globalStyleVariables.MODULE_SPACE,
              },
            ]}>
            <Icon name="loading-3-quarters" color={textStyle.color as string} size={15} />
          </Animated.View>
        )}
        <Text style={textStyle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
Button.defaultProps = {
  onPress: () => {},
  disabled: false,
  ghost: false,
  loading: false,
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
    flexDirection: 'row',
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
