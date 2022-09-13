import * as React from 'react';
import {findNodeHandle, requireNativeComponent, UIManager} from 'react-native';
import {RecorderViewProps, RecorderViewRef, RecorderViewActionType} from './types';

const ComponentName = 'SMNRecordView';

const config = UIManager.getViewManagerConfig(ComponentName);
console.log('加载RecordView：');
console.log(config?.Commands);

const NativeRecorderView =
  config != null
    ? requireNativeComponent<RecorderViewProps>(ComponentName)
    : () => {
        throw new Error('RecorderView is not available on this platform');
      };

// 导出组件
const RecorderView = React.forwardRef<RecorderViewRef, RecorderViewProps>((props, ref) => {
  const nativeRef = React.useRef(null);

  function createFragment(viewId: number) {
    console.log('createFragment');
    UIManager.dispatchViewManagerCommand(viewId, config.Commands.create.toString(), [viewId]);
  }

  React.useEffect(() => {
    const viewId = findNodeHandle(nativeRef.current);
    createFragment(viewId);
  }, []);

  React.useImperativeHandle(ref, () => ({
    sendAction: (type: RecorderViewActionType, payload?: any) => {
      UIManager.dispatchViewManagerCommand(findNodeHandle(nativeRef.current), UIManager.getViewManagerConfig(ComponentName).Commands.sendAction.toString(), [{type, payload}]);
    },
  }));
  return <NativeRecorderView {...props} ref={nativeRef} />;
});

RecorderView.defaultProps = {
  style: {},
  autoPreviewOnReady: true,
};

export default RecorderView;
