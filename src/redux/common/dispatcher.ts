import {Dispatch} from 'redux';
import {Actions} from './actions';

import {PreviewConfig} from '../../fst/models';

export interface CommonDispatcher {
  error(message: string | any): void;
  success(message: string): void;
  info(message: string): void;
  initApp(): void;
  previewImages(config: PreviewConfig): void;
  closePreview(): void;
}

export const getCommonDispatcher = (dispatch: Dispatch): CommonDispatcher => ({
  error(message: string | any) {
    dispatch(Actions.error(message));
  },
  success(message) {
    dispatch(Actions.success(message));
  },
  info(message) {
    dispatch(Actions.info(message));
  },
  initApp() {
    dispatch(Actions.initApp());
  },
  previewImages(config: PreviewConfig) {
    dispatch(Actions.previewImages(config));
  },
  closePreview() {
    dispatch(Actions.closePreview());
  },
});
