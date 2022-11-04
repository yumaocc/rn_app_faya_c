import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState, memo} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Icon from '../../../component/Icon';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useAppState, useCommonDispatcher, useIsLoggedIn} from '../../../helper/hooks';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {FakeNavigation, WorkDetailF, WorkType} from '../../../models';
// import {Modal} from '@ant-design/react-native';
import * as api from '../../../apis';
import CustomTouchable from '../../../component/CustomTouchable';
import {BoolEnum} from '../../../fst/models';
import Player from './Player';
import PhotoPlayer from './PhotoPlayer';

interface WorkPageProps {
  // item: WorkF;
  width: number;
  height: number;
  videoUrl?: string;
  coverImage: string;
  mainId: string;
  paused: boolean;
  shouldLoad?: boolean;
  onShowSPU: (id: number) => void;
  onShowComment?: (mainId: string, focus?: boolean) => void;
  onShowShare?: (mainId: string) => void;
  onShowWorkAction?: (mainId: string) => void;
}

const WorkPage: React.FC<WorkPageProps> = props => {
  const {shouldLoad, height, width} = props;
  const [paused, setPaused] = useState(props.paused);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [workDetail, setWorkDetail] = useState<WorkDetailF>();
  const hasSpu = useMemo(() => workDetail?.spuId && workDetail?.spuName, [workDetail]);
  const [videoUrl, setVideoUrl] = useState(''); // 控制视频地址以达到懒加载效果
  const [reportedStart, setReportedStart] = useState(false); // 是否已经上报过开始播放
  const [reportedEnd, setReportedEnd] = useState(false); // 是否已经上报过结束播放
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingCollect, setLoadingCollect] = useState(false);
  // const [showWorkAction, setShowWorkAction] = useState(false);

  // const userId = useSelector((state: RootState) => state.user.myDetail?.userId);
  // const shareLink = useMemo(() => getShareWorkLink(props.mainId, userId), [props.mainId, userId]);

  const isLoggedIn = useIsLoggedIn();

  const isFocused = useIsFocused();
  const appState = useAppState();
  const {bottom} = useSafeAreaInsets();
  const [commonDispatcher] = useCommonDispatcher();
  const showPoster = useMemo(() => !resourcesLoaded, [resourcesLoaded]);
  const navigation = useNavigation<FakeNavigation>();

  useEffect(() => {
    if (shouldLoad) {
      if (videoUrl !== props.videoUrl) {
        setVideoUrl(props.videoUrl);
      }
    } else {
      // setVideoUrl('');
    }
  }, [shouldLoad, props.videoUrl, videoUrl]);

  useEffect(() => {
    if (isFocused && appState === 'active' && !props.paused) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  }, [isFocused, appState, props.paused]);

  useEffect(() => {
    if (!workDetail && !props.paused) {
      api.work.getWorkDetail(props.mainId).then(setWorkDetail).catch(commonDispatcher.error);
    }
  }, [props.paused, props.mainId, workDetail, commonDispatcher]);

  useEffect(() => {
    setPaused(props.paused);
  }, [props.paused]);

  function onLongPressCover() {
    props.onShowWorkAction && props.onShowWorkAction(props.mainId);
  }
  const handleClickCover = useCallback(() => {
    setPaused(!paused);
  }, [paused]);

  function openSPU() {
    if (workDetail?.spuId) {
      props.onShowSPU(workDetail.spuId);
    }
  }

  function handleLoad() {
    setResourcesLoaded(true);
    if (!reportedStart) {
      api.point
        .reportWorkPreview(workDetail?.mainId)
        .then(() => {
          setReportedStart(true);
        })
        .catch(console.log);
    }
  }
  function handleVideoLoadError() {
    setResourcesLoaded(true);
  }

  function handleEnd() {
    if (!reportedEnd) {
      api.point
        .reportWorkWatchFinished(workDetail?.mainId)
        .then(() => {
          setReportedEnd(true);
        })
        .catch(console.log);
    }
  }

  function goAuthor() {
    if (workDetail?.userId) {
      navigation.navigate({
        name: 'User',
        params: {id: workDetail.userId},
        key: 'User-' + workDetail.userId, // 每次去往个人中心需要新建一个key，否则会返回之前的页面
      });
    }
  }

  async function handleLike() {
    if (!loadingLike && !!workDetail) {
      const {liked, numberOfLikes, mainId} = workDetail;
      const hasLike = liked === BoolEnum.TRUE;
      try {
        setLoadingLike(true);
        await api.work.likeWork(mainId);
        setWorkDetail({
          ...workDetail,
          liked: hasLike ? BoolEnum.FALSE : BoolEnum.TRUE,
          numberOfLikes: hasLike ? numberOfLikes - 1 : numberOfLikes + 1,
        });
        setLoadingLike(false);
      } catch (error) {
        commonDispatcher.error(error);
        setLoadingLike(false);
      }
    }
  }

  function onOpenComment() {
    props.onShowComment && props.onShowComment(props.mainId);
  }

  function openCommentInput() {
    props.onShowComment && props.onShowComment(props.mainId, true);
  }
  async function handleCollect() {
    if (!loadingCollect && !!workDetail) {
      const {collected, numberOfCollects, mainId} = workDetail;
      const hasCollect = collected === BoolEnum.TRUE;
      try {
        setLoadingCollect(true);
        await api.work.collectWork(mainId);
        setWorkDetail({
          ...workDetail,
          collected: hasCollect ? BoolEnum.FALSE : BoolEnum.TRUE,
          numberOfCollects: hasCollect ? numberOfCollects - 1 : numberOfCollects + 1,
        });
        setLoadingCollect(false);
      } catch (error) {
        commonDispatcher.error(error);
        setLoadingCollect(false);
      }
    }
  }
  function handleShare() {
    props.onShowShare && props.onShowShare(props.mainId);
  }

  return (
    <View style={[{width, height}, styles.container]}>
      {workDetail?.type === WorkType.Video && (
        <Player style={[styles.full]} videoUri={videoUrl} paused={paused} poster={props.coverImage} onLoad={handleLoad} onEnd={handleEnd} onError={handleVideoLoadError} />
      )}
      {workDetail?.type === WorkType.Photo && <PhotoPlayer style={[styles.full]} files={workDetail?.fileList} paused={paused} onLoad={handleLoad} onEnd={handleEnd} />}
      {showPoster && <Image style={[styles.full]} source={{uri: props.coverImage}} resizeMode="cover" />}

      {/* 视频上覆盖的所有页面 */}

      <View style={styles.cover}>
        <Image style={styles.maskUp} source={require('../../../assets/mask-up.png')} />
        <Image style={styles.maskDown} source={require('../../../assets/mask-down.png')} />
        <SafeAreaView edges={['top']} style={styles.cover}>
          <CustomTouchable activeOpacity={1} onPress={handleClickCover} onLongPress={onLongPressCover} style={[styles.cover]}>
            <View style={[styles.cover]}>
              {/* 暂停后的播放按钮 */}
              {paused ? (
                <View style={[globalStyles.containerCenter, styles.full]}>
                  <Icon name="zuopin_shipin_zanting200" color="#ffffffcc" size={100} />
                </View>
              ) : null}

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
                    <CustomTouchable activeOpacity={0.8} onPress={goAuthor}>
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
                {!!isLoggedIn && (
                  <CustomTouchable activeOpacity={0.7} onPress={openCommentInput}>
                    <View style={{backgroundColor: '#000', padding: globalStyleVariables.MODULE_SPACE}}>
                      <View style={[styles.fakeInputComment]}>
                        <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.TEXT_COLOR_TERTIARY}]}>说点好听的</Text>
                      </View>
                    </View>
                  </CustomTouchable>
                )}
                <View style={{backgroundColor: '#000', height: bottom}} />
              </View>
              {workDetail && (
                <View style={styles.side}>
                  <View style={styles.sideItem}>
                    <CustomTouchable onPress={goAuthor}>
                      {workDetail?.avatar ? (
                        <Image source={{uri: workDetail?.avatar}} style={[styles.sideItem, styles.avatar]} />
                      ) : (
                        <Image source={require('../../../assets/avatar_def.png')} style={[styles.sideItem, styles.avatar]} />
                      )}
                    </CustomTouchable>
                  </View>
                  <View style={styles.sideItem}>
                    <CustomTouchable onPress={handleLike}>
                      <View>
                        {workDetail?.liked === BoolEnum.TRUE ? (
                          <Icon name="zuopin_zan80" size={32} color={globalStyleVariables.COLOR_LIKE_RED} />
                        ) : (
                          <Icon name="zuopin_zan80" size={32} color="#fff" />
                        )}
                      </View>
                    </CustomTouchable>
                    <Text style={[globalStyles.fontSecondary, styles.sideItemText]}>{workDetail.numberOfLikes}</Text>
                  </View>
                  <View style={styles.sideItem}>
                    <CustomTouchable onPress={onOpenComment}>
                      <View>
                        <Icon name="zuopin_pinglun80" size={32} color="#fff" />
                      </View>
                    </CustomTouchable>
                    <Text style={[globalStyles.fontSecondary, styles.sideItemText]}>{workDetail.numberOfComments}</Text>
                  </View>
                  <View style={styles.sideItem}>
                    <CustomTouchable onPress={handleCollect}>
                      <View>
                        {workDetail?.collected === BoolEnum.TRUE ? (
                          <Icon name="zuopin_shoucang80" size={32} color={globalStyleVariables.COLOR_COLLECT_YELLOW} />
                        ) : (
                          <Icon name="zuopin_shoucang80" size={32} color="#fff" />
                        )}
                      </View>
                    </CustomTouchable>
                    <Text style={[globalStyles.fontSecondary, styles.sideItemText]}>{workDetail.numberOfCollects}</Text>
                  </View>
                  <View style={styles.sideItem}>
                    <CustomTouchable onPress={handleShare}>
                      <View>
                        <Icon name="zuopin_share80" size={32} color="#fff" />
                      </View>
                    </CustomTouchable>
                  </View>
                </View>
              )}
            </View>
          </CustomTouchable>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default memo(WorkPage);

WorkPage.defaultProps = {
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
  },
  maskUp: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  maskDown: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
    margin: 0,
    height: 30,
    backgroundColor: '#000',
    color: '#fff',
  },
  spuModel: {
    // height: 500,
  },
});
