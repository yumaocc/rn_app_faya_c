import {Dispatch} from 'redux';
import {GoLoginParams, MyWorkTabType, UserInfo, UserWorkTabType} from '../../models';
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
  loadBankCards(): void;
  loadMyWork: (tabType: MyWorkTabType, replace?: boolean) => void;
  changeMyTab: (tabType: MyWorkTabType) => void;
  initOtherUser: (userId: number) => void;
  destroyOtherUser: (userId: number) => void;
  loadOtherUserWork: (tabType: UserWorkTabType, userId: number, replace?: boolean) => void;
  changeOtherUserTab: (tabType: UserWorkTabType, userId: number) => void;
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
  loadBankCards: () => dispatch(Actions.loadBankCards()),
  loadMyWork: (tabType: MyWorkTabType, replace?: boolean) => dispatch(Actions.loadMyWork(tabType, replace)),
  changeMyTab: (tabType: MyWorkTabType) => dispatch(Actions.changeMyTab(tabType)),
  initOtherUser: (userId: number) => dispatch(Actions.initOtherUser(userId)),
  destroyOtherUser: (userId: number) => dispatch(Actions.destroyOtherUser(userId)),
  loadOtherUserWork: (tabType: UserWorkTabType, userId: number, replace?: boolean) => dispatch(Actions.loadOtherWork(tabType, userId, replace)),
  changeOtherUserTab: (tabType: UserWorkTabType, userId: number) => dispatch(Actions.changeOtherTab(tabType, userId)),
});
