import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle} from 'react-native';
import {noop} from '../constants';
import {globalStyleVariables} from '../constants/styles';
import {StylePropView} from '../models';

interface TabItem {
  title: string;
  key: string;
}

export type TabsStyles = {
  [key in keyof typeof styles]: ViewStyle | TextStyle;
};
interface TabsProps {
  onChange?: (key: string) => void;
  defaultActiveKey?: string;
  currentKey?: string;
  tabs: TabItem[];
  style?: StylePropView;
  showIndicator?: boolean;
  gap?: number;
  styles?: Partial<TabsStyles>;
}

const Tabs: React.FC<TabsProps> = props => {
  const {onChange, defaultActiveKey, tabs, currentKey, styles: mergedStyles} = props;

  const [activeKey, setActiveKey] = useState(defaultActiveKey || tabs[0]?.key || '');

  useEffect(() => {
    if (currentKey) {
      setActiveKey(currentKey);
    }
  }, [currentKey]);

  const changeTab = (key: string) => {
    if (key !== activeKey) {
      setActiveKey(key);
      onChange && onChange(key);
    }
  };

  return (
    <View style={[styles.container, mergedStyles.container, props.style]}>
      {tabs.map((tab, index) => {
        const gap = index === 0 ? 0 : props.gap;
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity key={tab.key} activeOpacity={0.7} onPress={() => changeTab(tab.key)} style={[{marginLeft: gap}, styles.tabContainer, mergedStyles.tabContainer]}>
            <View style={[styles.tab, mergedStyles.tab]}>
              <Text style={[styles.tabText, mergedStyles.tabText, isActive && styles.activeTabText, isActive && mergedStyles.activeTabText]}>{tab.title}</Text>
              {/* 指示器 */}
              {props.showIndicator && <View style={[styles.indictor, mergedStyles.indictor, isActive && styles.indictorActive, isActive && mergedStyles.indictorActive]} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
Tabs.defaultProps = {
  onChange: noop,
  defaultActiveKey: '',
  currentKey: '',
  showIndicator: false,
  styles: {},
  gap: 0,
};
export default Tabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // backgroundColor: '#6cf',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 40,
  },
  tabContainer: {
    alignItems: 'center',
  },
  tab: {},
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  activeTabText: {
    color: globalStyleVariables.COLOR_PRIMARY,
  },
  indictor: {
    width: '100%',
    height: 2,
    marginTop: globalStyleVariables.MODULE_SPACE_SMALLER,
    backgroundColor: 'transparent',
  },
  indictorActive: {
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
  },
});
