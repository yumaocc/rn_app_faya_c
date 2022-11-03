import produce from 'immer';
import {SystemConfig} from '../../models';

import {CommonActions} from './actions';
import {ActionType} from './types';

export interface CommonState {
  isLoading: boolean; // 是否正在初始化加载
  message: string; // 全局消息提示
  messageType: 'error' | 'success' | 'info' | 'none';
  config: SystemConfig;
}

export const initialState: CommonState = {
  isLoading: true,
  message: '',
  messageType: 'none',
  config: {
    token: '',
    phone: '',
    locationId: null,
    locationName: '',
    shareUserId: null,
    touristId: null,
    buyUserName: '',
    buyUserPhone: '',
  },
};

export default (state = initialState, action: CommonActions): CommonState => {
  const {type} = action;

  switch (type) {
    case ActionType.INIT_APP_SUCCESS:
      return produce(state, draft => {
        draft.isLoading = false;
      });
    case ActionType.ERROR:
      return produce(state, draft => {
        const {payload} = action;
        const isString = typeof payload === 'string';
        const message = isString ? payload : payload.message;
        draft.message = message || '呀哎，出错啦～';
        draft.messageType = 'error';
      });
    case ActionType.SUCCESS:
      return produce(state, draft => {
        const {payload} = action;
        draft.message = payload || '';
        draft.messageType = 'success';
      });
    case ActionType.INFO:
      return produce(state, draft => {
        const {payload} = action;
        draft.message = payload || '';
        draft.messageType = 'info';
      });
    case ActionType.DISMISS_MESSAGE:
      return produce(state, draft => {
        draft.message = '';
        draft.messageType = 'none';
      });
    case ActionType.SET_CONFIG:
      return produce(state, draft => {
        const {payload} = action;
        draft.config = {
          ...draft.config,
          ...payload,
        };
      });
    case ActionType.RESET:
      return initialState;
    default:
      return state;
  }
};
