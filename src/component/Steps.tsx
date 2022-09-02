import React, {useCallback, useEffect, useMemo, useState} from 'react';
import debounce from 'lodash/debounce';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, LayoutChangeEvent} from 'react-native';
import {globalStyleVariables} from '../constants/styles';
import {StylePropText, StylePropView} from '../models';
import {useRefCallback} from '../fst/hooks';

export interface StepState {
  active: boolean;
  key: string;
}

interface ItemLayout {
  value: number;
  initialized: boolean;
}

type RenderTitle = (state: StepState) => React.ReactNode;

export interface Step {
  title: string | RenderTitle;
  style?: StylePropText;
  key: string;
}

interface StepsProps {
  style?: StylePropView;
  steps: Step[];
  defaultActiveKey?: string;
  currentKey?: string;
  onBeforeChangeKey?: (currentKey: string, targetKey: string) => boolean;
  onChange?: (key: string) => void;
}

const Steps: React.FC<StepsProps> = props => {
  const {steps, defaultActiveKey, currentKey, onChange, onBeforeChangeKey} = props;
  const [activeKey, setActiveKey] = useState(defaultActiveKey || steps[0]?.key || '');
  const [layouts, setLayouts] = useState<{[key: string]: ItemLayout}>(() => {
    const layouts: {[key: string]: ItemLayout} = {};
    steps.forEach(step => {
      layouts[step.key] = {
        value: 0,
        initialized: false,
      };
    });
    return layouts;
  });
  const [scrollLeft, setScrollLeft] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [closeAutoScroll, setCloseAutoScroll] = useState(false);

  const [ref, setRef, isReady] = useRefCallback<ScrollView>();

  useEffect(() => {
    if (currentKey) {
      setActiveKey(currentKey);
    }
  }, [currentKey]);

  useEffect(() => {
    if (!activeKey) {
      return;
    }
    // activeKey 改变的时候，自动滚动到对应的位置
    setCloseAutoScroll(false);
  }, [activeKey]);

  const getIndex = useCallback(
    (key: string) => {
      return steps.findIndex(item => item.key === key);
    },
    [steps],
  );

  const _scrollTo = useCallback(
    (left: number) => {
      if (isReady) {
        ref.current?.scrollTo({
          x: left,
          y: 0,
          animated: true,
        });
      }
    },
    [isReady, ref],
  );
  const scrollTo = useMemo(() => debounce(_scrollTo, 200), [_scrollTo]);

  useEffect(() => {
    if (closeAutoScroll) {
      return;
    }
    if (containerWidth <= 0) {
      return;
    }
    const index = getIndex(activeKey);
    let totalWidth = 0;
    for (let i = 0; i < index; i++) {
      const layout = layouts[steps[i].key];
      if (!layout.initialized) {
        return;
      }
      totalWidth += layout?.value || 0;
    }
    const offset = 15; // 容器的paddingLeft
    const selfWidth = layouts[activeKey]?.value || 0;
    const isRightOverflow = totalWidth + selfWidth - scrollLeft > containerWidth;
    const isLeftOverflow = totalWidth - scrollLeft < 0;
    if (isLeftOverflow) {
      scrollTo(totalWidth + offset);
    } else if (isRightOverflow) {
      scrollTo(totalWidth + selfWidth - containerWidth + offset);
    }
  }, [activeKey, layouts, getIndex, scrollLeft, containerWidth, scrollTo, steps, closeAutoScroll]);

  const handleChangeKey = (key: string) => {
    if (key !== activeKey) {
      const shouldChange = onBeforeChangeKey(activeKey, key);
      if (!shouldChange) {
        return;
      }
      setCloseAutoScroll(false);
      setActiveKey(key);
      onChange && onChange(key);
    }
  };
  function handleViewLoad(e: LayoutChangeEvent, step: Step) {
    const width = e.nativeEvent.layout.width;
    setLayouts({
      ...layouts,
      [step.key]: {
        value: width,
        initialized: true,
      },
    });
  }

  const _handleScroll = useCallback((offsetLeft: number) => {
    setCloseAutoScroll(true);
    setScrollLeft(offsetLeft);
  }, []);

  const handleScroll = useMemo(() => debounce(_handleScroll, 200), [_handleScroll]);

  function renderDefaultTitle(step: Step, index: number) {
    const title = step.title as string;
    const isActive = activeKey === step.key;
    return (
      <>
        <View style={[styles.defaultIndex, isActive ? styles.activeDefaultIndex : {}]}>
          <Text style={[styles.indexText, isActive ? styles.activeIndexText : {}]}>{index + 1}</Text>
        </View>
        <Text style={[styles.defaultTabText, isActive ? styles.activeDefaultTabText : {}]}>{title}</Text>
      </>
    );
  }
  return (
    <View style={[styles.container, props.style]} onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
      <ScrollView horizontal style={{flex: 1}} ref={setRef} scrollEventThrottle={16} onScroll={e => handleScroll(e.nativeEvent.contentOffset.x)}>
        <View style={styles.scrollContent}>
          {props.steps.map((step, index) => {
            const isStringTitle = typeof step.title === 'string';
            let renderTitle;
            let defaultTitle;
            if (!isStringTitle) {
              renderTitle = step.title as RenderTitle;
            } else {
              defaultTitle = renderDefaultTitle(step, index);
            }

            return (
              <TouchableOpacity key={step.key} activeOpacity={0.7} onPress={() => handleChangeKey(step.key)}>
                <View style={styles.tabWrapper} onLayout={e => handleViewLoad(e, step)}>
                  {isStringTitle
                    ? defaultTitle
                    : renderTitle({
                        key: step.key,
                        active: activeKey === step.key,
                      })}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};
Steps.defaultProps = {
  onBeforeChangeKey: () => true,
};

export default Steps;

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
    height: 64,
  },
  scrollContent: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  tabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  defaultTabText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.5,
  },
  activeDefaultTabText: {
    opacity: 1,
  },
  defaultIndex: {
    width: 24,
    height: 24,
    opacity: 0.5,
    backgroundColor: '#ffffff33',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  activeDefaultIndex: {
    backgroundColor: '#fff',
    opacity: 1,
  },
  indexText: {
    color: '#fff',
    fontSize: 15,
    opacity: 0.5,
  },
  activeIndexText: {
    color: globalStyleVariables.COLOR_PRIMARY,
    opacity: 1,
  },
});
