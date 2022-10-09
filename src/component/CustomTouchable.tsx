/**
 * 此组件是为了处理在scrollView（FlatList）中点击失效的问题,如果不是在scrollView或FlatList中使用，可以直接使用rn的Touchable**
 */
import React from 'react';
import {View, PanResponder, GestureResponderEvent, PanResponderGestureState} from 'react-native';
import {StylePropView} from '../models';

interface CustomTouchableProps {
  children: React.ReactNode;
  activeOpacity?: number;
  style?: StylePropView;
  onPress?: () => void;
}

function isClick(dx: number, dy: number) {
  return Math.abs(dx) < 10 && Math.abs(dy) < 10;
}

const CustomTouchable: React.FC<CustomTouchableProps> = props => {
  const [opacity, setOpacity] = React.useState(1);
  const _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setOpacity(props.activeOpacity);
    },
    onPanResponderRelease: (evt: GestureResponderEvent, state: PanResponderGestureState) => {
      const {dx, dy} = state;
      if (isClick(dx, dy)) {
        props.onPress && props.onPress();
      }
      setOpacity(1);
    },
    onPanResponderTerminationRequest: (_, state: PanResponderGestureState) => {
      const {dx, dy} = state;
      return !isClick(dx, dy);
    },
    onPanResponderTerminate: () => {
      setOpacity(1);
    },
  });
  return (
    <View style={[props.style, {opacity}]} {..._panResponder.panHandlers}>
      {props.children}
    </View>
  );
};

export default CustomTouchable;

CustomTouchable.defaultProps = {
  activeOpacity: 0.8,
};

// const styles = StyleSheet.create({

// });
