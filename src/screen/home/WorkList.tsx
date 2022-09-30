// import {Button} from '@ant-design/react-native';
import {Icon} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Image, Text, TouchableOpacity} from 'react-native';
import * as api from '../../apis';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
// import {cicadaBool} from '../../fst/helper';
import {SearchParam} from '../../fst/models';
import {useCommonDispatcher, useDivideData} from '../../helper/hooks';
import {FakeNavigation, WorkF, WorkType} from '../../models';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface WorkListProps {
  // title?: string;
}

const WorkList: React.FC<WorkListProps> = () => {
  const [works, setWorks] = useState<WorkF[]>([]);
  const [l, r] = useDivideData(works);
  const [pageIndex, setPageIndex] = useState(1);

  const scroll = useRef<ScrollView>(null);
  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation<FakeNavigation>();

  const fetchData = useCallback(
    async (params: SearchParam) => {
      try {
        return await api.work.getRecommendWorks(params);
      } catch (error) {
        commonDispatcher.error(error);
      }
    },
    [commonDispatcher],
  );

  useEffect(() => {
    async function f() {
      const res = await fetchData({pageIndex, pageSize: 10});
      console.log(res);
      setWorks((res as WorkF[]) || []);
    }
    if (!fetchData) {
      return;
    }
    f();
  }, [pageIndex, fetchData]);

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    // console.log(e.nativeEvent);
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var scrollViewHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    const offset = 50;
    const isReachBottom = offsetY + scrollViewHeight + offset >= contentSizeHeight;
    if (isReachBottom) {
      console.log('滑动到底部');
    }
  }

  function renderWorkItem(work: WorkF, index: number, isLeft = false) {
    // const isFirst = index === 0;
    // const normal = isLeft ? cicadaBool(index) && !isFirst : cicadaBool(index) || isFirst;
    console.log(isLeft);

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
              <Image source={{uri: 'https://fakeimg.pl/100?text=l'}} style={styles.avatar} />
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
          <View style={styles.left}>{l.map((work, index) => renderWorkItem(work, index, true))}</View>
          <View style={styles.right}>{r.map((work, index) => renderWorkItem(work, index))}</View>
        </View>
      </ScrollView>
    </View>
  );
};
WorkList.defaultProps = {
  title: 'WorkList',
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
