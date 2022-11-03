import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, FlatList, ListRenderItemInfo, RefreshControl, LayoutChangeEvent} from 'react-native';
import {useSelector} from 'react-redux';
import {NavigationBar} from '../../component';
import {useRefCallback} from '../../fst/hooks';
import {useCommonDispatcher, useDeviceDimensions, useParams, useWorkDispatcher} from '../../helper/hooks';
import {FakeNavigation, WorkF} from '../../models';
import {RootState} from '../../redux/reducers';
import WorkPage from './work/WorkPage';
import * as api from '../../apis';
import {globalStyleVariables} from '../../constants/styles';
import CommentModal, {CommentModalRef} from './work/CommentModal';
import {getShareWorkLink} from '../../helper/order';
import WorkShareModal from '../mine/agent/WorkShareModal';
import MyStatusBar from '../../component/MyStatusBar';
import {getSPUNavigateParam} from '../../helper/spu';
import {inRange} from 'lodash';

const WorkDetailList: React.FC = () => {
  const params = useParams<{index: number}>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showShareWork, setShowShareWork] = useState(false);
  const [workSharePosterUrl, setWorkSharePosterUrl] = useState('');
  const [workShareLink, setWorkShareLink] = useState('');
  const [dimension, setDimension] = useState({width: 0, height: 0, ready: false});

  const commentModalRef = useRef<CommentModalRef>(null);
  const currentTabType = useSelector((state: RootState) => state.work.currentTab.type);
  const works = useSelector((state: RootState) => state.work.works[currentTabType]);
  const videos = useMemo(() => works.list, [works.list]);
  const userId = useSelector((state: RootState) => state.user.myDetail?.userId);

  const windowDimensions = useDeviceDimensions();
  const [flatListRef, setRef] = useRefCallback<FlatList>(null);
  const navigation = useNavigation<FakeNavigation>();

  const [workDispatcher] = useWorkDispatcher();
  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    if (currentIndex > videos.length - 3) {
      workDispatcher.loadWork(currentTabType);
    }
  }, [currentIndex, currentTabType, workDispatcher, videos.length]);
  useEffect(() => {
    if (dimension.ready) {
      setTimeout(() => {
        const index = params.index || 0;
        flatListRef.current?.scrollToIndex({index, animated: false});
        setCurrentIndex(index);
      }, 0);
    }
  }, [params.index, flatListRef, dimension.ready]);

  async function handleRefresh() {
    workDispatcher.loadWork(currentTabType, true);
  }
  const openSPU = useCallback(
    (id: number, mainId: string) => {
      navigation.navigate(getSPUNavigateParam(id, mainId));
    },
    [navigation],
  );

  const handleChangViewableItems = React.useCallback(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length === 1) {
      const i = viewableItems[0].index;
      setCurrentIndex(i);
    }
  }, []);

  function openCommentModal(mainId: string, autoFocus = false) {
    commentModalRef.current?.openComment(mainId, autoFocus);
  }

  function renderVideoPage(info: ListRenderItemInfo<WorkF>) {
    const {item, index} = info;
    const shouldLoad = index === currentIndex || index === currentIndex + 1 || index === currentIndex - 1;
    const shouldRender = inRange(index, currentIndex - 2, currentIndex + 3);
    let {height, width} = windowDimensions;
    if (dimension.ready) {
      height = dimension.height;
      width = dimension.width;
    }
    if (!shouldRender) {
      return <View style={{backgroundColor: '#000', height, width}} />;
    }
    return (
      <WorkPage
        width={width}
        height={height}
        videoUrl={item.videoUrl}
        coverImage={item.coverImage}
        mainId={item.mainId}
        paused={currentIndex !== index}
        shouldLoad={shouldLoad}
        onShowSPU={spuId => openSPU(spuId, item.mainId)}
        onShowShare={handleShareWork}
        onShowComment={openCommentModal}
      />
    );
  }

  function handleShareWork(mainId: string) {
    setWorkShareLink(getShareWorkLink(mainId, userId));

    api.spu
      .getSharePoster(mainId, 1)
      .then(res => {
        if (res) {
          setWorkSharePosterUrl(res);
          setShowShareWork(true);
        }
      })
      .catch(commonDispatcher.error);
  }

  function handleLayout(e: LayoutChangeEvent) {
    const {width, height} = e.nativeEvent.layout;
    setDimension({width, height, ready: true});
  }

  function getItemLayout(item: WorkF[], index: number) {
    let height = windowDimensions.height;
    if (dimension.ready) {
      height = dimension.height;
    }
    return {length: height, offset: dimension.height * index, index};
  }

  return (
    <View style={styles.container}>
      <MyStatusBar barStyle="light-content" />
      <NavigationBar canBack={true} style={styles.nav} color="#fff" />
      <FlatList
        onLayout={handleLayout}
        style={{backgroundColor: '#000', flex: 1}}
        data={videos}
        ref={setRef}
        renderItem={renderVideoPage}
        onMoveShouldSetResponder={() => true}
        pagingEnabled={true}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={handleChangViewableItems}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
        }}
        refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={false} colors={['#fff']} tintColor="#fff" title="正在刷新" titleColor="#fff" />}
      />

      <CommentModal ref={commentModalRef} />
      {showShareWork && <WorkShareModal visible={true} poster={workSharePosterUrl} link={workShareLink} onClose={() => setShowShareWork(false)} />}
    </View>
  );
};

export default WorkDetailList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nav: {
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  spuModel: {},
  commentModel: {},
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentInput: {
    height: 40,
    margin: 0,
    padding: 0,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    flex: 1,
    backgroundColor: '#0000000D',
    borderRadius: 5,
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
});
