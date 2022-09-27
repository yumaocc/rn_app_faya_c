import {PayOrder} from '../../models';
import {ActionsUnion, ActionWithPayload, createAction, Action} from '../types';
import {ActionType} from './types';

export const Actions = {
  reset: (): Action<ActionType.RESET> => createAction(ActionType.RESET),
  setPayOrder: (order: PayOrder): ActionWithPayload<ActionType.SET_PAY_ORDER, PayOrder> => createAction(ActionType.SET_PAY_ORDER, order),
};

export type OrderActions = ActionsUnion<typeof Actions>;
