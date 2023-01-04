import React, {useEffect, useMemo, useRef} from 'react';
import {View, StyleSheet, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent, RefreshControl, TouchableWithoutFeedback, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from '../../component/Icon';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
// import * as api from '../../apis';
import {useDivideData, useSPUDispatcher} from '../../helper/hooks';
import {FakeNavigation, SPUF} from '../../models';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {isReachBottom} from '../../helper/system';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {dictLoadingState} from '../../helper/dictionary';
import MyStatusBar from '../../component/MyStatusBar';
import {getSPUNavigateParam} from '../../helper/spu';
import FastImage from 'react-native-fast-image';
import SelectLocationModal from '../../component/SelectLocationModal';

const Discover: React.FC = () => {
  const spuList = useSelector((state: RootState) => state.spu.spuList);
  const [left, right] = useDivideData<SPUF>(spuList.list);
  const locationName = useSelector((state: RootState) => state.common.config.locationName);
  const locationId = useSelector((state: RootState) => state.common.config.locationId);
  const [showSelectCity, setShowSelectCity] = React.useState(false);
  const scrollViewRef = useRef<ScrollView>();

  const navigation = useNavigation<FakeNavigation>();
  const [spuDispatcher] = useSPUDispatcher();
  // const [cityList] = useCityList();
  // const cityWidth = useGrid({col: 3, space: 10, sideSpace: 10});

  const {width} = useWindowDimensions();
  const coverHeight = useMemo(() => {
    return ((width - 30) / 2 / 3) * 4;
  }, [width]);

  useEffect(() => {
    spuDispatcher.loadSPUList({locationId}, true);
  }, [locationId, spuDispatcher]);

  function goSPUDetail(id: number) {
    navigation.navigate(getSPUNavigateParam(id));
  }

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (isReachBottom(e)) {
      spuDispatcher.loadSPUList({locationId});
    }
  }
  function handleRefresh() {
    spuDispatcher.loadSPUList({locationId}, true);
    // setTimeout(() => {
    //   scrollViewRef.current && scrollViewRef.current.scrollTo({x: 0, y: 1, animated: false});
    // }, 500);
  }

  function handleSearch() {
    navigation.navigate('SearchSPU');
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
      <View key={spu.spuId} style={styles.spuItem}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            goSPUDetail(spu.spuId);
          }}>
          <View style={[styles.spuCoverContainer, {height: coverHeight}]}>
            <FastImage source={{uri: spu.poster}} defaultSource={require('../../assets/sku_def_180w.png')} style={[styles.spuCover]} />
          </View>
        </TouchableOpacity>
        <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
          <Text numberOfLines={2} style={[globalStyles.fontStrong, globalStyles.moduleMarginTop]}>
            {spu.spuName}
          </Text>
          <View style={[globalStyles.halfModuleMarginTop]}>
            {spu.tags.map((tag, i) => (
              <Text key={i} style={[globalStyles.fontTertiary, {marginRight: globalStyleVariables.MODULE_SPACE}]}>
                {tag}
              </Text>
            ))}
          </View>
          <View style={[globalStyles.containerRow, globalStyles.halfModuleMarginTop, {alignItems: 'flex-end'}]}>
            <View style={[globalStyles.containerRow]}>
              <View style={[globalStyles.containerRow, {alignItems: 'flex-end'}]}>
                <Text style={[{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 12}]}>¥</Text>
                <Text style={{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 18, lineHeight: 18, bottom: -2}}>{spu.salePriceYuan}</Text>
                <Text style={[globalStyles.fontTertiary, {marginLeft: globalStyleVariables.MODULE_SPACE / 2, textDecorationLine: 'line-through'}]}>¥{spu.originPriceYuan}</Text>
              </View>
            </View>
            {discount && (
              <View style={[globalStyles.discountTagWrapper, globalStyles.moduleMarginLeft]}>
                <Text style={[globalStyles.discountTag]}>{discount}折</Text>
              </View>
            )}
          </View>
          <View style={[globalStyles.halfModuleMarginTop, globalStyles.containerLR]}>
            <Text style={[globalStyles.fontTertiary, {fontSize: 10}]}>已售{spu.saleAmount}</Text>
            {commission && (
              <View style={globalStyles.containerRow}>
                <Icon name="shangping_ya_20" size={10} color={globalStyleVariables.COLOR_BUD} style={{margin: 3}} />
                <Text style={{color: globalStyleVariables.COLOR_BUD}}>{commission}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {/* <View style={styles.bannerContainer}>
          <Image source={{uri: 'https://fakeimg.pl/198?text=loading'}} style={styles.banner} />
        </View> */}
        {/* <View style={globalStyles.containerForTmp}>
          <View style={styles.searchBar} />
        </View> */}
        {/* 地址 + 搜索 */}
        <SafeAreaView edges={['top']} style={{flex: 1}}>
          {/* 其他页面会默认此状态栏设置 */}
          <MyStatusBar barStyle="dark-content" />
          <View style={[globalStyles.containerLR, {paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER, height: 50}]}>
            <View style={[{maxWidth: 110, marginRight: 20}]}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setShowSelectCity(true)}>
                <View style={[globalStyles.containerRow]}>
                  <Icon name="faxian_dingwei" size={15} color="#333" />
                  <View style={{marginLeft: 5}}>
                    <Text numberOfLines={1}>{locationName}</Text>
                  </View>
                  <Icon name="all_xiaosanjiaoD24" size={12} color="#333" />
                </View>
              </TouchableOpacity>
            </View>
            <TouchableWithoutFeedback style={{flex: 1}} onPress={handleSearch}>
              <View style={styles.searchContainer}>
                <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>搜索商品</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <ScrollView
            style={{flex: 1, paddingTop: globalStyleVariables.MODULE_SPACE}}
            onMomentumScrollEnd={handleScrollEnd}
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}>
            <View style={styles.spuContainer}>
              <View style={styles.spuLeft}>{left.map(renderSPU)}</View>
              <View style={styles.spuRight}>{right.map(renderSPU)}</View>
            </View>
            <View style={[globalStyles.containerCenter, {paddingVertical: 20}]}>
              <Text style={[globalStyles.fontTertiary, {fontSize: 14}]}>{dictLoadingState(spuList.status)}</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
      <SelectLocationModal visible={showSelectCity} onClose={() => setShowSelectCity(false)} />
    </>
  );
};
export default Discover;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    marginLeft: globalStyleVariables.MODULE_SPACE,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  spuContainer: {
    flexDirection: 'row',
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
  },
  spuLeft: {
    flex: 1,
  },
  spuRight: {
    flex: 1,
    marginLeft: globalStyleVariables.MODULE_SPACE,
  },
  spuItem: {
    marginBottom: globalStyleVariables.MODULE_SPACE * 2,
  },
  spuCoverContainer: {
    // height: 200,
  },
  spuCover: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
  },
});
