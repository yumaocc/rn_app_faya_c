import {MutableRefObject} from 'react';
import {ViewStyle} from 'react-native';

export type RecorderViewProps = {
  style?: ViewStyle;
  autoPreviewOnReady?: boolean;
  ref?: MutableRefObject<RecorderViewRef>;

  onRecordReady?: () => void;
  onHello?: () => void;
  onRecordError?: (message: string, code: number) => void;
};

export type RecorderViewActionType = 'startPreview' | 'stopPreview';
export type RecorderViewAction = {
  type: RecorderViewActionType;
  payload?: any;
};
export interface RecorderViewRef {
  sendAction: (action: RecorderViewAction) => void;
}
