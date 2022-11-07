import React from 'react';
import {createNavigationContainerRef, StackActions} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import {RootState} from '../redux/reducers';
import {Stack, commonScreenOptions} from './config';

// import WorkDetail from '../screen/home/WorkDetail';
import TabNavigator from '../screen/tabs/TabNavigator';
import Login from '../screen/common/Login';

import SPUDetail from '../screen/spu/SPUDetail';
import Order from '../screen/spu/Order';
// import OrderList from '../screen/mine/OrderList';
import OrderDetail from '../screen/mine/OrderDetail';
import Wallet from '../screen/mine/wallet/Wallet';
import WalletSummary from '../screen/mine/wallet/WalletSummary';
import WalletSummaryAgent from '../screen/mine/wallet/WalletSummaryAgent';
import Withdrawal from '../screen/mine/wallet/Withdrawal';
import MyCode from '../screen/mine/MyCode';
import ShootVideo from '../screen/home/ShootVideo';
import Publish from '../screen/home/Publish';
import SelectSPU from '../screen/home/SelectSPU';
import PublishPhoto from '../screen/home/PublishPhoto';
import PublishVideo from '../screen/home/PublishVideo';
import PaySuccess from '../screen/spu/PaySuccess';
import WaitPay from '../screen/mine/WaitPay';
import Browser from '../screen/common/Browser';
import TestPage from '../screen/common/TestPage'; // 测试页面
import User from '../screen/mine/User';
import WorkDetailList from '../screen/home/WorkDetailList';
import Refund from '../screen/mine/Refund';
import OrderComment from '../screen/mine/OrderComment';
import CouponList from '../screen/mine/wallet/CouponList';
import Certification from '../screen/mine/wallet/Certification';
import Settings from '../screen/mine/wallet/Settings';
import BankCards from '../screen/mine/wallet/BankCards';
import AddBankCard from '../screen/mine/wallet/AddBankCard';
import OrderBooking from '../screen/mine/order/OrderBooking';
import WithdrawalRecords from '../screen/mine/wallet/WithdrawalRecords';
import Profile from '../screen/mine/agent/Profile';
import UserSettings from '../screen/mine/settings/Settings';
import MyWorkDetailList from '../screen/mine/work/WorkDetailList';
import WorkDetailListOther from '../screen/mine/work/WorkDetailListOther';
import MyShowcase from '../screen/mine/spu/Showcase';
import OtherShowcase from '../screen/mine/spu/OtherShowcase';
import SearchSPU from '../screen/discover/SearchSPU';
import Scanner from '../screen/common/Scanner';
import ScanResult from '../screen/common/ScanResult';
import SingleWorkDetail from '../screen/home/work/SingleWorkDetail';
import CommentReport from '../screen/common/CommentReport';

import {RootStackParamList, ValidRoute} from '../models';
import {useIsLoggedIn} from '../helper/hooks';
import MyProfile from '../screen/mine/settings/MyProfile';
import Invite from '../screen/mine/agent/Invite';
import About from '../screen/common/About';

