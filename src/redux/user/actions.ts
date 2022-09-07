import {Action, ActionsUnion, ActionWithPayload, createAction} from '../types';
import {ActionType} from './types';
import {CouponF, UserInfo, WalletInfo} from '../../models';

export const Actions = {
  init: (): Action<ActionType.INIT> => createAction(ActionType.INIT),
  initSuccess: (phone: string): ActionWithPayload<ActionType.INIT_SUCCESS, string> => createAction(ActionType.INIT_SUCCESS, phone),
  setUserInfo: (userInfo?: UserInfo): ActionWithPayload<ActionType.SET_USER_INFO, UserInfo> => createAction(ActionType.SET_USER_INFO, userInfo),
  logout: (): Action<ActionType.LOGOUT> => createAction(ActionType.LOGOUT),
  getWalletInfo: (): Action<ActionType.GET_WALLET_INFO> => createAction(ActionType.GET_WALLET_INFO),
  getWalletInfoSuccess: (walletInfo: WalletInfo): ActionWithPayload<ActionType.GET_WALLET_INFO_SUCCESS, WalletInfo> => createAction(ActionType.GET_WALLET_INFO_SUCCESS, walletInfo),
  getCouponList: (): Action<ActionType.GET_COUPON_LIST> => createAction(ActionType.GET_COUPON_LIST),
  getCouponListSuccess: (couponList: CouponF[]): ActionWithPayload<ActionType.GET_COUPON_LIST_SUCCESS, CouponF[]> => createAction(ActionType.GET_COUPON_LIST_SUCCESS, couponList),
};

export type UserActions = ActionsUnion<typeof Actions>;
