import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from '../../component/Icon';

import Home from '../home/Home';

import Mine from '../mine/Mine';
import Discover from '../discover/Discover';
import OrderList from '../mine/OrderList';
// import Notify from '../notify/Notify';

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
        tabBarItemStyle: {
          height: 50,
          paddingBottom: 5,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: '首页',
          tabBarIcon: ({color, focused}: TabItemProps) => {
            return focused ? <Icon name="home_home_sel64" color={color} size={32} /> : <Icon name="home_home_nor64" color={color} size={32} />;
          },
        }}
      />
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          headerShown: false,
          tabBarLabel: '发现',
          tabBarIcon: ({color, focused}: TabItemProps) =>
            focused ? <Icon name="home_faxian_sel64" color={color} size={32} /> : <Icon name="home_faxian_nor64" color={color} size={32} />,
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
        name="OrderList"
        component={OrderList}
        options={{
          headerShown: false,
          tabBarLabel: '订单',
          tabBarIcon: ({color, focused}: TabItemProps) =>
            focused ? <Icon name="home_xiaoxi_sel64" color={color} size={32} /> : <Icon name="home_xiaoxi_nor64" color={color} size={32} />,
        }}
      />
      <Tab.Screen
        name="Mine"
        component={Mine}
        options={{
          headerShown: false,
          tabBarLabel: '我的',
          tabBarIcon: ({color, focused}: TabItemProps) =>
            focused ? <Icon name="home_wode_sel64" color={color} size={32} /> : <Icon name="home_wode_nor64" color={color} size={32} />,
        }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