const Navigator: React.FC = () => {
  const isLoggedIn = useIsLoggedIn();
  // const token = useSelector((state: RootState) => state.common.config.token);
  const isLogout = useSelector((state: RootState) => state.user.isLogout);
  // 注意路由顺序
  return (
    <Stack.Navigator initialRouteName="Tab">
      <Stack.Screen name="Tab" component={TabNavigator} options={commonScreenOptions} />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          animationTypeForReplace: isLogout ? 'pop' : 'push',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="SPUDetail" component={SPUDetail} options={commonScreenOptions} />
      <Stack.Screen name="SearchSPU" component={SearchSPU} options={{...commonScreenOptions, animation: 'fade'}} />
      {/* <Stack.Screen name="WorkDetail" component={WorkDetail} options={commonScreenOptions} /> */}
      <Stack.Screen name="Browser" component={Browser} options={commonScreenOptions} />
      <Stack.Screen name="TestPage" component={TestPage} options={commonScreenOptions} />
      <Stack.Screen name="User" component={User} options={commonScreenOptions} />
      <Stack.Screen name="WorkDetailList" component={WorkDetailList} options={commonScreenOptions} />
      <Stack.Screen name="Scanner" component={Scanner} options={commonScreenOptions} />
      <Stack.Screen name="ScanResult" component={ScanResult} options={commonScreenOptions} />
      <Stack.Screen name="SingleWorkDetail" component={SingleWorkDetail} options={commonScreenOptions} />
      <Stack.Screen name="Invite" component={Invite} options={commonScreenOptions} />
      <Stack.Screen name="CommentReport" component={CommentReport} options={commonScreenOptions} />
      <Stack.Screen name="About" component={About} options={commonScreenOptions} />
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Order" component={Order} options={commonScreenOptions} />
          {/* <Stack.Screen name="OrderList" component={OrderList} options={commonScreenOptions} /> */}
          <Stack.Screen name="OrderDetail" component={OrderDetail} options={commonScreenOptions} />
          <Stack.Screen name="Wallet" component={Wallet} options={commonScreenOptions} />
          <Stack.Screen name="WalletSummary" component={WalletSummary} options={commonScreenOptions} />
          <Stack.Screen name="WalletSummaryAgent" component={WalletSummaryAgent} options={commonScreenOptions} />
          <Stack.Screen name="Withdrawal" component={Withdrawal} options={commonScreenOptions} />
          <Stack.Screen name="MyCode" component={MyCode} options={commonScreenOptions} />
          <Stack.Screen name="ShootVideo" component={ShootVideo} options={commonScreenOptions} />
          <Stack.Screen name="Publish" component={Publish} options={commonScreenOptions} />
          <Stack.Screen name="SelectSPU" component={SelectSPU} options={commonScreenOptions} />
          <Stack.Screen name="PublishPhoto" component={PublishPhoto} options={commonScreenOptions} />
          <Stack.Screen name="PublishVideo" component={PublishVideo} options={{...commonScreenOptions, gestureEnabled: false}} />
          <Stack.Screen name="PaySuccess" component={PaySuccess} options={commonScreenOptions} />
          <Stack.Screen name="WaitPay" component={WaitPay} options={commonScreenOptions} />
          <Stack.Screen name="Refund" component={Refund} options={commonScreenOptions} />
          <Stack.Screen name="OrderComment" component={OrderComment} options={commonScreenOptions} />
          <Stack.Screen name="CouponList" component={CouponList} options={commonScreenOptions} />
          <Stack.Screen name="Certification" component={Certification} options={commonScreenOptions} />
          <Stack.Screen name="WalletSettings" component={Settings} options={commonScreenOptions} />
          <Stack.Screen name="BankCards" component={BankCards} options={commonScreenOptions} />
          <Stack.Screen name="AddBankCard" component={AddBankCard} options={commonScreenOptions} />
          <Stack.Screen name="OrderBooking" component={OrderBooking} options={commonScreenOptions} />
          <Stack.Screen name="WithdrawalRecords" component={WithdrawalRecords} options={commonScreenOptions} />
          <Stack.Screen name="Profile" component={Profile} options={commonScreenOptions} />
          <Stack.Screen name="Settings" component={UserSettings} options={commonScreenOptions} />
          <Stack.Screen name="MyWorkDetail" component={MyWorkDetailList} options={commonScreenOptions} />
          <Stack.Screen name="UserWorkDetail" component={WorkDetailListOther} options={commonScreenOptions} />
          <Stack.Screen name="MyShowcase" component={MyShowcase} options={commonScreenOptions} />
          <Stack.Screen name="OtherShowcase" component={OtherShowcase} options={commonScreenOptions} />
          <Stack.Screen name="MyProfile" component={MyProfile} options={commonScreenOptions} />
        </>
      ) : (
        <></>
      )}
    </Stack.Navigator>
  );
};
export default Navigator;

export const navigationRef = createNavigationContainerRef();

// 编程式导航
export function goLogin() {
  if (navigationRef.isReady()) {
    const routes = navigationRef.getState()?.routes;
    if (routes?.length) {
      const last = routes[routes.length - 1];
      if (last.name === 'Login') {
        return; // 已经是登录页了
      }
    }
    navigateTo('Login', null, false);
  }
}

export function relaunch() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.popToTop());
  }
}

export function relaunchTo(url: ValidRoute, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.popToTop());
    navigationRef.dispatch(StackActions.push(url, params));
  }
}

export function navigateTo(url: keyof RootStackParamList, params?: any, redirect = false) {
  if (navigationRef.isReady()) {
    if (redirect) {
      navigationRef.dispatch(StackActions.replace(url, params));
    } else {
      navigationRef.dispatch(StackActions.push(url, params));
    }
  }
}

export function navigateBack() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.pop());
  }
}
