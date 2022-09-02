import React, {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, TouchableWithoutFeedback, Animated, View} from 'react-native';
import {globalStyleVariables} from '../../../constants/styles';

interface SwitchProps {
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  width?: number;
  height?: number;
}

const Switch: React.FC<SwitchProps> = props => {
  const {onChange, width, height, disabled} = props;
  const [checked, setChecked] = React.useState(props.checked);
  const indicatorPosition = useRef(new Animated.Value(1)).current;
  const scaleBg = useRef(new Animated.Value(1)).current;

  function handlePress() {
    if (disabled) {
      return;
    }
    const newValue = !checked;
    setCheckedAnimate(newValue);
    onChange && onChange(newValue);
  }

  const setCheckedAnimate = useCallback(
    (value: boolean) => {
      if (!value) {
        Animated.spring(indicatorPosition, {toValue: 1, useNativeDriver: false}).start();
        Animated.timing(scaleBg, {toValue: 1, duration: 300, useNativeDriver: false}).start();
      } else {
        Animated.spring(indicatorPosition, {toValue: 1 * (width - height - 1), useNativeDriver: false}).start();
        Animated.timing(scaleBg, {toValue: 0.0, duration: 300, useNativeDriver: false}).start();
      }
      setChecked(value);
    },
    [height, indicatorPosition, scaleBg, width],
  );

  useEffect(() => {
    setCheckedAnimate(props.checked);
  }, [props.checked, setCheckedAnimate]);

  const propStyle = {
    container: {
      width,
      height,
      borderRadius: height / 2,
      opacity: disabled ? 0.4 : 1,
    },
    scaleBg: {
      borderRadius: height / 2,
    },
    indicator: {
      width: height - 2, // 指示器留一点边框显示背景
      height: height - 2,
      borderRadius: (height - 2) / 2,
      top: 1,
    },
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.container, propStyle.container]}>
        <Animated.View style={[styles.scaleBg, {transform: [{scale: scaleBg}], ...propStyle.scaleBg}]} />
        <Animated.View style={[styles.toggleBtn, {left: indicatorPosition, ...propStyle.indicator}]} />
      </View>
    </TouchableWithoutFeedback>
  );
};
Switch.defaultProps = {
  disabled: false,
  width: 50,
  height: 30,
};
export default Switch;
const styles = StyleSheet.create({
  container: {
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
  },
  scaleBg: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  toggleBtn: {
    backgroundColor: 'white',
    position: 'absolute',
  },
});
