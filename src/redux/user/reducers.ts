import produce from 'immer';
import {UserActions} from './actions';
// import { ActionType } from './types';
import {ActionType} from './types';
import {BankCardF, CouponF, GoLoginParams, MineDetail, UserInfo, WalletInfo, WalletSummary} from '../../models';

export interface UserState {
  phone: string;
  isLogout: boolean;
  userInfo?: UserInfo;
  walletInfo?: WalletInfo;
  walletSummary?: WalletSummary;
  couponList?: CouponF[];
  myDetail?: MineDetail;
  login?: GoLoginParams;
  bankCards?: BankCardF[];
}

export const initialState: UserState = {
  phone: '',
  isLogout: false,
  couponList: [],
  bankCards: [],
  myDetail: {
    account: '',
    nickName: '游客',
    age: '',
    avatar: '',
    backgroudPic: '',
    level: '',
    say: '什么都没有',
    nums: {
      fansNums: 0,
      followNums: 0,
      likeNums: 0,
    },
  },
};

export default (state = initialState, action: UserActions): UserState => {
  const {type} = action;

  switch (type) {
    case ActionType.INIT_SUCCESS:
      return produce(state, draft => {
        draft.phone = action.payload;
      });
    case ActionType.SET_USER_INFO:
      return produce(state, draft => {
        draft.userInfo = action.payload;
      });
    case ActionType.LOGIN:
      return produce(state, draft => {
        draft.login = action.payload;
      });
    case ActionType.CLEAR_LOGIN_INFO:
      return produce(state, draft => {
        draft.login = undefined;
      });
    case ActionType.LOGOUT:
      return produce(state, draft => {
        draft.userInfo = undefined;
        draft.isLogout = true;
      });
    case ActionType.GET_WALLET_INFO_SUCCESS:
      return produce(state, draft => {
        draft.walletInfo = action.payload;
      });
    case ActionType.GET_COUPON_LIST_SUCCESS:
      return produce(state, draft => {
        draft.couponList = action.payload;
      });
    case ActionType.GET_MINE_DETAIL_SUCCESS:
      return produce(state, draft => {
        draft.myDetail = action.payload;
      });
    case ActionType.GET_WALLET_SUMMARY_SUCCESS:
      return produce(state, draft => {
        draft.walletSummary = action.payload;
      });
    case ActionType.LOAD_BANK_CARDS_SUCCESS:
      return produce(state, draft => {
        draft.bankCards = action.payload;
      });
    case ActionType.RESET:
      return initialState;
    default:
      return state;
  }
};
