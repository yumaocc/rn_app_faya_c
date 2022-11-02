import React, {useEffect, useMemo, useRef} from 'react';
import {View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, useWindowDimensions, Image} from 'react-native';
import {NavigationBar} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {SPUF} from '../../models';
import {useSPUDispatcher, useWorkDispatcher} from '../../helper/hooks';
import {useNavigation} from '@react-navigation/native';
import Icon from '../../component/Icon';
import {useRefCallback} from '../../fst/hooks';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';

const SelectSPU: React.FC = () => {
  const [type, setType] = React.useState<'search' | 'showcase'>('search');
  const [search, setSearch] = React.useState(''); // 文本框内容
  const [keyword, setKeyword] = React.useState(''); // 发起搜索时的关键字
  const searchInput = useRef<TextInput>(null);
  const userInfo = useSelector((state: RootState) => state.user.myDetail);
  const hasShowcase = useMemo(() => userInfo?.level > 0, [userInfo]);

  const spuList = useSelector((state: RootState) => state.spu.spuListForWork);
  const showCaseSpu = useSelector((state: RootState) => state.spu.showCaseSPUList);

  const [workDispatcher] = useWorkDispatcher();
  const [spuDispatcher] = useSPUDispatcher();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback();

  useEffect(() => {
    if (type === 'search') {
      spuDispatcher.loadSearchSPUForWork(keyword, true);
    } else if (type === 'showcase') {
      spuDispatcher.loadShowCaseSPU({name: keyword}, true);
    }
  }, [type, spuDispatcher, keyword]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const index = type === 'search' ? 0 : 1;
    setTimeout(() => {
      ref.current?.scrollTo({
        x: width * index,
        y: 0,
        animated: true,
      });
    }, 0);
  }, [type, isReady, ref, width]);

  function doSearch() {
    searchInput.current?.blur();
    if (search !== keyword) {
      setKeyword(search);
    }
  }

  function handleSelectSpu(spu: SPUF) {
    workDispatcher.setWorkSPU(spu);
    navigation.canGoBack() && navigation.goBack();
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
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleSelectSpu(spu)}>
          <View style={styles.spuItem}>
            <View style={styles.spuCoverContainer}>
              <Image source={{uri: spu.poster}} defaultSource={require('../../assets/sku_def_1_1.png')} style={styles.spuCover} />
            </View>
            <View style={{paddingLeft: globalStyleVariables.MODULE_SPACE, flex: 1}}>
              <View style={globalStyles.containerRow}>
                <Icon name="shangpin_shanghu24" size={15} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                <Text style={[globalStyles.fontPrimary, {marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER, fontSize: 12}]}>{spu?.bizName}</Text>
              </View>
              <View style={[globalStyles.halfModuleMarginTop]}>
                {spu.tags?.map((tag, i) => (
                  <Text key={i} style={[globalStyles.fontTertiary, {marginRight: globalStyleVariables.MODULE_SPACE}]}>
                    {tag}
                  </Text>
                ))}
              </View>
              <Text style={[globalStyles.fontStrong, {marginTop: 10}]}>{spu.spuName}</Text>
              <View style={[globalStyles.halfModuleMarginTop, globalStyles.containerLR, {alignItems: 'flex-end'}]}>
                <View style={[globalStyles.containerRow, globalStyles.halfModuleMarginTop, {alignItems: 'flex-end'}]}>
                  <View style={[globalStyles.containerRow]}>
                    <View style={[globalStyles.containerRow, {alignItems: 'flex-end'}]}>
                      <Text style={[{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 12}]}>¥</Text>
                      <Text style={{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 18, lineHeight: 18, bottom: -2}}>{spu.salePriceYuan}</Text>
                      <Text style={[globalStyles.fontTertiary, {marginLeft: globalStyleVariables.MODULE_SPACE / 2, textDecorationLine: 'line-through'}]}>
                        ¥{spu.originPriceYuan}
                      </Text>
                    </View>
                  </View>
                  {discount && (
                    <View style={[globalStyles.discountTagWrapper, globalStyles.moduleMarginLeft]}>
                      <Text style={[globalStyles.discountTag]}>{discount}折</Text>
                    </View>
                  )}
                </View>
                {commission && (
                  <View style={globalStyles.containerRow}>
                    <MaterialIcon name="spa" size={14} color={globalStyleVariables.COLOR_BUD} />
                    <Text style={{color: globalStyleVariables.COLOR_BUD}}>{commission}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
      <NavigationBar
        style={{backgroundColor: '#fff'}}
        title={
          <View style={globalStyles.containerRow}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setType('search')}>
              <Text style={[globalStyles.fontPrimary, {color: type === 'search' ? globalStyleVariables.TEXT_COLOR_PRIMARY : globalStyleVariables.TEXT_COLOR_TERTIARY}]}>
                选择商品
              </Text>
            </TouchableOpacity>
            {hasShowcase && (
              <TouchableOpacity activeOpacity={0.8} onPress={() => setType('showcase')} style={{marginLeft: 40}}>
                <Text style={[globalStyles.fontPrimary, {color: type === 'showcase' ? globalStyleVariables.TEXT_COLOR_PRIMARY : globalStyleVariables.TEXT_COLOR_TERTIARY}]}>
                  我的橱窗
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="all_input_search36" size={18} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
          <TextInput onSubmitEditing={doSearch} returnKeyType="search" ref={searchInput} style={styles.search} placeholder="搜索商品" value={search} onChangeText={setSearch} />
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={doSearch}>
          <Text>搜索</Text>
        </TouchableOpacity>
      </View>
      <ScrollView ref={setRef} horizontal style={{flex: 1}} snapToInterval={width} showsHorizontalScrollIndicator={false} scrollEnabled={false}>
        <View style={{width}}>
          <ScrollView style={{flex: 1}}>
            <View style={{padding: globalStyleVariables.MODULE_SPACE}}>{spuList?.list.map(renderSPU)}</View>
          </ScrollView>
        </View>
        {hasShowcase && (
          <View style={{width}}>
            <ScrollView style={{flex: 1}}>
              <View style={{padding: globalStyleVariables.MODULE_SPACE}}>{showCaseSpu?.list?.map(renderSPU)}</View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
export default SelectSPU;

const styles = StyleSheet.create({
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
    marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER,
    flex: 1,
    height: 35,
    padding: 0,
  },
  spuItem: {
    marginBottom: globalStyleVariables.MODULE_SPACE,
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
