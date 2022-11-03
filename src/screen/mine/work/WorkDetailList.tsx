import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, FlatList, ListRenderItemInfo, RefreshControl, LayoutChangeEvent} from 'react-native';
import {useSelector} from 'react-redux';
import {NavigationBar} from '../../../component';
import {useRefCallback} from '../../../fst/hooks';
import {useCommonDispatcher, useDeviceDimensions, useParams, useUserDispatcher} from '../../../helper/hooks';
import {FakeNavigation, WorkF} from '../../../models';
import {RootState} from '../../../redux/reducers';
// import BuyBar from '../../spu/BuyBar';
import WorkPage from '../../home/work/WorkPage';
import CommentModal, {CommentModalRef} from '../../home/work/CommentModal';
import * as api from '../../../apis';
import {useNavigation} from '@react-navigation/native';
import {getShareWorkLink} from '../../../helper/order';
import WorkShareModal from '../agent/WorkShareModal';
import MyStatusBar from '../../../component/MyStatusBar';
import {getSPUNavigateParam} from '../../../helper/spu';
import {inRange} from 'lodash';

const WorkDetailList: React.FC = () => {
  const params = useParams<{index: number}>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showShareWork, setShowShareWork] = useState(false);
  const [workSharePosterUrl, setWorkSharePosterUrl] = useState('');
  const [workShareLink, setWorkShareLink] = useState('');
  const [dimension, setDimension] = useState({width: 0, height: 0, ready: false});

  const currentTabType = useSelector((state: RootState) => state.user.currentTabType);
  const works = useSelector((state: RootState) => state.user.myWorks[currentTabType]);
  const videos = useMemo(() => works.list, [works.list]);
  const userId = useSelector((state: RootState) => state.user.myDetail?.userId);

  const windowDimensions = useDeviceDimensions();
  const [flatListRef, setRef] = useRefCallback(null);
  const commentModalRef = useRef<CommentModalRef>(null);
  const navigation = useNavigation<FakeNavigation>();

  const [userDispatcher] = useUserDispatcher();
  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    if (currentIndex > videos.length - 3) {
      userDispatcher.loadMyWork(currentTabType);
    }
  }, [currentIndex, currentTabType, userDispatcher, videos.length]);
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
    userDispatcher.loadMyWork(currentTabType, true);
  }
  const openSPU = useCallback(
    (id: number) => {
      navigation.navigate(getSPUNavigateParam(id));
    },
    [navigation],
  );

  const handleChangViewableItems = React.useCallback(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length === 1) {
      const i = viewableItems[0].index;
      setCurrentIndex(i);
    }
  }, []);

  function handleOpenComment(mainId: string, autoFocus = false) {
    commentModalRef.current?.openComment(mainId, autoFocus);
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
        height={height}
        width={width}
        videoUrl={item.videoUrl}
        coverImage={item.coverImage}
        mainId={item.mainId}
        paused={currentIndex !== index}
        shouldLoad={shouldLoad}
        onShowSPU={openSPU}
        onShowShare={handleShareWork}
        onShowComment={handleOpenComment}
      />
    );
  }
  return (
    <View style={styles.container}>
      <MyStatusBar barStyle="light-content" />
      <NavigationBar canBack={true} style={styles.nav} color="#fff" />
      <FlatList
        style={{backgroundColor: '#000', flex: 1}}
        data={videos}
        onLayout={handleLayout}
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
      {/* {showSPU && (
        <Popup visible={true} onClose={() => setShowSPU(false)} style={[styles.spuModel, {height: height * 0.7}]} useNativeDrive={false}>
          <View style={{flex: 1}}>
            <ScrollView style={{flex: 1}} bounces={false}>
              <SPUDetailView currentSelect={currentSKU} spu={currentSPU} isPackage={currentSKUIsPackage} onChangeSelect={handleChangeSKU} />
            </ScrollView>
            <BuyBar spu={currentSPU} sku={currentSKU} onBuy={handleBuy} onCollect={handleCollect} onAddToShopWindow={handleJoinShowCase} onShare={openShareModal} />
          </View>
        </Popup>
      )} */}
      <CommentModal ref={commentModalRef} />
      {/* {showShare && <SPUShareModal visible={true} poster={posterUrl} link={shareLink} onClose={() => setShowShare(false)} />} */}
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
});
