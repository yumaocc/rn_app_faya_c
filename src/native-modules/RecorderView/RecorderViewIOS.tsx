import * as React from 'react';
import {findNodeHandle, requireNativeComponent, UIManager} from 'react-native';
// import {CameraType} from '../../models';
import {RecorderViewAction, RecorderViewProps, RecorderViewRef} from './types';

const ComponentName = 'RecordView';

const config = UIManager.getViewManagerConfig(ComponentName);
console.log('加载RecordView：', config);

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
    sendAction: (action: RecorderViewAction) => {
      UIManager.dispatchViewManagerCommand(findNodeHandle(nativeRef.current), UIManager.getViewManagerConfig(ComponentName).Commands.sendAction, [action]);
    },
  }));
  return <NativeRecorderView {...props} ref={nativeRef} />;
});
RecorderView.defaultProps = {
  style: {},
  autoPreviewOnReady: true,
  // onRecordReady: () => {},
  // onRecordError: () => {},
};

// class RecorderView extends React.Component<RecorderViewProps> {
//   // 导出的ref方法
//   startPreview = (cameraType: CameraType) => {
//     UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.getViewManagerConfig(ComponentName).Commands.startPreview, [cameraType]);
//   };

//   render() {
//     return <NativeRecorderView {...this.props} />;
//   }
// }
// const RecorderView = NativeRecorderView;
export default RecorderView;
