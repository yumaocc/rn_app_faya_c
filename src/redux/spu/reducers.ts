import produce from 'immer';
import {LoadListState, PackageDetail, SKUDetail, SPUDetailF, SPUF} from '../../models';
import {SPUActions} from './actions';
import {ActionType} from './types';

export interface SPUState {
  currentSPU?: SPUDetailF;
  currentSKU?: PackageDetail | SKUDetail;
  currentSKUIsPackage?: boolean;
  spuListForWork: LoadListState<SPUF>;
  showCaseSPUList: LoadListState<SPUF>;
  spuList: LoadListState<SPUF>;
  userShowcase: {
    [userId: string]: LoadListState<SPUF>;
  };
}

export const initialState: SPUState = {
  currentSKUIsPackage: false,
  spuListForWork: {
    list: [],
    index: 0,
    status: 'none',
  },
  spuList: {
    list: [],
    index: 0,
    status: 'none',
  },
  showCaseSPUList: {
    list: [],
    index: 0,
    status: 'none',
  },
  userShowcase: {},
};

export default (state: SPUState = initialState, action: SPUActions) => {
  switch (action.type) {
    case ActionType.SET_CURRENT_SPU:
      return produce(state, draft => {
        draft.currentSPU = action.payload;
      });
    case ActionType.SET_CURRENT_SKU:
      return produce(state, draft => {
        draft.currentSKU = action.payload.sku;
        draft.currentSKUIsPackage = action.payload.isPackage;
      });
    case ActionType.CLOSE_VIEW_SPU:
      return produce(state, draft => {
        draft.currentSPU = undefined;
        draft.currentSKU = undefined;
        draft.currentSKUIsPackage = false;
      });
    case ActionType.LOAD_SEARCH_SPU_FOR_WORK:
      return produce(state, draft => {
        const {replace} = action.payload;
        if (replace || state.spuListForWork.status !== 'noMore') {
          draft.spuListForWork.status = 'loading';
        }
      });
    case ActionType.LOAD_SEARCH_SPU_FOR_WORK_SUCCESS:
      return produce(state, draft => {
        draft.spuListForWork = action.payload;
      });
    case ActionType.LOAD_SEARCH_SPU_FOR_WORK_FAIL:
      return produce(state, draft => {
        draft.spuListForWork.status = 'noMore';
      });
    case ActionType.LOAD_SHOW_CASE_SPU:
      return produce(state, draft => {
        const {replace} = action.payload;
        if (replace || state.showCaseSPUList.status !== 'noMore') {
          draft.showCaseSPUList.status = 'loading';
        }
      });
    case ActionType.LOAD_SHOW_CASE_SPU_SUCCESS:
      return produce(state, draft => {
        draft.showCaseSPUList = action.payload;
      });
    case ActionType.LOAD_SHOW_CASE_SPU_FAIL:
      return produce(state, draft => {
        draft.showCaseSPUList.status = 'noMore';
      });
    case ActionType.INIT_OTHER_USER_SHOWCASE:
      return produce(state, draft => {
        const userId = action.payload;
        draft.userShowcase[userId] = {
          list: [],
          index: 0,
          status: 'none',
        };
      });
    case ActionType.DESTROY_OTHER_USER_SHOWCASE:
      return produce(state, draft => {
        const userId = action.payload;
        delete draft.userShowcase[userId];
      });
    case ActionType.LOAD_OTHER_USER_SHOWCASE:
      return produce(state, draft => {
        const {userId, replace} = action.payload;
        if (replace || state.userShowcase[userId].status !== 'noMore') {
          draft.userShowcase[userId].status = 'loading';
        }
      });
    case ActionType.LOAD_OTHER_USER_SHOWCASE_SUCCESS:
      return produce(state, draft => {
        const {list, userId} = action.payload;
        draft.userShowcase[userId] = list;
      });
    case ActionType.LOAD_OTHER_USER_SHOWCASE_FAIL:
      return produce(state, draft => {
        const userId = action.payload;
        draft.userShowcase[userId].status = 'noMore';
      });
    case ActionType.LOAD_SPU_LIST:
      return produce(state, draft => {
        const {replace} = action.payload;
        if (replace || draft.spuList.status !== 'noMore') {
          draft.spuList.status = 'loading';
        }
      });
    case ActionType.LOAD_SPU_LIST_SUCCESS:
      return produce(state, draft => {
        draft.spuList = action.payload;
      });
    case ActionType.LOAD_SPU_LIST_FAIL:
      return produce(state, draft => {
        draft.spuList.status = 'noMore';
      });
    case ActionType.RESET:
      return initialState;
    default:
      return state;
  }
};
