import {Action, ActionsUnion, ActionWithPayload, createAction} from '../types';
import {ActionType} from './types';
import {ErrorType, PreviewConfig} from '../../fst/models';

export const Actions = {
  reset: (): Action<ActionType.RESET> => createAction(ActionType.RESET),
  initApp: (): Action<ActionType.INIT_APP> => createAction(ActionType.INIT_APP),
  initAppSuccess: (): Action<ActionType.INIT_APP_SUCCESS> => createAction(ActionType.INIT_APP_SUCCESS),
  error: (error: ErrorType | string | any): ActionWithPayload<ActionType.ERROR, ErrorType | string> => createAction(ActionType.ERROR, error),
  info: (message: string): ActionWithPayload<ActionType.INFO, string> => createAction(ActionType.INFO, message),
  success: (message: string): ActionWithPayload<ActionType.SUCCESS, string> => createAction(ActionType.SUCCESS, message),
  dismissMessage: (): Action<ActionType.DISMISS_MESSAGE> => createAction(ActionType.DISMISS_MESSAGE),
  previewImages: (config: PreviewConfig): ActionWithPayload<ActionType.PREVIEW_IMAGES, PreviewConfig> => {
    return createAction(ActionType.PREVIEW_IMAGES, config);
  },
  closePreview: (): Action<ActionType.PREVIEW_END> => {
    return createAction(ActionType.PREVIEW_END);
  },
  setToken: (token: string): ActionWithPayload<ActionType.SET_TOKEN, string> => createAction(ActionType.SET_TOKEN, token),
};

export type CommonActions = ActionsUnion<typeof Actions>;
