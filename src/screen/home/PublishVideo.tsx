import React, {useEffect} from 'react';
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
import {FakeNavigation} from '../../models';

const PublishVideo: React.FC = () => {
  const publishConfig = useSelector((state: RootState) => state.work.publishConfig);
  const videoInfo = useSelector((state: RootState) => state.work.videoInfo);
  const bindSPU = useSelector((state: RootState) => state.work.bindSPU);
  const [percent, setPercent] = React.useState(0);
  const currentUpload = React.useRef('none');
  const navigation = useNavigation<FakeNavigation>();

  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    PublishManager.onProgress(progress => {
      const {uploaded, total} = progress;
      if (currentUpload.current === 'video') {
        const percent = Math.floor((uploaded / total) * 90);
        setPercent(getValidPercent(percent));
      } else {
        const percent = Math.floor(90 + (uploaded / total) * 10);
        setPercent(getValidPercent(percent));
      }
    });
    return () => {
      PublishManager.removeProgressListener();
    };
  }, []);

  async function startUpload() {
    try {
      const mainId = await api.work.getPublishMainID(publishConfig.publishType);
      const auth = await api.work.getUploadVideoAuth({
        mainId,
        title: 'video',
        fileName: videoInfo?.path.split('/').pop() || '',
      });
      // console.log('video auth', auth);
      currentUpload.current = 'video';
      await PublishManager.uploadVideo({
        uploadAuth: auth.uploadAuth,
        uploadAddress: auth.uploadAddress,
        path: videoInfo?.path,
      });
      // console.log('上传视频 done');
      currentUpload.current = 'cover';
      const coverAuth = await api.work.getUploadPhotoAuth({mainId, imageType: 'cover'});
      // console.log('cover auth', coverAuth);
      await PublishManager.uploadPhoto({path: videoInfo?.coverPath, uploadAuth: coverAuth.uploadAuth, uploadAddress: coverAuth.uploadAddress});
      // console.log('cover done');
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
        bindSpuId: bindSPU?.spuId,
      });

      // console.log('success');
      setPercent(100);
    } catch (error) {
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
      <NavigationBar title="发布" headerLeft={<View />} />
      <View style={styles.progressContainer}>
        {percent < 100 ? (
          <>
            <View style={styles.progress}>
              <View style={[styles.bar, {width: `${percent}%`}]} />
            </View>
            <Text style={{marginTop: globalStyleVariables.MODULE_SPACE}}>发布中{percent}%</Text>
          </>
        ) : (
          <View style={{alignItems: 'center'}}>
            <Text style={globalStyles.fontPrimary}>发布成功</Text>
            <Button style={{marginTop: 20}} title="返回首页" onPress={back} />
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
