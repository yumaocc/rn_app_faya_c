import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo, useRef} from 'react';
import {View, StyleSheet, NativeSyntheticEvent, Text, TouchableOpacity, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, NavigationBar} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useAndroidBack, useWorkDispatcher} from '../../helper/hooks';
import {FakeNavigation, VideoInfo} from '../../models';
import {RecorderFinishData, RecorderView, RecorderViewRef, RecorderViewActionType, RecorderErrorData, RecorderState, RecorderProgressData} from '../../native-modules/RecorderView';
import {secondToMinute} from '../../fst/helper';
import {launchImageLibrary} from 'react-native-image-picker';
import PublishManager from '../../native-modules/PublishManager';
import {copyFileUrl, getVideoNameByPath} from '../../helper/system';
import Icon from '../../component/Icon';
import MyStatusBar from '../../component/MyStatusBar';

const ShootVideo: React.FC = () => {
  const recorder = useRef<RecorderViewRef>(null);
  const [recorderState, setRecorderState] = React.useState<RecorderState>({
    isRecording: false,
    torchMode: 'off',
  });
  const isRecording = useMemo(() => recorderState.isRecording, [recorderState.isRecording]);
  const [duration, setDuration] = React.useState('');
  const readyRef = useRef(false); // 用于检测是否需要自动跳转下一步

  const [workDispatcher] = useWorkDispatcher();
  const [videoInfo, setVideoInfo] = React.useState<VideoInfo>(null);

  const navigation = useNavigation<FakeNavigation>();

  useAndroidBack();

  function handleReady() {
    console.log('recorder ready');
    recorder.current?.sendAction(RecorderViewActionType.StartPreview);
  }
  function handleError(e: NativeSyntheticEvent<RecorderErrorData>) {
    console.log('error:', e);
    console.log(e.nativeEvent);
  }
  function handleStateChange(e: NativeSyntheticEvent<RecorderState>) {
    setRecorderState(e.nativeEvent);
  }
  function startRecord() {
    readyRef.current = false; // 不再自动跳转下一步
    recorder.current?.sendAction(RecorderViewActionType.StartRecord);
  }
  function pauseRecord() {
    recorder.current?.sendAction(RecorderViewActionType.PauseRecord);
  }
  function finishRecord() {
    recorder.current?.sendAction(RecorderViewActionType.FinishRecord);
  }
  const handleProgress = useCallback((e: NativeSyntheticEvent<RecorderProgressData>) => {
    setDuration(secondToMinute(e.nativeEvent.duration));
  }, []);
  // function handleProgress(e: NativeSyntheticEvent<RecorderProgressData>) {
  //   setDuration(secondToMinute(e.nativeEvent.duration));
  // }
  function onFinish(e: NativeSyntheticEvent<RecorderFinishData>) {
    const info: VideoInfo = {...e.nativeEvent, fileName: getVideoNameByPath(e.nativeEvent.path)};
    console.log('完成录制');
    console.log(info);
    setVideoInfo(info);
    if (readyRef.current) {
      jumpToNext(info);
    } else {
      readyRef.current = true;
    }
  }

  function jumpToNext(videoInfo: VideoInfo) {
    workDispatcher.setVideoInfo(videoInfo);
    navigation.navigate('Publish');
  }

  function onNext() {
    if (readyRef.current) {
      if (videoInfo) {
        jumpToNext(videoInfo);
      }
    } else {
      readyRef.current = true;
      finishRecord();
    }
  }

  // 处理后台任务
  useFocusEffect(
    React.useCallback(() => {
      recorder.current?.sendAction(RecorderViewActionType.StartPreview);
      return () => {
        recorder.current?.sendAction(RecorderViewActionType.StopPreview);
      };
    }, []),
  );

  async function selectVideo() {
    try {
      const result = await launchImageLibrary({
        mediaType: 'video',
        videoQuality: 'high',
        selectionLimit: 1,
      });
      console.log('result');
      console.log(result);
      if (result?.assets?.length) {
        const video = result.assets[0];
        let uri = video.uri;
        if (Platform.OS === 'android') {
          uri = await copyFileUrl(video.uri, video.fileName);
        }
        console.log('replaced_uri', uri);
        const info: VideoInfo = {
          path: uri.replace(/^file:\/\//, ''),
          coverPath: await PublishManager.getVideoCover({path: uri}),
          duration: video.duration,
          fileName: getVideoNameByPath(uri),
        };
        console.log(info);
        jumpToNext(info);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <MyStatusBar barStyle="light-content" />
        <RecorderView
          style={styles.record}
          ref={recorder}
          onRecorderError={handleError}
          onRecorderReady={handleReady}
          onRecorderStateChange={handleStateChange}
          onRecordFinish={onFinish}
          onRecordFinishWithMaxDuration={onFinish}
          onRecordProgress={handleProgress}
        />
        <SafeAreaView style={styles.coverContainer}>
          {!isRecording && (
            <NavigationBar
              safeTop={false}
              color="#fff"
              headerRight={
                <View style={{paddingRight: globalStyleVariables.MODULE_SPACE}}>
                  <Button type="primary" title="下一步" onPress={onNext} style={{height: 25, paddingVertical: 0, paddingLeft: 5, paddingRight: 5}} />
                </View>
              }
            />
          )}
          {/* <View style={[globalStyles.containerRow, {flexWrap: 'wrap'}]}>
          </View> */}
          {!isRecording && (
            <View style={styles.side}>
              <TouchableOpacity activeOpacity={0.6} onPress={() => recorder.current?.sendAction(RecorderViewActionType.SwitchCamera)}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Icon name="fabu_menu_fanzhuan" size={30} color="#fff" />
                  <Text style={[globalStyles.fontPrimary, {color: '#fff', fontSize: 12}]}>翻转</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.bottom}>
            <View style={[globalStyles.containerCenter, {marginBottom: globalStyleVariables.MODULE_SPACE}]}>
              <Text style={[globalStyles.fontPrimary, {color: '#fff', fontSize: 14}]}>{duration}</Text>
            </View>
            <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}>
              <View style={styles.bottomControl} />
              <View style={[styles.bottomControl, {marginLeft: 30}]}>
                {!isRecording ? (
                  <TouchableOpacity activeOpacity={0.8} onPress={startRecord}>
                    <View style={[globalStyles.containerCenter, {width: 78, height: 78, borderRadius: 78, borderColor: '#fff', borderWidth: 4}]}>
                      <View style={{width: 67, height: 67, borderRadius: 67, backgroundColor: globalStyleVariables.COLOR_PRIMARY}} />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity activeOpacity={0.8} onPress={pauseRecord}>
                    <View style={[globalStyles.containerCenter, {width: 78, height: 78, borderRadius: 78, borderColor: '#909292', borderWidth: 4, backgroundColor: '#909292'}]}>
                      <View style={{width: 24, height: 24, borderRadius: 5, backgroundColor: '#fff'}} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View style={[styles.bottomControl, {marginLeft: 30}]}>
                {!isRecording && (
                  <TouchableOpacity onPress={selectVideo}>
                    <View style={[globalStyles.containerCenter]}>
                      <Icon name="fabu_menu_xiangce" size={45} color="#fff" />
                      <Text style={[globalStyles.fontPrimary, {color: '#fff', fontSize: 12, marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]}>相册</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
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
  side: {
    position: 'absolute',
    right: globalStyleVariables.MODULE_SPACE,
    top: 150,
  },
  bottom: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    height: 100,
  },
  bottomControl: {
    width: 78,
    height: 78,
  },
});
