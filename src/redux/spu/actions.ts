import {SPUDetailF} from '../../models';
import {ActionsUnion, ActionWithPayload, createAction} from '../types';
import {ActionType} from './types';

export const Actions = {
  setCurrentSPU: (spu: SPUDetailF): ActionWithPayload<ActionType.SET_CURRENT_SPU, SPUDetailF> => createAction(ActionType.SET_CURRENT_SPU, spu),
  // setCurrentSKU: (sku: SPUDetailF): ActionWithPayload<ActionType.SET_CURRENT_SKU, SPUDetailF> => createAction(ActionType.SET_CURRENT_SKU, sku),
};

export type SPUActions = ActionsUnion<typeof Actions>;
