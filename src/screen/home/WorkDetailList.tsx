import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, FlatList, ListRenderItemInfo, StatusBar, RefreshControl, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {NavigationBar, Popup} from '../../component';
import {useRefCallback} from '../../fst/hooks';
import {useDeviceDimensions, useParams, useSPUDispatcher, useUserDispatcher, useWorkDispatcher} from '../../helper/hooks';
import {FakeNavigation, PackageDetail, SKUDetail, WorkF} from '../../models';
import {RootState} from '../../redux/reducers';
import BuyBar from '../spu/BuyBar';
import SPUDetailView from '../spu/SPUDetailView';
import WorkPage from './work/WorkPage';

const WorkDetailList: React.FC = () => {
  const params = useParams<{index: number}>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSPU, setShowSPU] = useState(false);

  const currentTabType = useSelector((state: RootState) => state.work.currentTab.type);
  const works = useSelector((state: RootState) => state.work.works[currentTabType]);
  const videos = useMemo(() => works.list, [works.list]);
  const refreshing = useMemo(() => works.status === 'loading', [works.status]);
  const currentSPU = useSelector((state: RootState) => state.spu.currentSPU);
  const currentSKU = useSelector((state: RootState) => state.spu.currentSKU);
  const currentSKUIsPackage = useSelector((state: RootState) => state.spu.currentSKUIsPackage);
  const token = useSelector((state: RootState) => state.common.token);

  const {height} = useDeviceDimensions();
  const [flatListRef, setRef, isReady] = useRefCallback(null);
  const navigation = useNavigation<FakeNavigation>();

  const [workDispatcher] = useWorkDispatcher();
  const [spuDispatcher] = useSPUDispatcher();
  const [userDispatcher] = useUserDispatcher();

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
      console.log(111, id);
      if (currentSPU?.id !== id) {
        spuDispatcher.viewSPU(id);
      }
      setShowSPU(true);
    },
    [currentSPU?.id, spuDispatcher],
  );

  const handleChangViewableItems = React.useCallback(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length === 1) {
      const i = viewableItems[0].index;
      console.log('set index', i);
      setCurrentIndex(i);
    }
  }, []);

  const handleBuy = useCallback(() => {
    setShowSPU(false);
    if (!token) {
      userDispatcher.login({
        to: 'Order',
        params: {index: params.index},
        redirect: true,
      });
    } else {
      navigation.navigate('Order');
    }
  }, [token, userDispatcher, params.index, navigation]);

  const handleChangeSKU = useCallback(
    (sku: SKUDetail | PackageDetail, isPackage: boolean) => {
      spuDispatcher.changeSKU(sku, isPackage);
    },
    [spuDispatcher],
  );

  function renderVideoPage(info: ListRenderItemInfo<WorkF>) {
    const {item, index} = info;
    const shouldLoad = index === currentIndex || index === currentIndex + 1 || index === currentIndex - 1;
    return <WorkPage item={item} paused={currentIndex !== index} shouldLoad={shouldLoad} onShowSPU={openSPU} />;
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
            <BuyBar sku={currentSKU} onBuy={handleBuy} />
          </View>
        </Popup>
      )}
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
