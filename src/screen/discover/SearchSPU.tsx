import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NavigationSearchBar} from '../../component';
import {FakeNavigation, LoadingState, SPUF} from '../../models';
import * as api from '../../apis';
import {isReachBottom} from '../../helper/system';
import {SearchParam} from '../../fst/models';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {dictLoadingState} from '../../helper/dictionary';
import MyStatusBar from '../../component/MyStatusBar';
import SPUCard from '../common/SPUCard';

const SearchSPU: React.FC = () => {
  const [keyword, setKeyword] = React.useState('');
  const [list, setList] = React.useState<SPUF[]>([]);
  const [status, setStatus] = React.useState<LoadingState>('none');
  const [pageIndex, setPageIndex] = React.useState(0);
  const pageSize = useMemo(() => 10, []);

  const showNoMore = useMemo(() => status === 'noMore' && list.length > 0, [status, list]);
  const showEmpty = useMemo(() => status === 'noMore' && list.length === 0, [status, list]);

  const navigation = useNavigation<FakeNavigation>();
  const {bottom} = useSafeAreaInsets();

  function handleSearch(text: string) {
    if (!text || text === keyword) {
      // 没有输入关键字，不搜索
      return;
    }
    setKeyword(text);
    loadSPU({name: text}, true);
  }

  async function loadSPU(search: SearchParam, replace = false) {
    if (status !== 'noMore' || replace) {
      setStatus('loading');
      setList([]);
      const index = replace ? 1 : pageIndex + 1;
      const res = await api.spu.getSpuList({...search, pageIndex: index, pageSize});
      setList(res);
      setPageIndex(index);
      setStatus(res.length < pageSize ? 'noMore' : 'none');
    }
  }

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (isReachBottom(e)) {
      loadSPU({name: keyword});
    }
  }

  function goSPUDetail(spu: SPUF) {
    navigation.navigate({
      name: 'SPUDetail',
      params: {id: spu.spuId},
      key: 'SPUDetail-' + spu.spuId,
    });
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationSearchBar autoFocus onSearch={handleSearch} />
      <ScrollView style={{flex: 1}} keyboardDismissMode="on-drag" onMomentumScrollEnd={handleScrollEnd}>
        <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE, paddingBottom: bottom}}>
          {list.map(spu => {
            return <SPUCard key={spu.spuId} spu={spu} onSelect={() => goSPUDetail(spu)} />;
          })}
        </View>
        <View>
          {showNoMore && (
            <View style={[globalStyles.containerCenter, {paddingVertical: 20}]}>
              <Text>{dictLoadingState('noMore')}</Text>
            </View>
          )}
          {status === 'loading' && (
            <View style={[globalStyles.containerCenter, {paddingVertical: 20}]}>
              <ActivityIndicator size="small" color={globalStyleVariables.COLOR_PRIMARY} />
              <Text style={{marginTop: 10}}>{list.length ? '正在加载' : '正在搜索...'}</Text>
            </View>
          )}
          {showEmpty && (
            <View style={[globalStyles.containerCenter, {paddingTop: 100, paddingBottom: 20}]}>
              <Text>没有找到符合条件的商品</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchSPU;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  spuItem: {
    marginBottom: globalStyleVariables.MODULE_SPACE * 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: globalStyleVariables.MODULE_SPACE_BIGGER,
  },
  spuCoverContainer: {
    width: 60,
    height: 60,
  },
  spuCover: {
    borderRadius: 5,
    width: '100%',
    height: '100%',
  },
  spuName: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
});
