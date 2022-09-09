import React from 'react';
import {createNavigationContainerRef} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import {RootState} from '../redux/reducers';
import {Stack, commonScreenOptions} from './config';

import WorkDetail from '../screen/home/WorkDetail';
import TabNavigator from '../screen/tabs/TabNavigator';
import Login from '../screen/common/Login';

import SPUDetail from '../screen/spu/SPUDetail';
import Order from '../screen/spu/Order';
import OrderList from '../screen/mine/OrderList';
import OrderDetail from '../screen/mine/OrderDetail';
import Wallet from '../screen/mine/Wallet';
import WalletSummary from '../screen/mine/WalletSummary';
import WalletSummaryAgent from '../screen/mine/WalletSummaryAgent';
import Withdrawal from '../screen/mine/Withdrawal';
import MyCode from '../screen/mine/MyCode';
import ShootVideo from '../screen/home/ShootVideo';

const Navigator: React.FC = () => {
  const token = useSelector((state: RootState) => state.common.token);
  const isLogout = useSelector((state: RootState) => state.user.isLogout);
  // 注意路由顺序
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tab" component={TabNavigator} options={commonScreenOptions} />
      {token ? (
        <>
          <Stack.Screen name="Order" component={Order} options={commonScreenOptions} />
          <Stack.Screen name="OrderList" component={OrderList} options={commonScreenOptions} />
          <Stack.Screen name="OrderDetail" component={OrderDetail} options={commonScreenOptions} />
          <Stack.Screen name="Wallet" component={Wallet} options={commonScreenOptions} />
          <Stack.Screen name="WalletSummary" component={WalletSummary} options={commonScreenOptions} />
          <Stack.Screen name="WalletSummaryAgent" component={WalletSummaryAgent} options={commonScreenOptions} />
          <Stack.Screen name="Withdrawal" component={Withdrawal} options={commonScreenOptions} />
          <Stack.Screen name="MyCode" component={MyCode} options={commonScreenOptions} />
          <Stack.Screen name="ShootVideo" component={ShootVideo} options={commonScreenOptions} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
              animationTypeForReplace: isLogout ? 'pop' : 'push',
            }}
          />
        </>
      )}
      <Stack.Screen name="WorkDetail" component={WorkDetail} options={commonScreenOptions} />
      <Stack.Screen name="SPUDetail" component={SPUDetail} options={commonScreenOptions} />
    </Stack.Navigator>
  );
};
export default Navigator;

export const navigationRef = createNavigationContainerRef();

// 编程式导航
export function navigate<Params = any>(name: string, params?: Params) {
  if (navigationRef.isReady()) {
    navigationRef.current?.navigate(name as unknown as never, params as unknown as never);
  }
}
