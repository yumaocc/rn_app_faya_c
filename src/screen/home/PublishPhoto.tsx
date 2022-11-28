import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {NavigationBar} from '../../component';
import {useCommonDispatcher} from '../../helper/hooks';
import {PublishManager} from '../../native-modules/PublishManager';
import {RootState} from '../../redux/reducers';
import * as api from '../../apis';
import {WorkType} from '../../models';

const PublishPhoto: React.FC = () => {
  const publishConfig = useSelector((state: RootState) => state.work.publishConfig);
  const videoInfo = useSelector((state: RootState) => state.work.videoInfo);
  // const [percent, setPercent] = React.useState(0);

  const [commonDispatcher] = useCommonDispatcher();

  // useEffect(() => {
  //   PublishManager.addEventListener('progress', e => {
  //     console.log('前端回调');
  //     console.log(e);
  //   });
  //   return () => {
  //     PublishManager.removeAllListeners('progress');
  //   };
  // }, []);

  async function startUpload() {
    try {
      // await PublishManager.uploadVideo
      const mainId = await api.work.getPublishMainID(publishConfig.publishType);
      if (publishConfig.publishType === WorkType.Video) {
        const auth = await api.work.getUploadVideoAuth({
          mainId,
          title: 'video',
          fileName: videoInfo?.path.split('/').pop() || '',
        });
        await PublishManager.uploadVideo({
          uploadAuth: auth.uploadAuth,
          uploadAddress: auth.uploadAddress,
          path: videoInfo?.path,
        });
        const coverAuth = await api.work.getUploadPhotoAuth({mainId, imageType: 'cover'});
        await PublishManager.uploadPhoto({path: videoInfo?.coverPath, uploadAuth: coverAuth.uploadAuth, uploadAddress: coverAuth.uploadAddress});
        console.log('success');
      }
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <NavigationBar title="发布" />
      <Text>PublishPhoto</Text>
    </View>
  );
};

export default PublishPhoto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
