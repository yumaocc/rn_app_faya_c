import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet, FlatList, ListRenderItemInfo, useWindowDimensions, StatusBar, RefreshControl} from 'react-native';
import {useSelector} from 'react-redux';
import {useRefCallback} from '../../fst/hooks';
import {useParams, useWorkDispatcher} from '../../helper/hooks';
import {WorkF} from '../../models';
import {RootState} from '../../redux/reducers';
import VideoPage from './Videos/VideoPage';

const WorkDetailList: React.FC = () => {
  const params = useParams<{index: number}>();
  const currentTabType = useSelector((state: RootState) => state.work.currentTab.type);
  const works = useSelector((state: RootState) => state.work.works[currentTabType]);
  const videos = useMemo(() => works.list, [works.list]);
  const {height} = useWindowDimensions();
  const [flatListRef, setRef, isReady] = useRefCallback(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  // const [refreshing, setRefreshing] = React.useState(false);
  const refreshing = useMemo(() => works.status === 'loading', [works.status]);

  const [workDispatcher] = useWorkDispatcher();

  function renderVideoPage(info: ListRenderItemInfo<WorkF>) {
    return <VideoPage item={info.item} paused={currentIndex !== info.index} />;
  }
  const handleChangViewableItems = React.useCallback(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length === 1) {
      const i = viewableItems[0].index;
      setCurrentIndex(i);
    }
  }, []);

  useEffect(() => {
    if (currentIndex > videos.length - 3) {
      workDispatcher.loadWork(currentTabType);
    }
  }, [currentIndex, currentTabType, workDispatcher, videos.length]);

  async function handleRefresh() {
    workDispatcher.loadWork(currentTabType, true);
  }

  useEffect(() => {
    if (isReady) {
      setTimeout(() => {
        const index = params.index || 0;
        flatListRef.current?.scrollToIndex({index, animated: false});
        setCurrentIndex(index);
      }, 0);
    }
  }, [params.index, flatListRef, isReady]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        style={{backgroundColor: '#000'}}
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
    </View>
  );
};

export default WorkDetailList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
