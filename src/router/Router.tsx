import React from 'react';
import {createNavigationContainerRef} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import {RootState} from '../redux/reducers';
import {Stack, commonScreenOptions} from './config';

import WorkDetail from '../screen/home/WorkDetail';
import TabNavigator from '../screen/tabs/TabNavigator';
import Login from '../screen/common/Login';

import SPUDetail from '../screen/spu/SPUDetail';

// import RouterSPU from './RouterSPU';
// import RouterMerchant from './RouterMerchant';

const Navigator: React.FC = () => {
  const token = useSelector((state: RootState) => state.common.token);
  const isLogout = useSelector((state: RootState) => state.user.isLogout);
  return (
    <Stack.Navigator>
      {token ? (
        <></>
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
      <Stack.Screen name="Tab" component={TabNavigator} options={commonScreenOptions} />
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
