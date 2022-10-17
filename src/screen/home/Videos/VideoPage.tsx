import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useImperativeHandle, useMemo, useState, memo} from 'react';
import {View, Text, StyleSheet, useWindowDimensions, Image} from 'react-native';
import Icon from '../../../component/Icon';
import Video, {OnLoadData} from 'react-native-video';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useAppState, useCommonDispatcher} from '../../../helper/hooks';
import {VideoPlayerRef} from './types';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {WorkDetailF, WorkF} from '../../../models';
import * as api from '../../../apis';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import CustomTouchable from '../../../component/CustomTouchable';
import {BoolEnum} from '../../../fst/models';

interface VideoPageProps {
  item: WorkF;
  paused: boolean;
  shouldLoad?: boolean;
  onShowSPU: (id: number) => void;
}

const VideoPage = React.forwardRef<VideoPlayerRef, VideoPageProps>((props, ref) => {
  const {shouldLoad} = props;
  const [paused, setPaused] = useState(props.paused);
  const [resizeMode, setResizeMode] = useState<'none' | 'cover'>('cover');
  const [error, setError] = useState('');
  const [workDetail, setWorkDetail] = useState<WorkDetailF>();
  const hasSpu = useMemo(() => workDetail?.spuId && workDetail?.spuName, [workDetail]);
  const [videoUrl, setVideoUrl] = useState(''); // 控制视频地址已达到懒加载效果

  const token = useSelector((state: RootState) => state.common.token);

  const {width, height} = useWindowDimensions();
  const isFocused = useIsFocused();
  const appState = useAppState();
  const {bottom} = useSafeAreaInsets();
  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    if (shouldLoad) {
      if (videoUrl !== props.item.videoUrl) {
        setVideoUrl(props.item.videoUrl);
      }
    } else {
      // setVideoUrl('');
    }
  }, [shouldLoad, props.item.videoUrl, videoUrl]);

  // useLog('detail', workDetail);

  useEffect(() => {
    if (isFocused && appState === 'active' && !props.paused) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  }, [isFocused, appState, props.paused]);

  useEffect(() => {
    if (!workDetail && !props.paused) {
      api.work.getWorkDetail(props.item.mainId).then(setWorkDetail).catch(commonDispatcher.error);
    }
  }, [props.paused, props.item, workDetail, commonDispatcher]);

  console.log(workDetail);

  function handleOnLoad(e: OnLoadData) {
    const {naturalSize} = e;
    if (naturalSize.orientation === 'landscape') {
      // 横屏视频不缩放，竖屏视频cover
      setResizeMode('none');
    }
  }

  useImperativeHandle(ref, () => ({
    play: () => setPaused(false),
    pause: () => setPaused(true),
  }));

  useEffect(() => {
    setPaused(props.paused);
  }, [props.paused]);

  function handleError() {
    setError('呀，视频加载失败～');
  }
  const handleClickCover = useCallback(() => {
    setPaused(!paused);
  }, [paused]);

  function openSPU() {
    if (workDetail?.spuId) {
      props.onShowSPU(workDetail.spuId);
    }
  }

  function openComment() {
    console.log(1);
  }

  return (
    <View style={[{width, height}, styles.container]}>
      {!error && (
        <Video
          style={styles.full}
          disableFocus={true}
          onLoad={handleOnLoad}
          onError={handleError}
          source={{uri: videoUrl}}
          paused={paused}
          repeat={true}
          resizeMode={resizeMode}
          poster={props.item.coverImage}
        />
      )}
      {!!error && (
        <View style={[styles.full, globalStyles.containerCenter]}>
          <View style={[globalStyles.containerCenter, {backgroundColor: '#f4f4f4', width: '100%', height: 180}]}>
            <Text style={{fontSize: 18}}>{error}</Text>
          </View>
        </View>
      )}

      {/* 视频上覆盖的所有页面 */}

      <View style={styles.cover}>
        <SafeAreaView edges={['top']} style={styles.cover}>
          <CustomTouchable activeOpacity={1} onPress={handleClickCover} style={[styles.cover]}>
            <View style={[styles.cover]}>
              {/* 暂停后的播放按钮 */}
              {paused && !error ? (
                <View style={[globalStyles.containerCenter, styles.full]}>
                  <Icon name="home_faxian_nor64" color="#ddd" size={80} />
                </View>
              ) : null}
              {workDetail && (
                <View style={styles.side}>
                  <View style={styles.sideItem}>
                    <Image source={require('../../../assets/avatar_def.png')} style={[styles.sideItem, styles.avatar]} />
                  </View>
                  <View style={styles.sideItem}>
                    {workDetail?.liked === BoolEnum.TRUE ? (
                      <Icon name="zuopin_zan80" size={40} color={globalStyleVariables.COLOR_LIKE_RED} />
                    ) : (
                      <Icon name="zuopin_zan80" size={40} color="#fff" />
                    )}
                    <Text style={[globalStyles.fontSecondary, styles.sideItemText]}>{workDetail.numberOfLikes}</Text>
                  </View>
                  <View style={styles.sideItem}>
                    <Icon name="zuopin_pinglun80" size={40} color="#fff" />
                    <Text style={[globalStyles.fontSecondary, styles.sideItemText]}>{workDetail.numberOfComments}</Text>
                  </View>
                  <View style={styles.sideItem}>
                    {workDetail?.collected === BoolEnum.TRUE ? (
                      <Icon name="zuopin_shoucang80" size={40} color={globalStyleVariables.COLOR_COLLECT_YELLOW} />
                    ) : (
                      <Icon name="zuopin_shoucang80" size={40} color="#fff" />
                    )}
                    <Text style={[globalStyles.fontSecondary, styles.sideItemText]}>{workDetail.numberOfCollects}</Text>
                  </View>
                  <View style={styles.sideItem}>
                    <Icon name="zuopin_share80" size={40} color="#fff" />
                  </View>
                </View>
              )}
              <View style={[styles.bottom]}>
                <View style={{paddingRight: 70, paddingLeft: globalStyleVariables.MODULE_SPACE_BIGGER}}>
                  {/* 发布人 */}
                  {hasSpu && (
                    <CustomTouchable activeOpacity={0.5} onPress={openSPU} style={{width: 150, padding: 7, backgroundColor: '#0000004D', borderRadius: 5}}>
                      <View style={[globalStyles.containerRow]}>
                        <Icon name="zuopin_shangping" color={globalStyleVariables.COLOR_WARNING} size={24} />
                        <Text style={[globalStyles.fontTertiary, {flex: 1, color: '#fff'}]} numberOfLines={1}>
                          {workDetail?.spuName}
                        </Text>
                      </View>
                    </CustomTouchable>
                  )}
                  {workDetail?.userName && (
                    <CustomTouchable activeOpacity={0.8}>
                      <Text style={[globalStyles.fontStrong, {fontSize: 20, color: '#fff'}]}>@{workDetail?.userName}</Text>
                    </CustomTouchable>
                  )}
                  <View style={{marginVertical: globalStyleVariables.MODULE_SPACE}}>
                    <Text style={[globalStyles.fontPrimary, {color: '#fff'}]} numberOfLines={5}>
                      {workDetail?.content}
                    </Text>
                  </View>
                </View>
                {/* 进度条 */}
                {/* <View style={{backgroundColor: '#000', height: 2, position: 'relative'}}>
                    <View style={[styles.progressBar, {backgroundColor: '#999', width: seekedPercent + '%'}]} />
                    <View style={[styles.progressBar, {backgroundColor: '#fff', width: playPercent + '%'}]} />
                  </View> */}
                {/* 下面的框 */}
                {/* 登录后可见评论框 */}
                {!!token && (
                  <CustomTouchable activeOpacity={0.7} onPress={openComment}>
                    <View style={{backgroundColor: '#000', padding: globalStyleVariables.MODULE_SPACE}}>
                      <View style={[styles.fakeInputComment]}>
                        <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.TEXT_COLOR_TERTIARY}]}>说点好听的</Text>
                      </View>
                    </View>
                  </CustomTouchable>
                )}
                <View style={{backgroundColor: '#000', height: bottom}} />
              </View>
            </View>
          </CustomTouchable>
        </SafeAreaView>
      </View>
    </View>
  );
});

export default memo(VideoPage, (prev: VideoPageProps, next: VideoPageProps) => {
  return prev.item.mainId === next.item.mainId && prev.paused === next.paused && prev.shouldLoad === next.shouldLoad && prev.onShowSPU === next.onShowSPU;
});

VideoPage.defaultProps = {
  shouldLoad: false,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  full: {
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
