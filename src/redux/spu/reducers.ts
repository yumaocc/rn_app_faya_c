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
}

export const initialState: SPUState = {
  currentSKUIsPackage: false,
  spuListForWork: {
    list: [],
    index: 0,
    status: 'none',
  },
  showCaseSPUList: {
    list: [],
    index: 0,
    status: 'none',
  },
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
        if (action.payload || state.showCaseSPUList.status !== 'noMore') {
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
    case ActionType.RESET:
      return initialState;
    default:
      return state;
  }
};
