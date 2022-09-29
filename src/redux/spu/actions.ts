import {PackageDetail, SKUDetail, SPUDetailF} from '../../models';
import {ActionsUnion, ActionWithPayload, createAction, Action} from '../types';
import {ActionType} from './types';

export const Actions = {
  reset: (): Action<ActionType.RESET> => createAction(ActionType.RESET),
  viewSPU: (id: number): ActionWithPayload<ActionType.VIEW_SPU, number> => createAction(ActionType.VIEW_SPU, id),
  closeViewSPU: (): Action<ActionType.CLOSE_VIEW_SPU> => createAction(ActionType.CLOSE_VIEW_SPU),
  setCurrentSPU: (spu: SPUDetailF): ActionWithPayload<ActionType.SET_CURRENT_SPU, SPUDetailF> => createAction(ActionType.SET_CURRENT_SPU, spu),
  setCurrentSKU: (sku: PackageDetail | SKUDetail, isPackage: boolean): ActionWithPayload<ActionType.SET_CURRENT_SKU, {isPackage: boolean; sku: PackageDetail | SKUDetail}> =>
    createAction(ActionType.SET_CURRENT_SKU, {isPackage, sku}),
};

export type SPUActions = ActionsUnion<typeof Actions>;
