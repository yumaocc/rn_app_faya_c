import React from 'react';
import {Platform} from 'react-native';
import {RecorderViewProps} from './types';

export const RecorderView: React.FC<RecorderViewProps> = Platform.select({
  ios: () => require('./RecorderViewIOS').default,
  android: () => require('./RecorderViewAndroid').default,
})();

export type {RecorderViewProps, RecorderErrorData, RecorderViewAction, RecorderViewRef, RecorderState, RecorderFinishData, RecorderProgressData} from './types';
export {RecorderViewActionType} from './types';
