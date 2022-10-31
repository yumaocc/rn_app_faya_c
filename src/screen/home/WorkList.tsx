import {useNavigation} from '@react-navigation/native';
import React, {useRef} from 'react';
import {View, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Image, Text, TouchableOpacity, RefreshControl} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useDivideData} from '../../helper/hooks';
import {FakeNavigation, WorkF, WorkList as IWorkList, WorkType} from '../../models';
import Icon from '../../component/Icon';
import {dictLoadingState} from '../../helper/dictionary';
import {BoolEnum} from '../../fst/models';

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
  function renderWorkItem(work: WorkF, index: number, left = false) {
    if (left) {
      index = index * 2;
    } else {
      index = index * 2 + 1;
    }
    return (
      <View style={styles.item} key={`${work.mainId}-${index}-${left ? 'l' : 'r'}`}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('WorkDetailList', {index})}>
          <View style={{width: '100%', position: 'relative'}}>
            <Image source={{uri: work?.coverImage}} defaultSource={require('../../assets/sku_def_180w.png')} style={true ? styles.cover : styles.smallCover} />
            {work.type === WorkType.Video && (
              <View style={[styles.playIcon]}>
                <Image source={require('../../assets/zuopin_tag_video.png')} style={styles.palyIconImage} />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <View style={[{padding: globalStyleVariables.MODULE_SPACE}]}>
          <Text style={[globalStyles.fontStrong, {fontSize: 15}]} numberOfLines={2}>
            {work.content || '暂无描述'}
          </Text>
          <View style={[globalStyles.containerLR, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]}>
            <View style={[globalStyles.containerRow, {flex: 1, marginRight: 5}]}>
              {work?.userAvatar ? <Image source={{uri: work.userAvatar}} style={styles.avatar} /> : <Image source={require('../../assets/avatar_def.png')} style={styles.avatar} />}
              <Text style={[globalStyles.fontPrimary, {marginLeft: 3, flex: 1}]} numberOfLines={1}>
                {work.userName}
              </Text>
            </View>
            <View style={globalStyles.containerRow}>
              {work.liked === BoolEnum.TRUE ? (
                <Icon name="home_zuopin_zan_sel20" size={15} color={globalStyleVariables.COLOR_LIKE_RED} />
              ) : (
                <Icon name="home_zuopin_zan_nor20" size={15} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
              )}
              <Text style={[globalStyles.fontPrimary, {marginLeft: 3}]}>{work.numberOfLikes}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

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
          <View style={styles.left}>{l.map((v, i) => renderWorkItem(v, i, true))}</View>
          <View style={styles.right}>{r.map((v, i) => renderWorkItem(v, i))}</View>
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
export default WorkList;
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
    // backgroundColor: '#6cf',
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
    // backgroundColor: '#6cf',
  },
  cover: {
    width: '100%',
    height: 220,
    borderRadius: 5,
  },
  smallCover: {
    width: '100%',
    height: 124,
    borderRadius: 5,
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
