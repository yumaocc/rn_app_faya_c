import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, ScrollView, StatusBar} from 'react-native';
import {FakeNavigation, PackageDetail, SKUDetail, WorkDetailF} from '../../../models';
import * as api from '../../../apis';
import {useCommonDispatcher, useDeviceDimensions, useIsLoggedIn, useParams, useSPUDispatcher} from '../../../helper/hooks';
import WorkPage from './WorkPage';
import {NavigationBar, Popup} from '../../../component';
import SPUDetailView from '../../spu/SPUDetailView';
import BuyBar from '../../spu/BuyBar';
import CommentModal, {CommentModalRef} from './CommentModal';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import {BoolEnum} from '../../../fst/models';
import {goLogin} from '../../../router/Router';
import {useNavigation} from '@react-navigation/native';
import {getShareSPULink} from '../../../helper/order';
import SPUShareModal from '../../mine/agent/SPUShareModal';

const SingleWorkDetail: React.FC = () => {
  const [workDetail, setWorkDetail] = useState<WorkDetailF>(null);
  const [showSPU, setShowSPU] = useState(false);
  const [isCollect, setIsCollect] = useState(false);
  const [isJoinShowCase, setIsJoinShowCase] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [posterUrl, setPosterUrl] = useState('');

  const currentSPU = useSelector((state: RootState) => state.spu.currentSPU);
  const currentSKU = useSelector((state: RootState) => state.spu.currentSKU);
  const currentSKUIsPackage = useSelector((state: RootState) => state.spu.currentSKUIsPackage);

  const userId = useSelector((state: RootState) => state.user.myDetail?.userId);
  const shareLink = useMemo(() => getShareSPULink(currentSPU?.id, userId), [currentSPU?.id, userId]); // 分享链接

  const {id} = useParams<{id: string}>();
  const {height} = useDeviceDimensions();
  const commentModalRef = useRef<CommentModalRef>(null);

  const isLoggedIn = useIsLoggedIn();
  const [spuDispatcher] = useSPUDispatcher();
  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation<FakeNavigation>();

  useEffect(() => {
    api.work
      .getWorkDetail(id)
      .then(res => {
        setWorkDetail(res);
      })
      .catch(commonDispatcher.error);
  }, [commonDispatcher.error, id]);

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

  const openSPU = useCallback(
    (id: number) => {
      if (currentSPU?.id !== Number(id)) {
        spuDispatcher.viewSPU(id);
      }
      setShowSPU(true);
    },
    [currentSPU?.id, spuDispatcher],
  );

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

  const handleBuy = useCallback(() => {
    setShowSPU(false);
    if (!isLoggedIn) {
      goLogin();
    } else {
      navigation.navigate('Order');
    }
  }, [isLoggedIn, navigation]);

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

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <NavigationBar color="#fff" style={styles.nav} />
      {workDetail && (
        <WorkPage
          coverImage={workDetail.coverImage}
          videoUrl={workDetail?.videoUrl}
          mainId={workDetail.mainId}
          paused={false}
          shouldLoad={true}
          onShowSPU={openSPU}
          onShowComment={openCommentModal}
        />
      )}
      {showSPU && (
        <Popup visible={true} onClose={() => setShowSPU(false)} style={[{height: height * 0.7}]} useNativeDrive={false}>
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

export default SingleWorkDetail;

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
});
