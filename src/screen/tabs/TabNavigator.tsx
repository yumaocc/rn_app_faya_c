import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from '../../component/Icon';

import Home from '../home/Home';

import Mine from '../mine/Mine';
import Discover from '../discover/Discover';
import Notify from '../notify/Notify';

import MiddleButton from './MiddleButton';
import {globalStyleVariables} from '../../constants/styles';

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
          tabBarLabelStyle: {
            paddingBottom: 5,
          },
          tabBarLabel: '首页',
          tabBarIcon: ({color, size, focused}: TabItemProps) =>
            focused ? <Icon name="home_home_sel64" color={color} size={size} /> : <Icon name="home_home_nor64" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          headerShown: false,
          tabBarLabelStyle: {
            paddingBottom: 5,
          },
          tabBarLabel: '发现',
          tabBarIcon: ({color, size, focused}: TabItemProps) =>
            focused ? <Icon name="home_faxian_sel64" color={color} size={size} /> : <Icon name="home_faxian_nor64" color={color} size={size} />,
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
          tabBarLabelStyle: {
            paddingBottom: 5,
          },
          tabBarLabel: '通知',
          tabBarIcon: ({color, size, focused}: TabItemProps) =>
            focused ? <Icon name="home_xiaoxi_sel64" color={color} size={size} /> : <Icon name="home_xiaoxi_nor64" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Mine"
        component={Mine}
        options={{
          headerShown: false,
          tabBarLabelStyle: {
            paddingBottom: 5,
          },
          tabBarLabel: '我的',
          tabBarIcon: ({color, size, focused}: TabItemProps) =>
            focused ? <Icon name="home_wode_sel64" color={color} size={size} /> : <Icon name="home_wode_nor64" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
