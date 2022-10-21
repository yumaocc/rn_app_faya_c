export enum ActionType {
  RESET = 'USER/RESET',
  LOGIN = 'USER/LOGIN',
  LOGIN_SUCCESS = 'USER/LOGIN_SUCCESS',
  LOGOUT = 'USER/LOGOUT',
  CLEAR_LOGIN_INFO = 'USER/CLEAR_LOGIN_INFO',
  SET_USER_INFO = 'USER/SET_USER_INFO',
  GET_WALLET_INFO = 'USER/GET_WALLET_INFO',
  GET_WALLET_INFO_SUCCESS = 'USER/GET_WALLET_INFO_SUCCESS',
  GET_WALLET_SUMMARY = 'USER/GET_WALLET_SUMMARY',
  GET_WALLET_SUMMARY_SUCCESS = 'USER/GET_WALLET_SUMMARY_SUCCESS',
  GET_COUPON_LIST = 'USER/GET_COUPON_LIST',
  GET_COUPON_LIST_SUCCESS = 'USER/GET_COUPON_LIST_SUCCESS',
  GET_MINE_DETAIL = 'USER/GET_MINE_DETAIL',
  GET_MINE_DETAIL_SUCCESS = 'USER/GET_MINE_DETAIL_SUCCESS',
  LOAD_BANK_CARDS = 'USER/LOAD_BANK_CARDS',
  LOAD_BANK_CARDS_SUCCESS = 'USER/LOAD_BANK_CARDS_SUCCESS',
  LOAD_MY_WORK = 'USER/LOAD_MY_WORK',
  LOAD_MY_WORK_SUCCESS = 'USER/LOAD_MY_WORK_SUCCESS',
  LOAD_MY_WORK_FAIL = 'USER/LOAD_MY_WORK_FAIL',
  CHANGE_MY_TAB = 'USER/CHANGE_MY_TAB',
  INIT_OTHER_USER = 'USER/INIT_OTHER_USER', // 初始化其他用户的个人中心
  DESTROY_OTHER_USER = 'USER/DESTROY_OTHER_USER', // 销毁其他用户的个人中心
  CHANGE_OTHER_TAB = 'USER/CHANGE_OTHER_TAB',
  LOAD_OTHER_WORK = 'USER/LOAD_OTHER_WORK',
  LOAD_OTHER_WORK_SUCCESS = 'USER/LOAD_OTHER_WORK_SUCCESS',
  LOAD_OTHER_WORK_FAIL = 'USER/LOAD_OTHER_WORK_FAIL',
}
