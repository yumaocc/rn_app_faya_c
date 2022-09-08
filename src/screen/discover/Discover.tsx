import React, {useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import * as api from '../../apis';
import {useDivideData} from '../../helper/hooks';
import {FakeNavigation, SPUF} from '../../models';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Discover: React.FC = () => {
  const [spuList, setSpuList] = React.useState([]);
  const [left, right] = useDivideData<SPUF>(spuList);

  const navigation = useNavigation<FakeNavigation>();

  useEffect(() => {
    async function f() {
      const res = await api.spu.getSpuList({pageIndex: 1, pageSize: 10});
      console.log(res);
      setSpuList(res || []);
    }
    f();
  }, []);

  function renderSPU(spu: SPUF) {
    return (
      <View key={spu.spuId} style={styles.spuItem}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            navigation.navigate('SPUDetail', {id: spu.spuId});
          }}>
          <View style={styles.spuCoverContainer}>
            <Image source={{uri: spu.poster}} style={styles.spuCover} />
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
            <View style={[globalStyles.tagWrapper, globalStyles.moduleMarginLeft]}>
              <Text style={[globalStyles.tag, {color: globalStyleVariables.COLOR_WARNING_YELLOW}]}>4.5折</Text>
            </View>
          </View>
          <View style={[globalStyles.halfModuleMarginTop, globalStyles.containerLR]}>
            <Text>已售199</Text>
            <Text style={{color: globalStyleVariables.COLOR_BUD}}>
              <Icon name="spa" size={14} />
              <Text>10-50</Text>
            </Text>
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
          <View style={[globalStyles.containerLR, {paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
            <View style={globalStyles.containerRow}>
              <Icon name="location-on" size={24} color="#333" />
              <Text>成都</Text>
              <Icon name="arrow-drop-down" size={20} color="#333" />
            </View>
            <View style={styles.searchContainer}>
              <Text style={styles.spuName} numberOfLines={2}>
                火锅
              </Text>
            </View>
          </View>
          <ScrollView style={{flex: 1}}>
            <View style={styles.spuContainer}>
              <View style={styles.spuLeft}>{left.map(renderSPU)}</View>
              <View style={styles.spuRight}>{right.map(renderSPU)}</View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
};
Discover.defaultProps = {
  title: 'Discover',
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
