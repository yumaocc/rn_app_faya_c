import {Icon} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useRef} from 'react';
import {View, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Image, Text, TouchableOpacity} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useDivideData} from '../../helper/hooks';
import {FakeNavigation, WorkF, WorkList as IWorkList, WorkType} from '../../models';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {dictLoadingState} from '../../helper/dictionary';

interface WorkListProps {
  list: IWorkList;
  onLoadMore?: () => void;
  onRefresh?: () => void;
}

const WorkList: React.FC<WorkListProps> = props => {
  const {list, status} = props.list;

  const [l, r] = useDivideData(list);

  const scroll = useRef<ScrollView>(null);
  const navigation = useNavigation<FakeNavigation>();

  function emitLoadMore() {
    console.log('去加载');
    props.onLoadMore && props.onLoadMore();
  }

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var scrollViewHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    const offset = 50;
    const isReachBottom = offsetY + scrollViewHeight + offset >= contentSizeHeight;
    if (isReachBottom) {
      emitLoadMore();
    }
  }

  function renderWorkItem(work: WorkF) {
    // const isFirst = index === 0;
    // const normal = isLeft ? cicadaBool(index) && !isFirst : cicadaBool(index) || isFirst;
    return (
      <View style={styles.item} key={work.mainId}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('WorkDetail', {id: work.mainId, videoUrl: work.videoUrl})}>
          <View style={{width: '100%', position: 'relative'}}>
            <Image source={{uri: work?.coverImage || 'https://fakeimg.pl/100?text=l'}} style={true ? styles.cover : styles.smallCover} />
            {work.type === WorkType.Video && (
              <View style={[styles.playIcon]}>
                <MaterialIcon name="play-circle-filled" size={33} />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <View style={[{padding: globalStyleVariables.MODULE_SPACE}]}>
          <Text style={[globalStyles.fontStrong, {fontSize: 15}]} numberOfLines={2}>
            {work.content || '暂无描述'}
          </Text>
          <View style={[globalStyles.containerLR, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]}>
            <View style={[globalStyles.containerRow, {flex: 1}]}>
              {work?.userAvatar ? <Image source={{uri: work.userAvatar}} style={styles.avatar} /> : <Image source={require('../../assets/avatar_def.png')} style={styles.avatar} />}
              <Text style={[globalStyles.fontPrimary, {marginLeft: 3, flex: 1}]} numberOfLines={1}>
                {work.userName}
              </Text>
            </View>
            <View style={globalStyles.containerRow}>
              <Icon name="heart" size={20} />
              <Text style={[globalStyles.fontPrimary, {marginLeft: 3}]}>{work.numberOfLikes}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} ref={scroll} onMomentumScrollEnd={handleScrollEnd}>
        <View style={styles.itemContainer}>
          <View style={styles.left}>{l.map(renderWorkItem)}</View>
          <View style={styles.right}>{r.map(renderWorkItem)}</View>
        </View>
        <View style={globalStyles.containerCenter}>
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
    backgroundColor: '#f4f4f4',
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
});
