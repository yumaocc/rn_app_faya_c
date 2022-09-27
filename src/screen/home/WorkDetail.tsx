import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView, useWindowDimensions} from 'react-native';
import {useSelector} from 'react-redux';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Video, {LoadError, OnLoadData, OnProgressData} from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationBar, Popup} from '../../component';
import {useCommonDispatcher, useParams, useSPUDispatcher, useUserDispatcher} from '../../helper/hooks';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {FakeNavigation, PackageDetail, SKUDetail, WorkDetailF} from '../../models';
import * as api from '../../apis';
import {RootState} from '../../redux/reducers';
import SPUDetailView from '../spu/SPUDetailView';
import BuyBar from '../spu/BuyBar';
import {useNavigation} from '@react-navigation/native';

const WorkDetail: React.FC = () => {
  const {id, videoUrl} = useParams<{id: string; videoUrl: string}>();
  const token = useSelector((state: RootState) => state.common.token);
  const [error, setError] = useState('');
  const [resizeMode, setResizeMode] = useState<'none' | 'cover'>('cover');
  const [progress, setProgress] = useState<OnProgressData>(null);
  const [paused, setPaused] = useState(false);
  const [workDetail, setWorkDetail] = useState<WorkDetailF>();
  const hasSpu = useMemo(() => workDetail?.spuId && workDetail?.spuName, [workDetail]);
  const [showSPU, setShowSPU] = useState(false);
  const currentSPU = useSelector((state: RootState) => state.spu.currentSPU);
  const currentSKU = useSelector((state: RootState) => state.spu.currentSKU);
  const currentSKUIsPackage = useSelector((state: RootState) => state.spu.currentSKUIsPackage);
  const player = useRef<Video>(null);
  const {bottom} = useSafeAreaInsets();
  const [commonDispatcher] = useCommonDispatcher();
  const [spuDispatcher] = useSPUDispatcher();
  const [userDispatcher] = useUserDispatcher();
  const navigation = useNavigation<FakeNavigation>();
  const {height} = useWindowDimensions();

  const seekedPercent = useMemo(() => {
    if (!progress) {
      return 0;
    }
    let val = (progress.playableDuration / progress.seekableDuration) * 100;
    val = Math.max(0, val);
    val = Math.min(100, val);
    return val;
  }, [progress]);

  const playPercent = useMemo(() => {
    if (!progress) {
      return 0;
    }
    let val = (progress.currentTime / progress.seekableDuration) * 100;
    val = Math.max(0, val);
    val = Math.min(100, val);
    return val;
  }, [progress]);

  useEffect(() => {
    api.work.getWorkDetail(id).then(setWorkDetail).catch(commonDispatcher.error);
  }, [id, commonDispatcher]);

  // const workDet
  // console.log(id, videoUrl);
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
    }
  }
  function handleError(e: LoadError) {
    console.log(e);
    setError('呀，视频加载失败～');
  }
  // function handleProgress(e: OnProgressData) {
  //   setProgress(e);
  // }

  const handleProgress = useCallback((e: OnProgressData) => {
    setProgress(e);
  }, []);

  // function togglePlay() {
  //   // player.current
  // }

  function handleClick() {
    setPaused(!paused);
  }

  function openComment() {
    // setShowComment(true);
  }

  function openSPU() {
    if (currentSPU?.id && workDetail?.spuId && currentSPU.id !== workDetail?.spuId) {
      spuDispatcher.viewSPU(workDetail?.spuId);
    }
    setShowSPU(true);
  }

  const handleChangeSKU = useCallback(
    (sku: SKUDetail | PackageDetail, isPackage: boolean) => {
      spuDispatcher.changeSKU(sku, isPackage);
    },
    [spuDispatcher],
  );

  const handleBuy = useCallback(() => {
    setShowSPU(false);
    if (!token) {
      userDispatcher.login({
        to: 'Order',
        params: {id},
        redirect: true,
      });
    } else {
      navigation.navigate('Order', {id});
    }
  }, [userDispatcher, navigation, token, id]);

  return (
    <>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000'}}>
        {videoUrl && (
          <Video
            onProgress={handleProgress}
            onLoad={handleOnLoad}
            paused={paused}
            onError={handleError}
            progressUpdateInterval={16}
            ref={player}
            source={{uri: videoUrl}}
            style={styles.video}
            muted
            repeat={true}
            resizeMode={resizeMode}
          />
        )}
        {error && (
          <View style={[styles.video, globalStyles.containerCenter]}>
            <View style={[globalStyles.containerCenter, {backgroundColor: '#f4f4f4', width: '100%', height: 180}]}>
              <Text style={{fontSize: 18}}>{error}</Text>
            </View>
          </View>
        )}
        <View style={styles.cover}>
          <SafeAreaView edges={['top']} style={styles.cover}>
            <NavigationBar safeTop={false} color="#fff" />
            <TouchableWithoutFeedback onPress={handleClick}>
              <View style={[styles.cover]}>
                {/* 暂停后的播放按钮 */}
                {paused && !error ? (
                  <View style={[globalStyles.containerCenter, styles.video, {backgroundColor: '#00000044'}]}>
                    <Icon name="play-arrow" color="#ddd" size={80} />
                  </View>
                ) : null}
                {workDetail && (
                  <View style={styles.side}>
                    <View style={styles.sideItem}>
                      <Image source={{uri: 'https://fakeimg.pl/30?text=loading'}} style={[styles.sideItem, styles.avatar]} />
                    </View>
                    <View style={styles.sideItem}>
                      <Icon name="favorite" size={50} color="#fff" />
                      <Text style={[globalStyles.fontSecondary, styles.sideItemText]}>{workDetail.numberOfLikes}</Text>
                    </View>
                    <View style={styles.sideItem}>
                      <Icon name="pending" size={50} color="#fff" />
                      <Text style={[globalStyles.fontSecondary, styles.sideItemText]}>{workDetail.numberOfComments}</Text>
                    </View>
                    <View style={styles.sideItem}>
                      <Icon name="grade" size={50} color="#fff" />
                    </View>
                    <View style={styles.sideItem}>
                      <Icon name="share" size={40} color="#fff" />
                    </View>
                  </View>
                )}
                <View style={[styles.bottom]}>
                  <View style={{paddingRight: 70, paddingLeft: globalStyleVariables.MODULE_SPACE_BIGGER}}>
                    {/* 发布人 */}
                    {hasSpu && (
                      <TouchableOpacity activeOpacity={0.5} onPress={openSPU}>
                        <View style={[globalStyles.containerRow, {width: 150, padding: 7, backgroundColor: '#0000004D', borderRadius: 5}]}>
                          <Icon name="shopping-cart" color={globalStyleVariables.COLOR_WARNING} size={24} />
                          <Text style={[globalStyles.fontTertiary, {flex: 1, color: '#fff'}]} numberOfLines={1}>
                            {workDetail?.spuName}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    {workDetail?.userName && (
                      <TouchableOpacity activeOpacity={0.8}>
                        <Text style={[globalStyles.fontStrong, {fontSize: 20, color: '#fff'}]}>@{workDetail.userName}</Text>
                      </TouchableOpacity>
                    )}
                    <View style={{marginVertical: globalStyleVariables.MODULE_SPACE}}>
                      <Text style={[globalStyles.fontPrimary, {color: '#fff'}]} numberOfLines={5}>
                        {workDetail?.content}
                      </Text>
                    </View>
                  </View>
                  {/* 进度条 */}
                  <View style={{backgroundColor: '#000', height: 2, position: 'relative'}}>
                    <View style={[styles.progressBar, {backgroundColor: '#999', width: seekedPercent + '%'}]} />
                    <View style={[styles.progressBar, {backgroundColor: '#fff', width: playPercent + '%'}]} />
                  </View>
                  {/* 下面的框 */}
                  {/* 登录后可见评论框 */}
                  {!!token && (
                    <TouchableOpacity activeOpacity={0.7} onPress={openComment}>
                      <View style={{backgroundColor: '#000', padding: globalStyleVariables.MODULE_SPACE}}>
                        <View style={[styles.fakeInputComment]}>
                          <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.TEXT_COLOR_TERTIARY}]}>说点好听的</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                  <View style={{backgroundColor: '#000', height: bottom}} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </View>
      </View>

      <Popup visible={showSPU} onClose={() => setShowSPU(false)} style={[styles.spuModel, {height: height * 0.7}]}>
        <View style={{flex: 1}}>
          <ScrollView style={{flex: 1}}>
            <SPUDetailView currentSelect={currentSKU} spu={currentSPU} isPackage={currentSKUIsPackage} onChangeSelect={handleChangeSKU} />
          </ScrollView>
          <BuyBar sku={currentSKU} onBuy={handleBuy} />
        </View>
      </Popup>

      {/* 评论弹窗 */}
      {/* <Popup visible={showComment} onClose={() => setShowComment(false)} style={styles.commentModal} round={20}>
        <View style={{height: 400}}>
          <ScrollView style={{flex: 1}}>
            <Text>111</Text>
            <View style={{height: 200}} />
          </ScrollView>
          <View style={{position: 'absolute', width: '100%', bottom: 0, backgroundColor: '#ccc'}}>
            <TextInput style={styles.commentInput} value={newComment} onChangeText={setNewComment} placeholder="说点好听的" />
          </View>
        </View>
      </Popup> */}
    </>
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
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    left: 0,
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
  },
  fakeInputComment: {
    height: 30,
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER,
  },
  commentModal: {
    paddingTop: 15,
    paddingHorizontal: 15,
    position: 'relative',
  },
  commentInput: {
    padding: 0,
  },
  spuModel: {
    // height: 500,
  },
});
