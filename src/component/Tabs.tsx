import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {noop} from '../constants';
import {globalStyleVariables} from '../constants/styles';
import {StylePropView} from '../models';

interface TabItem {
  title: string;
  key: string;
}

interface TabsProps {
  onChange?: (key: string) => void;
  defaultActiveKey?: string;
  currentKey?: string;
  tabs: TabItem[];
  style?: StylePropView;
  showIndicator?: boolean;
}

const Tabs: React.FC<TabsProps> = props => {
  const {onChange, defaultActiveKey, tabs, currentKey} = props;

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
    <View style={[styles.container, props.style]}>
      {tabs.map(tab => {
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity key={tab.key} activeOpacity={0.7} onPress={() => changeTab(tab.key)} style={{flex: 1}}>
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.tabText, activeKey === tab.key ? styles.activeTabText : {}]}>{tab.title}</Text>
              {/* 指示器 */}
              {props.showIndicator && <View style={[{backgroundColor: isActive ? globalStyleVariables.COLOR_PRIMARY : 'transparent'}, styles.indictor]} />}
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
  },
});
