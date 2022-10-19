import {Action, ActionsUnion, ActionWithPayload, createAction} from '../types';
import {ActionType} from './types';
import {BankCardF, CouponF, GoLoginParams, MineDetail, MyWorkTabType, UserInfo, WalletInfo, WalletSummary, WorkList} from '../../models';

export const Actions = {
  init: (): Action<ActionType.INIT> => createAction(ActionType.INIT),
  reset: (): Action<ActionType.RESET> => createAction(ActionType.RESET),
  initSuccess: (phone: string): ActionWithPayload<ActionType.INIT_SUCCESS, string> => createAction(ActionType.INIT_SUCCESS, phone),
  setUserInfo: (userInfo?: UserInfo): ActionWithPayload<ActionType.SET_USER_INFO, UserInfo> => createAction(ActionType.SET_USER_INFO, userInfo),
  logout: (): Action<ActionType.LOGOUT> => createAction(ActionType.LOGOUT),
  getWalletInfo: (): Action<ActionType.GET_WALLET_INFO> => createAction(ActionType.GET_WALLET_INFO),
  getWalletInfoSuccess: (walletInfo: WalletInfo): ActionWithPayload<ActionType.GET_WALLET_INFO_SUCCESS, WalletInfo> => createAction(ActionType.GET_WALLET_INFO_SUCCESS, walletInfo),
  getCouponList: (): Action<ActionType.GET_COUPON_LIST> => createAction(ActionType.GET_COUPON_LIST),
  getCouponListSuccess: (couponList: CouponF[]): ActionWithPayload<ActionType.GET_COUPON_LIST_SUCCESS, CouponF[]> => createAction(ActionType.GET_COUPON_LIST_SUCCESS, couponList),
  getMyDetail: (): Action<ActionType.GET_MINE_DETAIL> => createAction(ActionType.GET_MINE_DETAIL),
  getMyDetailSuccess: (detail: MineDetail): ActionWithPayload<ActionType.GET_MINE_DETAIL_SUCCESS, MineDetail> => createAction(ActionType.GET_MINE_DETAIL_SUCCESS, detail),
  getWalletSummary: (): Action<ActionType.GET_WALLET_SUMMARY> => createAction(ActionType.GET_WALLET_SUMMARY),
  getWalletSummarySuccess: (summary: WalletSummary): ActionWithPayload<ActionType.GET_WALLET_SUMMARY_SUCCESS, WalletSummary> =>
    createAction(ActionType.GET_WALLET_SUMMARY_SUCCESS, summary),
  login: (payload: GoLoginParams): ActionWithPayload<ActionType.LOGIN, GoLoginParams> => createAction(ActionType.LOGIN, payload),
  loginSuccess: (token: string): ActionWithPayload<ActionType.LOGIN_SUCCESS, string> => createAction(ActionType.LOGIN_SUCCESS, token),
  clearLoginInfo: (): Action<ActionType.CLEAR_LOGIN_INFO> => createAction(ActionType.CLEAR_LOGIN_INFO),
  loadBankCards: (): Action<ActionType.LOAD_BANK_CARDS> => createAction(ActionType.LOAD_BANK_CARDS),
  loadBankCardsSuccess: (bankCards: BankCardF[]): ActionWithPayload<ActionType.LOAD_BANK_CARDS_SUCCESS, BankCardF[]> => createAction(ActionType.LOAD_BANK_CARDS_SUCCESS, bankCards),
  loadMyWork: (tabType: MyWorkTabType, replace?: boolean): ActionWithPayload<ActionType.LOAD_MY_WORK, {tabType: MyWorkTabType; replace?: boolean}> =>
    createAction(ActionType.LOAD_MY_WORK, {tabType, replace}),
  loadMyWorkSuccess: (tabType: MyWorkTabType, works: WorkList): ActionWithPayload<ActionType.LOAD_MY_WORK_SUCCESS, {tabType: MyWorkTabType; works: WorkList}> =>
    createAction(ActionType.LOAD_MY_WORK_SUCCESS, {tabType, works}),
  loadMyWorkFail: (tabType: MyWorkTabType): ActionWithPayload<ActionType.LOAD_MY_WORK_FAIL, MyWorkTabType> => createAction(ActionType.LOAD_MY_WORK_FAIL, tabType),
  changeMyTab: (tabType: MyWorkTabType): ActionWithPayload<ActionType.CHANGE_MY_TAB, MyWorkTabType> => createAction(ActionType.CHANGE_MY_TAB, tabType),
};

export type UserActions = ActionsUnion<typeof Actions>;
