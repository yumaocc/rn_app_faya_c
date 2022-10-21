import React, {useCallback, useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView, Image, StatusBar, NativeSyntheticEvent, NativeScrollEvent, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from '../../component/Icon';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import * as api from '../../apis';
import {useCommonDispatcher, useDivideData, useSPUDispatcher} from '../../helper/hooks';
import {FakeNavigation, SPUF} from '../../models';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {getLocation, isReachBottom} from '../../helper/system';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {dictLoadingState} from '../../helper/dictionary';

const Discover: React.FC = () => {
  // const [spuList, setSpuList] = React.useState([]);
  const spuList = useSelector((state: RootState) => state.spu.spuList);
  const [left, right] = useDivideData<SPUF>(spuList.list);
  // const [locationName, setLocationName] = React.useState('定位中');
  const locationName = useSelector((state: RootState) => state.common.config.locationName);
  const locationId = useSelector((state: RootState) => state.common.config.locationId);

  const navigation = useNavigation<FakeNavigation>();
  const [commonDispatcher] = useCommonDispatcher();
  const [spuDispatcher] = useSPUDispatcher();

  useEffect(() => {
    spuDispatcher.loadSPUList({locationId}, true);
  }, [locationId, spuDispatcher]);

  const getCurrentLocation = useCallback(async () => {
    try {
      const location = await getLocation();
      console.log('location', location.coords);
      const {latitude, longitude} = location.coords;
      const locationMaybe = await api.user.getLocationByGPS(latitude, longitude);
      commonDispatcher.setConfig({
        locationId: locationMaybe.id,
        locationName: locationMaybe.name,
      });
    } catch (error) {
      console.log('location error');
      console.log(error);
    }
  }, [commonDispatcher]);

  function goSPUDetail(id: number) {
    navigation.navigate({
      name: 'SPUDetail',
      params: {id},
      key: 'SPUDetail-' + id,
    });
  }

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (isReachBottom(e)) {
      spuDispatcher.loadSPUList({locationId});
    }
  }
  function handleRefresh() {
    spuDispatcher.loadSPUList({locationId}, true);
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
          <View style={styles.spuCoverContainer}>
            <Image source={{uri: spu.poster}} defaultSource={require('../../assets/sku_def_1_1.png')} style={styles.spuCover} />
          </View>
        </TouchableOpacity>
        <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
          <Text style={[globalStyles.fontStrong, globalStyles.moduleMarginTop]}>{spu.spuName}</Text>
          <View style={[globalStyles.halfModuleMarginTop]}>
            {spu.tags.map((tag, i) => (
              <Text key={i} style={[globalStyles.fontTertiary, {marginRight: globalStyleVariables.MODULE_SPACE}]}>
                {tag}
              </Text>
            ))}
          </View>
          <View style={[globalStyles.containerRow, globalStyles.halfModuleMarginTop]}>
            <View style={globalStyles.containerRow}>
              <View style={[globalStyles.containerRow, {alignItems: 'flex-end'}]}>
                <Text style={[{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 12}]}>¥</Text>
                <Text style={{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 18}}>{spu.salePriceYuan}</Text>
                <Text style={[globalStyles.fontTertiary, {marginLeft: globalStyleVariables.MODULE_SPACE / 2, textDecorationLine: 'line-through'}]}>¥{spu.originPriceYuan}</Text>
              </View>
            </View>
            {discount && (
              <View style={[globalStyles.tagWrapper, globalStyles.moduleMarginLeft]}>
                <Text style={[globalStyles.tag, {color: globalStyleVariables.COLOR_WARNING_YELLOW}]}>{discount}折</Text>
              </View>
            )}
          </View>
          <View style={[globalStyles.halfModuleMarginTop, globalStyles.containerLR]}>
            <Text style={[globalStyles.fontTertiary, {fontSize: 10}]}>已售{spu.saleAmount}</Text>
            {commission && (
              <Text style={{color: globalStyleVariables.COLOR_BUD}}>
                <MaterialIcon name="spa" size={14} />
                <Text>{commission}</Text>
              </Text>
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
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <View style={[globalStyles.containerLR, {paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
            <View style={[globalStyles.containerRow, {maxWidth: 110}]}>
              <Icon name="faxian_dingwei" size={15} color="#333" />
              <View style={{marginLeft: 5}}>
                <Text numberOfLines={1}>{locationName.repeat(3)}</Text>
              </View>
              <Icon name="all_xiaosanjiaoD24" size={12} color="#333" />
            </View>
            <View style={styles.searchContainer}>
              <Text style={styles.spuName} numberOfLines={2}>
                火锅
              </Text>
            </View>
          </View>
          <ScrollView
            style={{flex: 1, marginTop: globalStyleVariables.MODULE_SPACE}}
            onMomentumScrollEnd={handleScrollEnd}
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
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
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
    height: 200,
  },
  spuCover: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
  },
  spuName: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
});
