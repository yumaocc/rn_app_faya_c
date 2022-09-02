import {Action, ActionsUnion, ActionWithPayload, createAction} from '../types';
import {ActionType} from './types';
import {UserInfo} from '../../models';

export const Actions = {
  init: (): Action<ActionType.INIT> => createAction(ActionType.INIT),
  initSuccess: (phone: string): ActionWithPayload<ActionType.INIT_SUCCESS, string> => createAction(ActionType.INIT_SUCCESS, phone),
  setUserInfo: (userInfo?: UserInfo): ActionWithPayload<ActionType.SET_USER_INFO, UserInfo> => createAction(ActionType.SET_USER_INFO, userInfo),
  logout: (): Action<ActionType.LOGOUT> => createAction(ActionType.LOGOUT),
};

export type UserActions = ActionsUnion<typeof Actions>;
