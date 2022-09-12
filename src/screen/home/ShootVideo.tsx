import {useNavigation} from '@react-navigation/native';
import React, {useRef} from 'react';
import {View, StyleSheet, NativeSyntheticEvent} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {Button, NavigationBar} from '../../component';
import {globalStyles} from '../../constants/styles';
import {useWorkDispatcher} from '../../helper/hooks';
import {FakeNavigation} from '../../models';
import {RecorderFinishData, RecorderView, RecorderViewRef, RecorderViewActionType, RecorderErrorData, RecorderState} from '../../native-modules/RecorderView';
import {RootState} from '../../redux/reducers';

const ShootVideo: React.FC = () => {
  const recorder = useRef<RecorderViewRef>(null);
  // const [videoPath, setVideoPath] = React.useState('');
  const videoInfo = useSelector((state: RootState) => state.work.videoInfo);
  const [workDispatcher] = useWorkDispatcher();

  const navigation = useNavigation<FakeNavigation>();
  // const [isRecording, setIsRecording] = React.useState(false);

  function handleReady() {
    console.log('recorder ready');
    recorder.current?.sendAction(RecorderViewActionType.StartPreview);
  }
  function handleError(e: NativeSyntheticEvent<RecorderErrorData>) {
    console.log('error:', e);
    console.log(e.nativeEvent);
  }
  function handleClick() {
    recorder.current?.sendAction(RecorderViewActionType.StartPreview);
  }
  function getState() {
    recorder.current?.sendAction(RecorderViewActionType.CheckState);
  }
  function handleStateChange(e: NativeSyntheticEvent<RecorderState>) {
    console.log('state change:', e.nativeEvent);
  }
  function handleStartRecording() {
    recorder.current?.sendAction(RecorderViewActionType.StartRecord);
  }
  function handlePauseRecording() {
    recorder.current?.sendAction(RecorderViewActionType.PauseRecord);
  }
  function handleFinishRecording() {
    recorder.current?.sendAction(RecorderViewActionType.FinishRecord);
  }
  function onFinish(e: NativeSyntheticEvent<RecorderFinishData>) {
    console.log('结束录制');
    console.log(e.nativeEvent);
    workDispatcher.setVideoInfo({
      path: e.nativeEvent.path,
      duration: e.nativeEvent.duration,
    });
  }

  function onNext() {
    if (videoInfo) {
      navigation.navigate('Publish');
    }
  }
  return (
    <>
      <View style={styles.container}>
        <RecorderView
          style={styles.record}
          ref={recorder}
          onRecorderError={handleError}
          onRecorderReady={handleReady}
          onRecorderStateChange={handleStateChange}
          onRecordFinish={onFinish}
          onRecordFinishWithMaxDuration={onFinish}
        />
        <SafeAreaView style={styles.coverContainer}>
          <NavigationBar safeTop={false} color="#fff" headerRight={<Button title="下一步" onPress={onNext} />} />
          <View style={[globalStyles.containerRow, {flexWrap: 'wrap'}]}>
            <Button style={styles.button} title="开始预览" onPress={handleClick} />
            <Button style={styles.button} title="获取录制状态" onPress={getState} />
            <Button style={styles.button} title="开始录制" onPress={handleStartRecording} />
            <Button style={styles.button} title="暂停录制" onPress={handlePauseRecording} />
            <Button style={styles.button} title="结束录制" onPress={handleFinishRecording} />
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};
export default ShootVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
    position: 'relative',
  },
  record: {
    flex: 1,
  },
  coverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  button: {
    // width: 100,
    marginRight: 10,
    marginBottom: 10,
  },
});
