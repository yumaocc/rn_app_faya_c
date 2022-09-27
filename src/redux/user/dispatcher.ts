import {Dispatch} from 'redux';
import {GoLoginParams, UserInfo} from '../../models';
import {Actions} from './actions';

export interface UserDispatcher {
  logout(): void;
  login(payload: GoLoginParams): void;
  loginSuccess(token: string): void;
  clearLoginInfo(): void;
  setUserInfo(userInfo?: UserInfo): void;
  getWalletInfo(): void;
  getCouponList(): void;
  getMyDetail(): void;
  getWalletSummary(): void;
}

export const getUserDispatcher = (dispatch: Dispatch): UserDispatcher => ({
  logout: () => dispatch(Actions.logout()),
  login: (payload: GoLoginParams) => dispatch(Actions.login(payload)),
  loginSuccess: (token: string) => dispatch(Actions.loginSuccess(token)),
  clearLoginInfo: () => dispatch(Actions.clearLoginInfo()),
  setUserInfo: (userInfo?: UserInfo) => dispatch(Actions.setUserInfo(userInfo)),
  getWalletInfo: () => dispatch(Actions.getWalletInfo()),
  getCouponList: () => dispatch(Actions.getCouponList()),
  getMyDetail: () => dispatch(Actions.getMyDetail()),
  getWalletSummary: () => dispatch(Actions.getWalletSummary()),
});
