/**
 * @deprecated
 * 有问题，最后用的indexedSectionList
 */
import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent, PanResponder, PanResponderGestureState} from 'react-native';
import {globalStyles} from '../../constants/styles';
import {StylePropView} from '../../models';
import {LocationSection} from './util';

interface IndexBarProps {
  sections: LocationSection[];
  style?: StylePropView;
  onSelectIndex?: (section: LocationSection, index: number) => void;
}

function isClick(dx: number, dy: number) {
  return Math.abs(dx) < 10 && Math.abs(dy) < 10;
}

const IndexBar: React.FC<IndexBarProps> = props => {
  const {sections} = props;
  const itemHeight = useMemo(() => 20, []);

  function handleSelectIndex(section: LocationSection, index: number) {
    props.onSelectIndex && props.onSelectIndex(section, index);
  }

  const _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      console.log('grant');
      // setOpacity(props.activeOpacity);
    },
    onPanResponderMove(e, gestureState) {
      console.log('move');
      // console.log(e, gestureState);
    },
    onPanResponderRelease: (evt: GestureResponderEvent, state: PanResponderGestureState) => {
      const {dx, dy} = state;
      if (isClick(dx, dy)) {
        console.log('isClick');
        console.log(state);
        console.log(evt);
        //   props.onPress && props.onPress();
      }
      // setOpacity(1);
      console.log('release');
    },
    onPanResponderTerminationRequest: (_, state: PanResponderGestureState) => {
      console.log('terminationRequest');
      return false;
      // const {dx, dy} = state;
      // if (isLongPress(dx, dy, timeRef.current)) {
      //   props.onLongPress && props.onLongPress();
      //   return true;
      // }
      // return !isClick(dx, dy);
    },
    onPanResponderTerminate: () => {
      console.log('terminate');
      // setOpacity(1);
    },
    onMoveShouldSetPanResponderCapture: () => {
      console.log('onMoveShouldSetPanResponderCapture');
      return true;
    },
  });

  return (
    <View style={[styles.container, props.style]}>
      <View style={[styles.wrapper]} {..._panResponder.panHandlers}>
        {sections.map((section, index) => {
          return (
            <TouchableOpacity key={index} onPressIn={() => handleSelectIndex(section, index)}>
              <View key={index} style={[styles.indexItem, globalStyles.containerCenter, {height: itemHeight}]}>
                <Text style={[globalStyles.fontPrimary]}>{section.title}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default IndexBar;
IndexBar.defaultProps = {
  sections: [],
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6cf',
  },
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f00',
  },
  indexItem: {
    width: 36,
    backgroundColor: '#fff',
  },
});
