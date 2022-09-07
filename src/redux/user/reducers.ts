import produce from 'immer';
import {UserActions} from './actions';
// import { ActionType } from './types';
import {ActionType} from './types';
import {CouponF, MineDetail, UserInfo, WalletInfo} from '../../models';

export interface UserState {
  phone: string;
  isLogout: boolean;
  userInfo?: UserInfo;
  walletInfo?: WalletInfo;
  couponList?: CouponF[];
  myDetail?: MineDetail;
}

export const initialState: UserState = {
  phone: '',
  isLogout: false,
  couponList: [],
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
    case ActionType.GET_MINE_DETAIL_SUCCESS:
      return produce(state, draft => {
        draft.myDetail = action.payload;
      });
    default:
      return state;
  }
};
