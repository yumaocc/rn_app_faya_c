import {Dispatch} from 'redux';
import {UserInfo} from '../../models';
import {Actions} from './actions';

export interface UserDispatcher {
  logout(): void;
  setUserInfo(userInfo?: UserInfo): void;
  getWalletInfo(): void;
  getCouponList(): void;
  getMyDetail(): void;
  getWalletSummary(): void;
}

export const getUserDispatcher = (dispatch: Dispatch): UserDispatcher => ({
  logout: () => dispatch(Actions.logout()),
  setUserInfo: (userInfo?: UserInfo) => dispatch(Actions.setUserInfo(userInfo)),
  getWalletInfo: () => dispatch(Actions.getWalletInfo()),
  getCouponList: () => dispatch(Actions.getCouponList()),
  getMyDetail: () => dispatch(Actions.getMyDetail()),
  getWalletSummary: () => dispatch(Actions.getWalletSummary()),
});
