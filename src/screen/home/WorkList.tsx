import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useRef} from 'react';
import {View, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Text, RefreshControl} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useDivideData} from '../../helper/hooks';
import {FakeNavigation, WorkF, WorkList as IWorkList} from '../../models';
import {dictLoadingState} from '../../helper/dictionary';
// import {useWhyDidYouUpdate} from '../../fst/hooks';
import WorkItem from './work/WorkItem';
// import FastImage from 'react-native-fast-image';

interface WorkListProps {
  list: IWorkList;
  onLoadMore?: () => void;
  onRefresh?: () => Promise<void>;
}

const WorkList: React.FC<WorkListProps> = props => {
  const {list, status} = props.list;
  const [refreshing, setRefreshing] = React.useState(false);

  const [l, r] = useDivideData(list);

  const scroll = useRef<ScrollView>(null);
  const navigation = useNavigation<FakeNavigation>();

  // useWhyDidYouUpdate('render workList', {...props, refreshing});

  function emitLoadMore() {
    props.onLoadMore && props.onLoadMore();
  }

  function emitRefresh() {
    props.onRefresh && props.onRefresh();
  }

  function endDrag(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (offsetY < -50) {
      emitRefresh();
    }
  }
  async function handleRefresh() {
    setRefreshing(true);
    // todo: 异步加载，状态应该取redux中的
    await emitRefresh();
    setRefreshing(false);
  }

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var scrollViewHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    const offset = 50;
    const isReachBottom = offsetY + scrollViewHeight + offset >= contentSizeHeight;
    // checkPullToRefresh(offsetY);
    if (isReachBottom) {
      emitLoadMore();
    }
  }

  const handleClickWork = useCallback(
    (work: WorkF, index: number) => {
      // console.log('i: ', index);
      navigation.navigate('WorkStream', {
        index,
        type: 'home',
        work,
      });
      // navigation.navigate('WorkDetailList', {index});
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        ref={scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            title="下拉刷新"
            colors={[globalStyleVariables.COLOR_PRIMARY]}
            titleColor={globalStyleVariables.COLOR_PRIMARY}
            tintColor={globalStyleVariables.COLOR_PRIMARY}
          />
        }
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={100}
        onScrollEndDrag={endDrag}>
        <View style={styles.itemContainer}>
          <View style={styles.left}>
            {l.map((v, i) => {
              const key = `${v.mainId}-${i}-l`;
              const index = i * 2;
              return <WorkItem work={v} key={key} index={index} onSelect={handleClickWork} />;
            })}
          </View>
          <View style={styles.right}>
            {r.map((v, i) => {
              const key = `${v.mainId}-${i}-r`;
              const index = i * 2 + 1;
              return <WorkItem work={v} key={key} index={index} onSelect={handleClickWork} />;
            })}
          </View>
        </View>
        <View style={[globalStyles.containerCenter, {paddingVertical: globalStyleVariables.MODULE_SPACE}]}>
          <Text>{dictLoadingState(status)}</Text>
        </View>
      </ScrollView>
    </View>
  );
};
WorkList.defaultProps = {
  // title: 'WorkList',
};
export default memo(WorkList);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    width: '100%',
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 1,
    marginLeft: globalStyleVariables.MODULE_SPACE,
  },
  item: {
    width: '100%',
    marginTop: 10,
  },
  cover: {
    width: '100%',
    height: 220,
    borderRadius: 8,
  },
  smallCover: {
    width: '100%',
    height: 124,
    borderRadius: 8,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  playIcon: {
    position: 'absolute',
    right: globalStyleVariables.MODULE_SPACE,
    top: globalStyleVariables.MODULE_SPACE,
  },
  palyIconImage: {
    width: 24,
    height: 24,
  },
});
