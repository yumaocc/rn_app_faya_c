import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@ant-design/react-native';

import Home from '../home/Home';

import Mine from '../mine/Mine';
import Discover from '../discover/Discover';

import {primary} from '../../constants/theme';

const Tab = createBottomTabNavigator();

interface TabItemProps {
  focused: boolean;
  color: string;
  size: number;
}

const tabOptions = {
  activeColor: primary,
  items: [
    {
      name: 'Home',
      label: '首页',
      renderIcon: ({color, size}: TabItemProps) => <Icon name="home" color={color} size={size} />,
      component: Home,
    },
    {
      name: 'Discover',
      label: '发现',
      renderIcon: ({color, size}: TabItemProps) => <Icon name="shop" color={color} size={size} />,
      component: Discover,
    },
    {
      name: 'Mine',
      label: '我的',
      renderIcon: ({color, size}: TabItemProps) => <Icon name="user" color={color} size={size} />,
      component: Mine,
    },
  ],
};

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: tabOptions.activeColor,
      }}>
      {tabOptions.items.map(tabItem => {
        return (
          <Tab.Screen
            key={tabItem.name}
            name={tabItem.name}
            component={tabItem.component}
            options={{
              headerShown: false,
              tabBarLabel: tabItem.label,
              tabBarIcon: tabItem.renderIcon,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};
export default TabNavigator;
