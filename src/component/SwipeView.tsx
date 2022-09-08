import React, {useCallback, useMemo, useRef} from 'react';
import {View, PanResponder, PanResponderGestureState, GestureResponderEvent} from 'react-native';
import {StylePropView} from '../models';

interface SwipeConfig {
  velocityThreshold: number;
  directionalOffsetThreshold: number;
  gestureIsClickThreshold: number;
}

interface SwipeViewProps {
  config?: SwipeConfig;
  style?: StylePropView;
  children?: React.ReactNode;
  onSwipe?: (direction: SwipeDirection, state: PanResponderGestureState) => void;
  onSwipeLeft?: (state: PanResponderGestureState) => void;
  onSwipeRight?: (state: PanResponderGestureState) => void;
  onSwipeUp?: (state: PanResponderGestureState) => void;
  onSwipeDown?: (state: PanResponderGestureState) => void;
}

export enum SwipeDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

function isValidSwipe(velocity: number, velocityThreshold: number, directionalOffset: number, directionalOffsetThreshold: number) {
  return Math.abs(velocity) > velocityThreshold && Math.abs(directionalOffset) < directionalOffsetThreshold;
}

const SwipeView: React.FC<SwipeViewProps> = props => {
  const {config, onSwipe, onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeUp} = props;

  const swipeConfig = useMemo(() => {
    return Object.assign(
      {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
        gestureIsClickThreshold: 10,
      },
      config,
    );
  }, [config]);

  const isValidHorizontalSwipe = useCallback(
    (state: PanResponderGestureState) => {
      const {vx, dy} = state;
      const {velocityThreshold, directionalOffsetThreshold} = swipeConfig;
      return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
    },
    [swipeConfig],
  );

  const isValidVerticalSwipe = useCallback(
    (state: PanResponderGestureState) => {
      const {vy, dx} = state;
      const {velocityThreshold, directionalOffsetThreshold} = swipeConfig;
      return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
    },
    [swipeConfig],
  );

  const getSwipeDirection = useCallback(
    (state: PanResponderGestureState) => {
      const {dx, dy} = state;
      if (isValidHorizontalSwipe(state)) {
        return dx > 0 ? SwipeDirection.RIGHT : SwipeDirection.LEFT;
      } else if (isValidVerticalSwipe(state)) {
        return dy > 0 ? SwipeDirection.DOWN : SwipeDirection.UP;
      }
    },
    [isValidHorizontalSwipe, isValidVerticalSwipe],
  );

  const triggerSwipe = useCallback(
    (direction: SwipeDirection, state: PanResponderGestureState) => {
      onSwipe && onSwipe(direction, state);
      switch (direction) {
        case SwipeDirection.UP:
          onSwipeUp && onSwipeUp(state);
          break;
        case SwipeDirection.DOWN:
          onSwipeDown && onSwipeDown(state);
          break;
        case SwipeDirection.LEFT:
          onSwipeLeft && onSwipeLeft(state);
          break;
        case SwipeDirection.RIGHT:
          onSwipeRight && onSwipeRight(state);
          break;
        default:
          break;
      }
    },
    [onSwipe, onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeUp],
  );

  const gestureIsClick = useCallback(
    (state: PanResponderGestureState) => {
      const {dx, dy} = state;
      const {gestureIsClickThreshold} = swipeConfig;
      return Math.abs(dx) < gestureIsClickThreshold && Math.abs(dy) < gestureIsClickThreshold;
    },
    [swipeConfig],
  );

  const responderEnd = useCallback(
    (_: GestureResponderEvent, state: PanResponderGestureState) => {
      const swipeDirection = getSwipeDirection(state);
      triggerSwipe(swipeDirection, state);
    },
    [getSwipeDirection, triggerSwipe],
  );

  const shouldSetResponder = useCallback(
    (e: GestureResponderEvent, state: PanResponderGestureState) => {
      return e.nativeEvent.touches.length === 1 && !gestureIsClick(state);
    },
    [gestureIsClick],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: shouldSetResponder,
      onMoveShouldSetPanResponder: shouldSetResponder,
      onPanResponderRelease: responderEnd,
      onPanResponderTerminate: responderEnd,
    }),
  ).current;

  return (
    <View style={props.style} {...panResponder.panHandlers}>
      {props.children}
    </View>
  );
};
export default SwipeView;
