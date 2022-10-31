import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, FlatList, ListRenderItemInfo, StatusBar, RefreshControl, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {NavigationBar, Popup} from '../../component';
import {useRefCallback} from '../../fst/hooks';
import {useCommonDispatcher, useDeviceDimensions, useIsLoggedIn, useParams, useSPUDispatcher, useUserDispatcher, useWorkDispatcher} from '../../helper/hooks';
import {FakeNavigation, PackageDetail, SKUDetail, WorkF} from '../../models';
import {RootState} from '../../redux/reducers';
import BuyBar from '../spu/BuyBar';
import SPUDetailView from '../spu/SPUDetailView';
import WorkPage from './work/WorkPage';
import * as api from '../../apis';
import {BoolEnum} from '../../fst/models';
import {globalStyleVariables} from '../../constants/styles';
import CommentModal, {CommentModalRef} from './work/CommentModal';
import {goLogin} from '../../router/Router';
import SPUShareModal from '../mine/agent/SPUShareModal';
import {getShareSPULink} from '../../helper/order';

const WorkDetailList: React.FC = () => {
  const params = useParams<{index: number}>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSPU, setShowSPU] = useState(false);
  const [isCollect, setIsCollect] = useState(false);
  const [isJoinShowCase, setIsJoinShowCase] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [posterUrl, setPosterUrl] = useState('');

  const commentModalRef = useRef<CommentModalRef>(null);
  const currentTabType = useSelector((state: RootState) => state.work.currentTab.type);
  const works = useSelector((state: RootState) => state.work.works[currentTabType]);
  const videos = useMemo(() => works.list, [works.list]);
  const refreshing = useMemo(() => works.status === 'loading', [works.status]);
  const currentSPU = useSelector((state: RootState) => state.spu.currentSPU);
  const currentSKU = useSelector((state: RootState) => state.spu.currentSKU);
  const currentSKUIsPackage = useSelector((state: RootState) => state.spu.currentSKUIsPackage);
  const userId = useSelector((state: RootState) => state.user.myDetail?.userId);
  const shareLink = useMemo(() => getShareSPULink(currentSPU?.id, userId), [currentSPU?.id, userId]); // 分享链接

  const isLoggedIn = useIsLoggedIn();
  const {height} = useDeviceDimensions();
  const [flatListRef, setRef, isReady] = useRefCallback(null);
  const navigation = useNavigation<FakeNavigation>();

  const [workDispatcher] = useWorkDispatcher();
  const [spuDispatcher] = useSPUDispatcher();
  const [userDispatcher] = useUserDispatcher();
  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    if (showShare && !posterUrl && currentSPU?.id) {
      api.spu
        .getSharePoster(currentSPU?.id, 2)
        .then(res => {
          if (res) {
            setPosterUrl(res);
          }
        })
        .catch(commonDispatcher.error);
    }
  }, [commonDispatcher, showShare, currentSPU, posterUrl]);

  useEffect(() => {
    if (currentIndex > videos.length - 3) {
      workDispatcher.loadWork(currentTabType);
    }
  }, [currentIndex, currentTabType, workDispatcher, videos.length]);
  useEffect(() => {
    if (isReady) {
      setTimeout(() => {
        const index = params.index || 0;
        flatListRef.current?.scrollToIndex({index, animated: false});
        setCurrentIndex(index);
      }, 0);
    }
  }, [params.index, flatListRef, isReady]);

  async function handleRefresh() {
    workDispatcher.loadWork(currentTabType, true);
  }
  const openSPU = useCallback(
    (id: number) => {
      if (currentSPU?.id !== Number(id)) {
        spuDispatcher.viewSPU(id);
      }
      setShowSPU(true);
    },
    [currentSPU?.id, spuDispatcher],
  );

  const handleChangViewableItems = React.useCallback(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length === 1) {
      const i = viewableItems[0].index;
      setCurrentIndex(i);
    }
  }, []);

  const handleBuy = useCallback(() => {
    setShowSPU(false);
    if (!isLoggedIn) {
      userDispatcher.login({
        to: 'Order',
        params: {index: params.index},
        redirect: true,
      });
    } else {
      navigation.navigate('Order');
    }
  }, [isLoggedIn, userDispatcher, params.index, navigation]);

  const handleChangeSKU = useCallback(
    (sku: SKUDetail | PackageDetail, isPackage: boolean) => {
      spuDispatcher.changeSKU(sku, isPackage);
    },
    [spuDispatcher],
  );

  function openCommentModal(mainId: string, autoFocus = false) {
    commentModalRef.current?.openComment(mainId, autoFocus);
  }

  function openShareModal() {
    setShowSPU(false);
    setShowShare(true);
  }

  function renderVideoPage(info: ListRenderItemInfo<WorkF>) {
    const {item, index} = info;
    const shouldLoad = index === currentIndex || index === currentIndex + 1 || index === currentIndex - 1;
    return (
      <WorkPage
        videoUrl={item.videoUrl}
        coverImage={item.coverImage}
        mainId={item.mainId}
        paused={currentIndex !== index}
        shouldLoad={shouldLoad}
        onShowSPU={openSPU}
        onShowComment={openCommentModal}
      />
    );
  }

  function handleCollect() {
    if (!isLoggedIn) {
      goLogin();
    } else {
      if (isCollect || !currentSPU) {
        return;
      }
      const {collected} = currentSPU;
      const currentIsCollect = collected === BoolEnum.TRUE;
      api.spu
        .collectSPU(currentSPU?.id)
        .then(() => {
          setIsCollect(false);
          commonDispatcher.info(currentIsCollect ? '已取消收藏' : '收藏成功');
          spuDispatcher.changeCurrentSPU({...currentSPU, collected: currentIsCollect ? BoolEnum.FALSE : BoolEnum.TRUE});
        })
        .catch(() => {
          setIsCollect(false);
        });
    }
  }

  function handleJoinShowCase() {
    if (!isLoggedIn) {
      goLogin();
    } else {
      if (isJoinShowCase || !currentSPU) {
        return;
      }
      const {showcaseJoined} = currentSPU;
      const currentIsShowCase = showcaseJoined === BoolEnum.TRUE;
      api.spu
        .joinToShowCase(currentSPU?.id)
        .then(() => {
          setIsJoinShowCase(false);
          commonDispatcher.info(currentIsShowCase ? '已取消展示' : '展示成功');
          spuDispatcher.changeCurrentSPU({...currentSPU, showcaseJoined: currentIsShowCase ? BoolEnum.FALSE : BoolEnum.TRUE});
        })
        .catch(() => {
          // console.log(e);
          setIsJoinShowCase(false);
        });
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <NavigationBar canBack={true} style={styles.nav} color="#fff" />
      <FlatList
        style={{backgroundColor: '#000', flex: 1}}
        data={videos}
        ref={setRef}
        renderItem={renderVideoPage}
        onMoveShouldSetResponder={() => true}
        pagingEnabled={true}
        getItemLayout={(item, index) => ({length: height, offset: height * index, index})}
        onViewableItemsChanged={handleChangViewableItems}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
        }}
        refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={refreshing} colors={['#fff']} tintColor="#fff" title="正在刷新" titleColor="#fff" />}
      />
      {showSPU && (
        <Popup visible={true} onClose={() => setShowSPU(false)} style={[styles.spuModel, {height: height * 0.7}]} useNativeDrive={false}>
          <View style={{flex: 1}}>
            <ScrollView style={{flex: 1}} bounces={false}>
              <SPUDetailView currentSelect={currentSKU} spu={currentSPU} isPackage={currentSKUIsPackage} onChangeSelect={handleChangeSKU} />
            </ScrollView>
            <BuyBar spu={currentSPU} sku={currentSKU} onBuy={handleBuy} onCollect={handleCollect} onAddToShopWindow={handleJoinShowCase} onShare={openShareModal} />
          </View>
        </Popup>
      )}

      <CommentModal ref={commentModalRef} />
      {showShare && <SPUShareModal visible={true} poster={posterUrl} link={shareLink} onClose={() => setShowShare(false)} />}
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
