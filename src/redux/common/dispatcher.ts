import {Dispatch} from 'redux';
import {Actions} from './actions';

import {SystemConfig} from '../../models';

export interface CommonDispatcher {
  error(message: string | any): void;
  success(message: string): void;
  info(message: string): void;
  initApp(): void;
  setConfig(config: Partial<SystemConfig>): void;
}

export const getCommonDispatcher = (dispatch: Dispatch): CommonDispatcher => ({
  error: (message: string | any) => dispatch(Actions.error(message)),
  success: (message: string) => dispatch(Actions.success(message)),
  info: (message: string) => dispatch(Actions.info(message)),
  initApp: () => dispatch(Actions.initApp()),
  setConfig: (config: Partial<SystemConfig>) => dispatch(Actions.setConfig(config)),
});
