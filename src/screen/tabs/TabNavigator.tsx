import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@ant-design/react-native';

import Home from '../home/Home';

import Mine from '../mine/Mine';
import Discover from '../discover/Discover';
import Notify from '../notify/Notify';

import MiddleButton from './MiddleButton';
import {globalStyleVariables} from '../../constants/styles';
// import {View} from 'react-native';

const Tab = createBottomTabNavigator();

interface TabItemProps {
  focused: boolean;
  color: string;
  size: number;
}

const NilComponent: React.FC = () => null;

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: globalStyleVariables.COLOR_PRIMARY,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: '首页',
          tabBarIcon: ({color, size}: TabItemProps) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          headerShown: false,
          tabBarLabel: '发现',
          tabBarIcon: ({color, size}: TabItemProps) => <Icon name="shop" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="_"
        component={NilComponent}
        options={{
          tabBarButton: () => <MiddleButton />,
        }}
      />
      <Tab.Screen
        name="Notify"
        component={Notify}
        options={{
          headerShown: false,
          tabBarLabel: '通知',
          tabBarIcon: ({color, size}: TabItemProps) => <Icon name="bell" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Mine"
        component={Mine}
        options={{
          headerShown: false,
          tabBarLabel: '我的',
          tabBarIcon: ({color, size}: TabItemProps) => <Icon name="user" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
