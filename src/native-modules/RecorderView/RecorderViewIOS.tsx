import * as React from 'react';
import {findNodeHandle, requireNativeComponent, UIManager} from 'react-native';
import {RecorderViewProps, RecorderViewRef, RecorderViewActionType} from './types';

const ComponentName = 'SMNRecordView';

const config = UIManager.getViewManagerConfig(ComponentName);

const NativeRecorderView =
  config != null
    ? requireNativeComponent<RecorderViewProps>(ComponentName)
    : () => {
        throw new Error('RecorderView is not available on this platform');
      };

// 导出组件
const RecorderView = React.forwardRef<RecorderViewRef, RecorderViewProps>((props, ref) => {
  const nativeRef = React.useRef(null);
  React.useImperativeHandle(ref, () => ({
    sendAction: (type: RecorderViewActionType, payload?: any) => {
      UIManager.dispatchViewManagerCommand(findNodeHandle(nativeRef.current), UIManager.getViewManagerConfig(ComponentName).Commands.sendAction, [{type, payload}]);
    },
  }));
  return <NativeRecorderView {...props} ref={nativeRef} />;
});

RecorderView.defaultProps = {
  style: {},
  autoPreviewOnReady: true,
};

export default RecorderView;
