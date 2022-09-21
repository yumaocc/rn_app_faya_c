import * as React from 'react';
import {findNodeHandle, PermissionsAndroid, requireNativeComponent, UIManager, View} from 'react-native';
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
  const {style} = props;
  const nativeRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ])
      .then(result => {
        const permissions = [
          result[PermissionsAndroid.PERMISSIONS.CAMERA],
          result[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
          result[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE],
          result[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE],
        ];
        console.log(permissions);
        console.log('权限请求结果：', result);
        if (permissions.every(permission => permission === PermissionsAndroid.RESULTS.GRANTED)) {
          console.log('权限请求成功');
          setReady(true);
        }
      })
      .catch(console.log);
  }, []);

  // function createFragment(viewId: number) {
  //   console.log('createFragment');
  //   UIManager.dispatchViewManagerCommand(viewId, config.Commands.create.toString(), [viewId]);
  // }

  // React.useEffect(() => {
  //   const viewId = findNodeHandle(nativeRef.current);
  //   createFragment(viewId);
  // }, []);

  React.useImperativeHandle(ref, () => ({
    sendAction: (type: RecorderViewActionType, payload?: any) => {
      UIManager.dispatchViewManagerCommand(findNodeHandle(nativeRef.current), UIManager.getViewManagerConfig(ComponentName).Commands.sendAction.toString(), [{type, payload}]);
    },
  }));

  if (!ready) {
    return <View style={props.style} ref={nativeRef} />;
  }
  // 安卓的原生view不能设置背景颜色，否则会无法预览
  return <NativeRecorderView {...props} style={{...style, backgroundColor: undefined}} ref={nativeRef} />;
});

RecorderView.defaultProps = {
  style: {},
  autoPreviewOnReady: true,
};

export default RecorderView;
