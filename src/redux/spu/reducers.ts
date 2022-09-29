import produce from 'immer';
import {PackageDetail, SKUDetail, SPUDetailF} from '../../models';
import {SPUActions} from './actions';
import {ActionType} from './types';

export interface SPUState {
  currentSPU?: SPUDetailF;
  currentSKU?: PackageDetail | SKUDetail;
  currentSKUIsPackage?: boolean;
}

export const initialState: SPUState = {
  currentSKUIsPackage: false,
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
    case ActionType.RESET:
      return initialState;
    default:
      return state;
  }
};
