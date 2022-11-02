import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, TouchableWithoutFeedback, Animated, View} from 'react-native';
import {globalStyleVariables} from '../../../constants/styles';

interface SwitchProps {
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}

const Switch: React.FC<SwitchProps> = props => {
  const {onChange, disabled} = props;
  const [checked, setChecked] = React.useState(props.checked);
  const indicatorPosition = useRef(new Animated.Value(1)).current;
  const scaleBg = useRef(new Animated.Value(1)).current;
  const width = useMemo(() => 50, []);
  const height = useMemo(() => 30, []);
  const circleSize = useMemo(() => 24, []);

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
        Animated.spring(indicatorPosition, {toValue: 3, useNativeDriver: false}).start();
        Animated.timing(scaleBg, {toValue: 1, duration: 300, useNativeDriver: false}).start();
      } else {
        Animated.spring(indicatorPosition, {toValue: 1 * (width - circleSize - 3), useNativeDriver: false}).start();
        Animated.timing(scaleBg, {toValue: 0.0, duration: 300, useNativeDriver: false}).start();
      }
      setChecked(value);
    },
    [indicatorPosition, scaleBg, width, circleSize],
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
      width: circleSize, // 指示器留一点边框显示背景
      height: circleSize,
      borderRadius: circleSize,
      top: (height - circleSize) / 2,
    },
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.container, !checked && styles.containerFalse, propStyle.container]}>
        <Animated.View style={[styles.scaleBg, {transform: [{scale: scaleBg}], ...propStyle.scaleBg}]} />
        <Animated.View style={[styles.toggleBtn, {left: indicatorPosition, ...propStyle.indicator}]} />
      </View>
    </TouchableWithoutFeedback>
  );
};
Switch.defaultProps = {
  disabled: false,
};
export default Switch;
const styles = StyleSheet.create({
  container: {
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
  },
  containerFalse: {
    backgroundColor: '#ccc',
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
