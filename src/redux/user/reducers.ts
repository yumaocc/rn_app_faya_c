import produce from 'immer';
import {UserActions} from './actions';
// import { ActionType } from './types';
import {ActionType} from './types';
import {CouponF, UserInfo, WalletInfo} from '../../models';

export interface UserState {
  phone: string;
  isLogout: boolean;
  userInfo?: UserInfo;
  walletInfo?: WalletInfo;
  couponList?: CouponF[];
}

export const initialState: UserState = {
  phone: '',
  isLogout: false,
  couponList: [],
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
        const {payload} = action;
        draft.userInfo = payload;
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
    default:
      return state;
  }
};
