import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {NavigationSearchBar} from '../../component';
import {FakeNavigation, LoadingState, SPUF} from '../../models';
import * as api from '../../apis';
import {isReachBottom} from '../../helper/system';
import {SearchParam} from '../../fst/models';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import Icon from '../../component/Icon';
import {useNavigation} from '@react-navigation/native';
import {dictLoadingState} from '../../helper/dictionary';
import MyStatusBar from '../../component/MyStatusBar';

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

  function renderSPU(spu: SPUF) {
    const {commissionRangeLeftMoneyYuan, commissionRangeRightMoneyYuan, salePrice, originPrice} = spu;
    let commission = '';
    if (commissionRangeLeftMoneyYuan && commissionRangeRightMoneyYuan) {
      if (commissionRangeLeftMoneyYuan === commissionRangeRightMoneyYuan) {
        commission = commissionRangeLeftMoneyYuan;
      } else {
        commission = `${commissionRangeLeftMoneyYuan}-${commissionRangeRightMoneyYuan}`;
      }
    }
    let discount = null;
    if (originPrice && salePrice) {
      const res = Math.round((salePrice / originPrice) * 10);
      discount = Math.max(1, res);
    }
    if (discount && discount > 5) {
      discount = null;
    }

    return (
      <View key={spu.spuId}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => goSPUDetail(spu)}>
          <View style={styles.spuItem}>
            <View style={styles.spuCoverContainer}>
              <Image source={{uri: spu.poster}} defaultSource={require('../../assets/sku_def_1_1.png')} style={styles.spuCover} />
            </View>
            <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE, flex: 1}}>
              <View style={globalStyles.containerRow}>
                <Icon name="shangpin_shanghu24" size={15} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                <Text style={[globalStyles.fontPrimary, globalStyles.moduleMarginLeft]}>{spu?.bizName}</Text>
              </View>
              <View style={[globalStyles.halfModuleMarginTop]}>
                {spu.tags?.map((tag, i) => (
                  <Text key={i} style={[globalStyles.fontTertiary, {marginRight: globalStyleVariables.MODULE_SPACE}]}>
                    {tag}
                  </Text>
                ))}
              </View>
              <Text style={[globalStyles.fontStrong, {marginTop: 10}]}>{spu.spuName}</Text>
              <View style={[globalStyles.halfModuleMarginTop, globalStyles.containerLR]}>
                <View style={[globalStyles.containerRow, globalStyles.halfModuleMarginTop]}>
                  <View style={globalStyles.containerRow}>
                    <View style={[globalStyles.containerRow, {alignItems: 'flex-end'}]}>
                      <Text style={[{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 12}]}>¥</Text>
                      <Text style={{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 18}}>{spu.salePriceYuan}</Text>
                      <Text style={[globalStyles.fontTertiary, {marginLeft: globalStyleVariables.MODULE_SPACE / 2, textDecorationLine: 'line-through'}]}>
                        ¥{spu.originPriceYuan}
                      </Text>
                    </View>
                  </View>
                  {discount && (
                    <View style={[globalStyles.tagWrapper, globalStyles.moduleMarginLeft]}>
                      <Text style={[globalStyles.tag, {color: globalStyleVariables.COLOR_WARNING_YELLOW}]}>{discount}折</Text>
                    </View>
                  )}
                </View>
                {commission && (
                  <Text style={{color: globalStyleVariables.COLOR_BUD}}>
                    <MaterialIcon name="spa" size={14} />
                    <Text>{commission}</Text>
                  </Text>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationSearchBar autoFocus onSearch={handleSearch} />
      <ScrollView style={{flex: 1}} keyboardDismissMode="on-drag" onMomentumScrollEnd={handleScrollEnd}>
        <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE, paddingBottom: bottom}}>{list.map(spu => renderSPU(spu))}</View>
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
