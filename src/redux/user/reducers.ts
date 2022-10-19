import produce from 'immer';
import {UserActions} from './actions';
// import { ActionType } from './types';
import {ActionType} from './types';
import {BankCardF, CouponF, GoLoginParams, MineDetail, MyWorkTabType, UserInfo, WalletInfo, WalletSummary, WorkList} from '../../models';

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
  myWorks: {
    [MyWorkTabType.Work]: WorkList;
    [MyWorkTabType.Private]: WorkList;
    [MyWorkTabType.Like]: WorkList;
    [MyWorkTabType.Collect]: WorkList;
  };
  myTabs: {title: string; value: MyWorkTabType}[]; // 个人中心的tab
  currentTabType: MyWorkTabType;
}

export const initialState: UserState = {
  phone: '',
  isLogout: false,
  couponList: [],
  bankCards: [],
  myTabs: [
    {
      title: '作品',
      value: MyWorkTabType.Work,
    },
    {
      title: '私密',
      value: MyWorkTabType.Private,
    },
    {
      title: '喜欢',
      value: MyWorkTabType.Like,
    },
    {
      title: '收藏',
      value: MyWorkTabType.Collect,
    },
  ],
  myDetail: {
    account: '',
    nickName: '游客',
    age: '',
    avatar: '',
    backgroudPic: '',
    level: null,
    say: '什么都没有',
    nums: {
      fansNums: 0,
      followNums: 0,
      likeNums: 0,
    },
  },
  myWorks: {
    [MyWorkTabType.Work]: {
      list: [],
      index: 0,
      status: 'none',
    },
    [MyWorkTabType.Private]: {
      list: [],
      index: 0,
      status: 'none',
    },
    [MyWorkTabType.Like]: {
      list: [],
      index: 0,
      status: 'none',
    },
    [MyWorkTabType.Collect]: {
      list: [],
      index: 0,
      status: 'none',
    },
  },
  currentTabType: MyWorkTabType.Work,
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
    case ActionType.CHANGE_MY_TAB:
      return produce(state, draft => {
        draft.currentTabType = action.payload;
      });
    case ActionType.LOAD_MY_WORK:
      return produce(state, draft => {
        const {tabType, replace} = action.payload;
        const work = state.myWorks[tabType];
        if (replace || work.status !== 'noMore') {
          draft.myWorks[tabType].status = 'loading';
        }
      });
    case ActionType.LOAD_MY_WORK_FAIL:
      return produce(state, draft => {
        draft.myWorks[action.payload].status = 'noMore';
      });
    case ActionType.LOAD_MY_WORK_SUCCESS:
      return produce(state, draft => {
        draft.myWorks[action.payload.tabType] = action.payload.works;
      });
    case ActionType.RESET:
      return initialState;
    default:
      return state;
  }
};
