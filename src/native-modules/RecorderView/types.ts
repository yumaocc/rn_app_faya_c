import {MutableRefObject} from 'react';
import {NativeSyntheticEvent, ViewStyle} from 'react-native';

export enum RecorderViewActionType {
  SwitchCamera = 'switchCamera',
  StartPreview = 'startPreview',
  StopPreview = 'stopPreview',
  StartRecord = 'startRecord',
  PauseRecord = 'pauseRecord',
  FinishRecord = 'finishRecord',
  TorchOn = 'torchOn',
  TorchOff = 'torchOff',
  MuteOn = 'muteOn',
  MuteOff = 'muteOff',
  CheckState = 'checkState',
}

export interface RecorderState {
  isRecording: boolean;
  torchMode: 'auto' | 'on' | 'off';
}

export interface RecorderErrorData {
  message: string;
  code: number;
}

export interface RecorderFinishData {
  path: string;
  duration: number;
}

export interface RecorderProgressData {
  duration: number;
}

export type RecorderViewProps = {
  style?: ViewStyle;
  autoPreviewOnReady?: boolean;
  ref?: MutableRefObject<RecorderViewRef>;

  onRecorderReady?: () => void;
  onRecorderError?: (event: NativeSyntheticEvent<RecorderErrorData>) => void;
  onRecorderStateChange?: (event: NativeSyntheticEvent<RecorderState>) => void;
  onPreviewStart?: () => void;
  onPreviewStop?: () => void;
  onRecordStart?: () => void;
  onRecordStop?: () => void;
  onRecordProgress?: (event: NativeSyntheticEvent<RecorderProgressData>) => void;
  onRecordFinish?: (event: NativeSyntheticEvent<RecorderFinishData>) => void;
  onRecordFinishWithMaxDuration?: (event: NativeSyntheticEvent<RecorderFinishData>) => void;
};

export type RecorderViewAction = {
  type: RecorderViewActionType;
  payload?: any;
};
export interface RecorderViewRef {
  sendAction: (actionType: RecorderViewActionType, payload?: any) => void;
}
