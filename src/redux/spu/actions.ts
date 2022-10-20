import {SearchForm} from '../../fst/models';
import {LoadListState, PackageDetail, SKUDetail, SPUDetailF, SPUF} from '../../models';
import {ActionsUnion, ActionWithPayload, createAction, Action} from '../types';
import {ActionType} from './types';

export const Actions = {
  reset: (): Action<ActionType.RESET> => createAction(ActionType.RESET),
  viewSPU: (id: number): ActionWithPayload<ActionType.VIEW_SPU, number> => createAction(ActionType.VIEW_SPU, id),
  closeViewSPU: (): Action<ActionType.CLOSE_VIEW_SPU> => createAction(ActionType.CLOSE_VIEW_SPU),
  setCurrentSPU: (spu: SPUDetailF): ActionWithPayload<ActionType.SET_CURRENT_SPU, SPUDetailF> => createAction(ActionType.SET_CURRENT_SPU, spu),
  setCurrentSKU: (sku: PackageDetail | SKUDetail, isPackage: boolean): ActionWithPayload<ActionType.SET_CURRENT_SKU, {isPackage: boolean; sku: PackageDetail | SKUDetail}> =>
    createAction(ActionType.SET_CURRENT_SKU, {isPackage, sku}),
  loadSearchSPUForWork: (name: string, replace?: boolean): ActionWithPayload<ActionType.LOAD_SEARCH_SPU_FOR_WORK, {name: string; replace?: boolean}> =>
    createAction(ActionType.LOAD_SEARCH_SPU_FOR_WORK, {name, replace}),
  loadSearchSPUForWorkSuccess: (list: LoadListState<SPUF>): ActionWithPayload<ActionType.LOAD_SEARCH_SPU_FOR_WORK_SUCCESS, LoadListState<SPUF>> =>
    createAction(ActionType.LOAD_SEARCH_SPU_FOR_WORK_SUCCESS, list),
  loadSearchSPUForWorkFail: (): Action<ActionType.LOAD_SEARCH_SPU_FOR_WORK_FAIL> => createAction(ActionType.LOAD_SEARCH_SPU_FOR_WORK_FAIL),
  loadShowCaseSPU: (search: SearchForm, replace?: boolean): ActionWithPayload<ActionType.LOAD_SHOW_CASE_SPU, {search: SearchForm; replace?: boolean}> =>
    createAction(ActionType.LOAD_SHOW_CASE_SPU, {search, replace}),
  loadShowCaseSPUSuccess: (list: LoadListState<SPUF>): ActionWithPayload<ActionType.LOAD_SHOW_CASE_SPU_SUCCESS, LoadListState<SPUF>> =>
    createAction(ActionType.LOAD_SHOW_CASE_SPU_SUCCESS, list),
  loadShowCaseSPUFail: (): Action<ActionType.LOAD_SHOW_CASE_SPU_FAIL> => createAction(ActionType.LOAD_SHOW_CASE_SPU_FAIL),
};

export type SPUActions = ActionsUnion<typeof Actions>;
