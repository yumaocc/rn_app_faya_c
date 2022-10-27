import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, StatusBar, ScrollView, TextInput, TouchableOpacity, Image, RefreshControl, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {NavigationBar} from '../../../component';
import Icon from '../../../component/Icon';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useLog} from '../../../fst/hooks';
import {useParams, useSPUDispatcher} from '../../../helper/hooks';
import {isReachBottom} from '../../../helper/system';
import {FakeNavigation, SPUF} from '../../../models';
import {RootState} from '../../../redux/reducers';

const Showcase: React.FC = () => {
  const {userId} = useParams<{userId: number}>();
  const [search, setSearch] = React.useState(''); // 文本框内容
  const [keyword, setKeyword] = React.useState(''); // 发起搜索时的关键字

  // const showcaseSPUList = useSelector((state: RootState) => state.spu.showCaseSPUList);
  const showcaseSPUList = useSelector((state: RootState) => state.spu.userShowcase[String(userId)]);

  useLog('showcaseSPUList', showcaseSPUList);

  const searchInput = useRef<TextInput>(null);
  const [spuDispatcher] = useSPUDispatcher();
  const navigation = useNavigation<FakeNavigation>();

  useEffect(() => {
    spuDispatcher.initOtherUserShowcase(userId);
    return () => {
      spuDispatcher.destroyOtherUserShowcase(userId);
    };
  }, [userId, spuDispatcher]);

  useEffect(() => {
    spuDispatcher.loadOtherUserShowcase(userId, {name: keyword});
  }, [keyword, spuDispatcher, userId]);

  function doSearch() {
    searchInput.current?.blur();
    if (search !== keyword) {
      setKeyword(search);
    }
  }

  function handleFreshSearch() {
    spuDispatcher.loadOtherUserShowcase(userId, {name: keyword}, true);
  }

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (isReachBottom(e)) {
      spuDispatcher.loadOtherUserShowcase(userId, {name: keyword});
    }
  }

  function goSPUDetail(id: number) {
    navigation.navigate({
      name: 'SPUDetail',
      params: {id},
      key: 'SPUDetail-' + id,
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
        <TouchableOpacity activeOpacity={0.8} onPress={() => goSPUDetail(spu.spuId)}>
          <View style={styles.spuItem}>
            <View style={styles.spuCoverContainer}>
              <Image source={{uri: spu.poster}} defaultSource={require('../../../assets/sku_def_1_1.png')} style={styles.spuCover} />
            </View>
            <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE, flex: 1}}>
              <View style={globalStyles.containerRow}>
                <Icon name="shangpin_shanghu24" size={15} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                <Text style={[globalStyles.fontPrimary, globalStyles.moduleMarginLeft]}>{spu.bizName}</Text>
              </View>
              {!!spu.tags?.length && (
                <View style={[globalStyles.halfModuleMarginTop]}>
                  {spu.tags.map((tag, i) => (
                    <Text key={i} style={[globalStyles.fontTertiary, {marginRight: globalStyleVariables.MODULE_SPACE}]}>
                      {tag}
                    </Text>
                  ))}
                </View>
              )}
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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationBar title="橱窗" />
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="all_input_search36" size={18} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
          <TextInput
            onSubmitEditing={doSearch}
            returnKeyType="search"
            ref={searchInput}
            style={styles.search}
            placeholder="搜索橱窗商品"
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={doSearch}>
          <Text>搜索</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{flex: 1, backgroundColor: '#f4f4f4'}}
        onMomentumScrollEnd={handleScrollEnd}
        refreshControl={<RefreshControl refreshing={showcaseSPUList?.status === 'loading'} onRefresh={handleFreshSearch} />}>
        <View>
          <View style={{padding: globalStyleVariables.MODULE_SPACE}}>{showcaseSPUList?.list.map(renderSPU)}</View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Showcase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: globalStyleVariables.MODULE_SPACE,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    // paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    marginRight: globalStyleVariables.MODULE_SPACE,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0000000D',
    height: 35,
    borderRadius: 35,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
  },
  search: {
    // backgroundColor: '#6cf',
    marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER,
    flex: 1,
    height: 35,
    padding: 0,
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
