import isNil from 'lodash/isNil';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useRefCallback} from '../../fst/hooks';
import {StylePropView} from '../../models';
import PickerItem, {PickerItemProps, PICKER_ITEM_HEIGHT} from './PickerItem';

export interface PickerProps {
  value: string | number;
  style?: StylePropView;
  items: PickerItemProps[];
  onChange?: (value: string | number) => void;
}

const Picker: React.FC<PickerProps> & {
  Item: React.FC<PickerItemProps>;
} = props => {
  const [ref, setRef, isReady] = useRefCallback<ScrollView>();
  const {value, onChange} = props;
  const [currentValue, setCurrentValue] = useState(value); // 当前选中的值

  const scrollTo = useCallback(
    (y: number) => {
      if (!isReady) {
        return;
      }
      setTimeout(() => {
        ref.current?.scrollTo({
          x: 0,
          y,
          animated: true,
        });
      }, 0);
    },
    [isReady, ref],
  );

  const currentIndex = useMemo(() => {
    const foundIndex = props.items.findIndex(item => item.value === currentValue);
    return foundIndex === -1 ? 0 : foundIndex;
  }, [currentValue, props.items]);

  // 索引改变时，滚动到对应的位置
  useEffect(() => {
    scrollTo(currentIndex * PICKER_ITEM_HEIGHT);
  }, [currentIndex, scrollTo]);

  // 索引改变时，触发change
  useEffect(() => {
    const findValue = props.items[currentIndex]?.value;
    if (!isNil(findValue) && findValue !== value) {
      onChange && onChange(findValue);
    }
  }, [currentIndex, onChange, props.items, value]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  function handleEndScroll(scrollTop: number) {
    const rest = scrollTop % PICKER_ITEM_HEIGHT;
    const index = Math.floor(scrollTop / PICKER_ITEM_HEIGHT);
    let measureIndex = index + (rest > PICKER_ITEM_HEIGHT / 2 ? 1 : 0);
    measureIndex = Math.min(props.items.length - 1, measureIndex);

    if (measureIndex !== currentIndex) {
      const findValue = props.items[measureIndex]?.value;
      setCurrentValue(findValue);
    } else {
      scrollTo(currentIndex * PICKER_ITEM_HEIGHT);
    }
  }
  return (
    <View style={[styles.container, props.style]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{flex: 1}}
        ref={setRef}
        onScrollEndDrag={e => handleEndScroll(Math.max(0, e.nativeEvent.contentOffset.y))}>
        <View style={styles.fakeItem} />
        {props.items.map(item => (
          <PickerItem key={item.value} label={item.label} value={item.value} />
        ))}
        <View style={styles.fakeItem} />
      </ScrollView>
      <View style={styles.background} pointerEvents="none">
        <View pointerEvents="none" style={styles.maskOther} />
        <View pointerEvents="none" style={styles.maskCurrent} />
        <View pointerEvents="none" style={styles.maskOther} />
      </View>
    </View>
  );
};
// Picker.defaultProps = {
// };
Picker.Item = PickerItem;
export default Picker;

const styles = StyleSheet.create({
  container: {
    height: PICKER_ITEM_HEIGHT * 5,
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeItem: {
    height: PICKER_ITEM_HEIGHT * 2,
  },
  maskCurrent: {
    height: PICKER_ITEM_HEIGHT,
    width: '100%',
    backgroundColor: '#ccc',
    opacity: 0.3,
  },
  maskOther: {
    height: PICKER_ITEM_HEIGHT * 2,
    width: '100%',
    backgroundColor: '#fff',
    opacity: 0.8,
  },
});
