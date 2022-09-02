import {WorkTab} from '../../models';
import {ActionsUnion, ActionWithPayload, createAction} from '../types';
import {ActionType} from './types';

export const Actions = {
  changeTab: (tab: WorkTab): ActionWithPayload<ActionType.CHANGE_TAB, WorkTab> => createAction(ActionType.CHANGE_TAB, tab),
};

export type WorkActions = ActionsUnion<typeof Actions>;
