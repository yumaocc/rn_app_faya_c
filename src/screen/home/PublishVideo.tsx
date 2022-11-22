import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {Button, NavigationBar} from '../../component';
import {useCommonDispatcher} from '../../helper/hooks';
import PublishManager from '../../native-modules/PublishManager';
import {RootState} from '../../redux/reducers';
import * as api from '../../apis';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {getValidPercent} from '../../fst/helper';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation, SPUDetailF, SPUF} from '../../models';
import MyStatusBar from '../../component/MyStatusBar';
import logger from '../../helper/logger';

const PublishVideo: React.FC = () => {
  const publishConfig = useSelector((state: RootState) => state.work.publishConfig);
  const videoInfo = useSelector((state: RootState) => state.work.videoInfo);
  const bindSPU = useSelector((state: RootState) => state.work.bindSPU);
  const [percent, setPercent] = React.useState(0);
  const currentUpload = React.useRef('none');
  const navigation = useNavigation<FakeNavigation>();
  const [hasError, setHasError] = React.useState(false);

  const [commonDispatcher] = useCommonDispatcher();
  const spuId = useMemo(() => (bindSPU as SPUF)?.spuId || (bindSPU as SPUDetailF)?.id, [bindSPU]);

  useEffect(() => {
    PublishManager.onProgress(progress => {
      const {uploaded, total} = progress;
      if (currentUpload.current === 'video') {
        const percent = Math.floor((uploaded / total) * 90);
        setPercent(getValidPercent(percent));
      } else {
        const percent = Math.floor(90 + (uploaded / total) * 10);
        setPercent(getValidPercent(percent - 1)); // 不到100%，防止出现错误没有提示就显示成功了
      }
    });
    return () => {
      PublishManager.removeProgressListener();
    };
  }, []);

  async function startUpload() {
    try {
      const mainId = await api.work.getPublishMainID(publishConfig.publishType);
      // console.log(videoInfo);
      const auth = await api.work.getUploadVideoAuth({
        mainId,
        title: 'video',
        fileName: videoInfo?.fileName || 'upload.mp4',
      });
      currentUpload.current = 'video';
      await PublishManager.uploadVideo({
        uploadAuth: auth.uploadAuth,
        uploadAddress: auth.uploadAddress,
        path: videoInfo?.path,
      });
      currentUpload.current = 'cover';
      const coverAuth = await api.work.getUploadPhotoAuth({mainId, imageType: 'cover'});
      await PublishManager.uploadPhoto({path: videoInfo?.coverPath, uploadAuth: coverAuth.uploadAuth, uploadAddress: coverAuth.uploadAddress});
      const {allowDownload, allowForward, publishType, content, addressName, latitude, longitude, hasPrivate} = publishConfig;
      await api.work.realPublish({
        allowedDownload: allowDownload,
        allowedForward: allowForward,
        type: publishType,
        content,
        hasPrivate,
        latitude,
        longitude,
        addressDetails: addressName,
        mainId: mainId,
        bindSpuId: spuId,
      });

      setPercent(100);
    } catch (error: any) {
      setHasError(true);
      logger.fatal('PublishVideo.tsx', {message: error?.message || 'none', stack: error?.stack});
      commonDispatcher.error(error);
    }
  }

  useEffect(() => {
    startUpload();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function back() {
    navigation.popToTop();
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar title="发布" headerLeft={false} canBack={false} />
      <View style={styles.progressContainer}>
        {percent < 100 ? (
          <>
            <View style={styles.progress}>
              <View style={[styles.bar, {width: `${percent}%`}]} />
            </View>
            {hasError ? (
              <>
                <Text style={{marginTop: globalStyleVariables.MODULE_SPACE}}>发布失败</Text>
                <Button type="primary" style={{marginTop: 20}} title="返回首页" onPress={back} />
              </>
            ) : (
              <Text style={{marginTop: globalStyleVariables.MODULE_SPACE}}>发布中{percent}%</Text>
            )}
          </>
        ) : (
          <View style={{alignItems: 'center'}}>
            <Text style={globalStyles.fontPrimary}>发布成功</Text>
            <Button type="primary" style={{marginTop: 20}} title="返回首页" onPress={back} />
          </View>
        )}
      </View>
    </View>
  );
};

export default PublishVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressContainer: {
    paddingHorizontal: 50,
    alignItems: 'center',
    marginTop: 150,
  },
  progress: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    backgroundColor: '#ddd',
  },
  bar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
  },
});
