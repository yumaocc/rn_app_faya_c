import React, {useCallback, useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView, StatusBar, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAndroidBack, useCommonDispatcher, useParams, useSPUDispatcher, useUserDispatcher} from '../../helper/hooks';
import {FakeNavigation, PackageDetail, SKUDetail, SPUDetailF} from '../../models';

import SPUDetailView from './SPUDetailView';
import BuyBar from './BuyBar';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NavigationBar} from '../../component';
import * as api from '../../apis';
import {BoolEnum} from '../../fst/models';

const SPUDetail: React.FC = () => {
  const {id} = useParams<{id: number}>();
  const token = useSelector((state: RootState) => state.common.token);
  const spu: SPUDetailF = useSelector((state: RootState) => state.spu.currentSPU);
  const currentSKU: PackageDetail | SKUDetail = useSelector((state: RootState) => state.spu.currentSKU);
  const isPackage: boolean = useSelector((state: RootState) => state.spu.currentSKUIsPackage);
  const [titleOpacity, setTitleOpacity] = React.useState(0);
  const [isCollect, setIsCollect] = React.useState(false);
  const [isJoinShowCase, setIsJoinShowCase] = React.useState(false);

  const [userDispatcher] = useUserDispatcher();
  const [spuDispatcher] = useSPUDispatcher();
  const [commonDispatcher] = useCommonDispatcher();
  const isFocused = useIsFocused();

  useAndroidBack();

  // 如果有其他页面修改了redux中的spu，返回该页面时需要重新加载spu
  useEffect(() => {
    if (!isFocused) {
      return;
    }
    if (!spu || spu.id !== id) {
      spuDispatcher.viewSPU(id);
    }
  }, [id, spuDispatcher, spu, isFocused]);

  useEffect(() => {
    return () => {
      spuDispatcher.closeViewSPU();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const {bottom: safeBottom} = useSafeAreaInsets();
  const navigation = useNavigation<FakeNavigation>();

  function handleBuy() {
    if (!token) {
      userDispatcher.login({
        to: 'Order',
        params: {id},
        redirect: true,
      });
    } else {
      navigation.navigate('Order', {id});
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

  function handleCollect() {
    if (!token) {
      navigation.replace('Login', {to: 'SPUDetail', params: {id}});
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
          commonDispatcher.info(currentIsCollect ? '已取消收藏' : '收藏成功');
          spuDispatcher.changeCurrentSPU({...spu, collected: currentIsCollect ? BoolEnum.FALSE : BoolEnum.TRUE});
        })
        .catch(() => {
          setIsCollect(false);
        });
    }
  }

  function handleJoinShowCase() {
    if (!token) {
      navigation.replace('Login', {to: 'SPUDetail', params: {id}});
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
          commonDispatcher.info(currentIsShowCase ? '已取消展示' : '展示成功');
          spuDispatcher.changeCurrentSPU({...spu, showcaseJoined: currentIsShowCase ? BoolEnum.FALSE : BoolEnum.TRUE});
        })
        .catch(() => {
          // console.log(e);
          setIsJoinShowCase(false);
        });
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {titleOpacity > 0.2 && <NavigationBar title="商品详情" style={[styles.navigation, {opacity: titleOpacity}]} />}
      <ScrollView style={{flex: 1}} onScroll={handleScroll} scrollEventThrottle={16}>
        {spu ? <SPUDetailView isPackage={isPackage} currentSelect={currentSKU} spu={spu} onChangeSelect={handleChangeSKU} /> : <Text>loading...</Text>}
      </ScrollView>
      <View style={[{paddingBottom: safeBottom, backgroundColor: '#fff'}]}>
        <BuyBar spu={spu} sku={currentSKU} onBuy={handleBuy} onCollect={handleCollect} onAddToShopWindow={handleJoinShowCase} />
      </View>
    </View>
  );
};
export default SPUDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigation: {
    position: 'absolute',
    backgroundColor: '#fff',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 10,
  },
});
