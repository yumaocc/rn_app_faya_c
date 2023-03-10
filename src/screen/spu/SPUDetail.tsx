import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView, StatusBar, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAndroidBack, useCommonDispatcher, useIsLoggedIn, useParams, useSPUDispatcher, useUserDispatcher, useWorkDispatcher} from '../../helper/hooks';
import {FakeNavigation, LocationNavigateInfo, PackageDetail, SKUDetail, SKUSaleState, SPUDetailF} from '../../models';

import SPUDetailView from './SPUDetailView';
import BuyBar from './BuyBar';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NavigationBar} from '../../component';
import * as api from '../../apis';
import {BoolEnum} from '../../fst/models';
import Loading from '../../component/Loading';
import {goLogin} from '../../router/Router';
import SPUShareModal from '../mine/agent/SPUShareModal';
import {getShareSPULink} from '../../helper/order';
import {openMap} from '../../helper/system';
import NavigationModal from '../common/NavigateModal';
import MyStatusBar from '../../component/MyStatusBar';
import {useLog} from '../../fst/hooks';

const SPUDetail: React.FC = () => {
  const {id, workMainId} = useParams<{id: number; workMainId: string}>();
  const [titleOpacity, setTitleOpacity] = useState(0);
  const [isCollect, setIsCollect] = useState(false);
  const [isJoinShowCase, setIsJoinShowCase] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [posterUrl, setPosterUrl] = useState('');
  const [showSelectMap, setShowSelectMap] = useState(false);
  const [navigationInfo, setNavigationInfo] = useState<LocationNavigateInfo>(null);
  // const [showPreview, setShowPreview] = useState(false);

  const spu: SPUDetailF = useSelector((state: RootState) => state.spu.currentSPU);
  const currentSKU: PackageDetail | SKUDetail = useSelector((state: RootState) => state.spu.currentSKU);
  const isPackage: boolean = useSelector((state: RootState) => state.spu.currentSKUIsPackage);
  const userId = useSelector((state: RootState) => state.user.myDetail?.userId);
  const shareLink = useMemo(() => getShareSPULink(id, String(userId)), [id, userId]); // ????????????

  const isLoggedIn = useIsLoggedIn();
  const [userDispatcher] = useUserDispatcher();
  const [workDispatcher] = useWorkDispatcher();
  const [spuDispatcher] = useSPUDispatcher();
  const [commonDispatcher] = useCommonDispatcher();
  const isFocused = useIsFocused();

  useLog('spuDetail', spu);

  useAndroidBack();

  // ??????????????????????????????redux??????spu???????????????????????????????????????spu
  useEffect(() => {
    if (!isFocused) {
      return;
    }
    if (!spu || String(spu.id) !== String(id)) {
      spuDispatcher.viewSPU(id);
    }
  }, [id, spuDispatcher, spu, isFocused]);

  useEffect(() => {
    if (showShare && !posterUrl) {
      api.spu
        .getSharePoster(id, 2)
        .then(res => {
          if (res) {
            setPosterUrl(res);
          }
        })
        .catch(commonDispatcher.error);
    }
  }, [commonDispatcher, showShare, id, posterUrl]);

  useEffect(() => {
    return () => {
      spuDispatcher.closeViewSPU();
    };
  }, [spuDispatcher]);

  const {bottom: safeBottom} = useSafeAreaInsets();
  const navigation = useNavigation<FakeNavigation>();

  function handleBuy() {
    if (!isLoggedIn) {
      userDispatcher.login({
        to: 'Order',
        params: {workMainId},
        behavior: 'push',
        skipBehavior: 'back',
        completeBehavior: 'replace',
      });
    } else {
      if (currentSKU?.saleStatus !== SKUSaleState.ON_SALE) {
        return commonDispatcher.error('??????????????????');
      }
      navigation.navigate('Order', {workMainId});
    }
  }

  const handleChangeSKU = useCallback(
    (sku: SKUDetail | PackageDetail, isPackage: boolean) => {
      spuDispatcher.changeSKU(sku, isPackage);
    },
    [spuDispatcher],
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isFocused) {
        return;
      }
      const threshold = 200;
      const {y} = e.nativeEvent.contentOffset;
      const current = Math.min(y, threshold);
      const opacity = Math.min(1, Math.max(0, current / threshold));
      if (opacity === 1) {
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('light-content');
      }
      setTitleOpacity(opacity);
    },
    [isFocused],
  );

  // ???????????????
  function handleShare() {
    if (!isLoggedIn) {
      goLogin();
    } else {
      setShowShare(true);
    }
  }

  function handleCollect() {
    if (!isLoggedIn) {
      goLogin();
    } else {
      if (isCollect) {
        return;
      }
      const {collected} = spu;
      const currentIsCollect = collected === BoolEnum.TRUE;
      api.spu
        .collectSPU(id)
        .then(() => {
          setIsCollect(false);
          commonDispatcher.info(currentIsCollect ? '???????????????' : '????????????');
          spuDispatcher.changeCurrentSPU({...spu, collected: currentIsCollect ? BoolEnum.FALSE : BoolEnum.TRUE});
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
      if (isJoinShowCase) {
        return;
      }
      const {showcaseJoined} = spu;
      const currentIsShowCase = showcaseJoined === BoolEnum.TRUE;
      api.spu
        .joinToShowCase(id)
        .then(() => {
          setIsJoinShowCase(false);
          commonDispatcher.info(currentIsShowCase ? '???????????????' : '????????????');
          spuDispatcher.changeCurrentSPU({...spu, showcaseJoined: currentIsShowCase ? BoolEnum.FALSE : BoolEnum.TRUE});
        })
        .catch(() => {
          setIsJoinShowCase(false);
        });
    }
  }

  // async function handleSavePoster() {
  //   try {
  //     await saveImageToGallery(posterUrl);
  //     commonDispatcher.info('????????????');
  //   } catch (error) {
  //     commonDispatcher.error(error);
  //   }
  // }

  // function handleCopyLink() {
  //   // todo: ????????????
  // }

  // function handlePreviewPoster() {
  //   setShowShare(false);
  //   setShowPreview(true);
  // }
  // function handleClosePreview() {
  //   setShowPreview(false);
  // }
  // function handleCloseShare() {
  //   setShowShare(false);
  // }

  function onShootVideo(spu: SPUDetailF) {
    workDispatcher.setWorkSPU(spu);
    navigation.navigate('ShootVideo');
  }

  const goNavigation = useCallback((locationInfo: LocationNavigateInfo) => {
    setNavigationInfo(locationInfo);
    setShowSelectMap(true);
  }, []);

  return (
    <View style={styles.container}>
      <MyStatusBar barStyle="light-content" />
      {titleOpacity > 0.2 && <NavigationBar title="????????????" style={[styles.navigation, {opacity: titleOpacity}]} />}
      <ScrollView style={{flex: 1}} onScroll={handleScroll} scrollEventThrottle={16}>
        {spu ? (
          <SPUDetailView isPackage={isPackage} currentSelect={currentSKU} spu={spu} onChangeSelect={handleChangeSKU} onNavigation={goNavigation} onShootVideo={onShootVideo} />
        ) : (
          <Loading style={{marginTop: 150}} />
        )}
      </ScrollView>
      {!!spu && (
        <View style={[{paddingBottom: safeBottom, backgroundColor: '#fff'}]}>
          <BuyBar spu={spu} sku={currentSKU} onBuy={handleBuy} onCollect={handleCollect} onAddToShopWindow={handleJoinShowCase} onShare={handleShare} />
        </View>
      )}
      {/* ???????????? */}
      {showShare && <SPUShareModal visible={true} poster={posterUrl} link={shareLink} onClose={() => setShowShare(false)} />}
      {/* {showPreview && (
        <Modal isVisible={true} style={{margin: 0, flex: 1}} onBackdropPress={handleClosePreview} onBackButtonPress={handleClosePreview} useNativeDriver={false}>
          <ImageViewer imageUrls={[{url: posterUrl, originUrl: posterUrl}]} index={0} enableSwipeDown={true} onSwipeDown={handleClosePreview} />
        </Modal>
      )} */}
      {showSelectMap && <NavigationModal visible={true} onClose={() => setShowSelectMap(false)} onSelect={app => openMap(navigationInfo, app)} />}
    </View>
  );
};
export default SPUDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navigation: {
    position: 'absolute',
    backgroundColor: '#fff',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 10,
  },
  posterModal: {
    // alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  posterButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
