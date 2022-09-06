import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Video, {LoadError, OnLoadData} from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationBar} from '../../component';
import {useParams} from '../../helper/hooks';
import {globalStyles} from '../../constants/styles';

const WorkDetail: React.FC = () => {
  const {id, videoUrl} = useParams<{id: string; videoUrl: string}>();
  const [error, setError] = React.useState('');

  const player = useRef<Video>(null);
  const [resizeMode, setResizeMode] = React.useState<'none' | 'cover'>('cover');

  // const workDet
  console.log(id, videoUrl);
  useEffect(() => {
    if (!videoUrl) {
      setError('呀，视频不见了～');
    } else {
      setError('');
    }
  }, [videoUrl]);

  function handleOnLoad(e: OnLoadData) {
    const {naturalSize} = e;
    if (naturalSize.orientation === 'landscape') {
      // 横屏视频不缩放，竖屏视频cover
      setResizeMode('none');
      console.log(resizeMode);
    }
  }
  function handleError(e: LoadError) {
    console.log(e);
    setError('呀，视频加载失败～');
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000'}}>
      {videoUrl && <Video onLoad={handleOnLoad} onError={handleError} ref={player} source={{uri: videoUrl}} style={styles.video} repeat={true} resizeMode={resizeMode} />}
      {error && (
        <View style={[styles.video, globalStyles.containerCenter]}>
          <View style={[globalStyles.containerCenter, {backgroundColor: '#f4f4f4', width: '100%', height: 180}]}>
            <Text style={{fontSize: 18}}>{error}</Text>
          </View>
        </View>
      )}
      <View style={styles.cover}>
        <SafeAreaView edges={['top']} style={styles.cover}>
          <View style={[styles.cover]}>
            <NavigationBar safeTop={false} color="#fff" />
            <View style={styles.side}>
              <View style={styles.sideItem}>
                <Image source={{uri: 'https://fakeimg.pl/30?text=loading'}} style={[styles.sideItem, styles.avatar]} />
              </View>
              <View style={styles.sideItem}>
                <Icon name="favorite" size={50} color="#fff" />
                <Text style={[globalStyles.fontSecondary, styles.sideItemText]}>233</Text>
              </View>
              <View style={styles.sideItem}>
                <Icon name="pending" size={50} color="#fff" />
                <Text style={[globalStyles.fontSecondary, styles.sideItemText]}>999</Text>
              </View>
              <View style={styles.sideItem}>
                <Icon name="grade" size={50} color="#fff" />
              </View>
              <View style={styles.sideItem}>
                <Icon name="share" size={40} color="#fff" />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};
export default WorkDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  video: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  cover: {
    flex: 1,
    width: '100%',
    // backgroundColor: '#6cf',
  },
  side: {
    position: 'absolute',
    width: 52,
    alignItems: 'center',
    bottom: 124,
    right: 6,
  },
  sideItem: {
    flex: 1,
    marginTop: 31,
    alignItems: 'center',
  },
  sideItemText: {
    // fontSize: 12,
    color: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
