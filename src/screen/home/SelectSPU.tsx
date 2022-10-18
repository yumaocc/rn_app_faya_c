import React, {useCallback, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, RefreshControl} from 'react-native';
import {NavigationBar} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import * as api from '../../apis';
import {SPUF} from '../../models';
import {useWorkDispatcher} from '../../helper/hooks';
import {useNavigation} from '@react-navigation/native';
import Icon from '../../component/Icon';

const SelectSPU: React.FC = () => {
  const [type, setType] = React.useState<'search' | 'showcase'>('search');
  const [search, setSearch] = React.useState('');
  const searchInput = useRef<TextInput>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [spuList, setSpuList] = React.useState<SPUF[]>([]);

  const [workDispatcher] = useWorkDispatcher();
  const navigation = useNavigation();

  const doFetchSPU = useCallback(
    async (pageIndex: number) => {
      const res = await api.spu.getSpuList({
        pageIndex,
        pageSize: 5,
        name: search,
      });
      setSpuList(res);
    },
    [search],
  );

  const onRefresh = useCallback(async () => {
    console.log('触发 refresh');
    setRefreshing(true);
    await doFetchSPU(1);
    setRefreshing(false);
  }, [doFetchSPU]);

  useEffect(() => {
    if (type === 'search') {
      doFetchSPU(1);
    }
  }, [doFetchSPU, type]);

  function doSearch() {
    console.log('do search');
    searchInput.current?.blur();
  }

  function handleSelectSpu(spu: SPUF) {
    workDispatcher.setWorkSPU(spu);
    navigation.canGoBack() && navigation.goBack();
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
            <TouchableOpacity activeOpacity={0.8} onPress={() => setType('showcase')} style={{marginLeft: 20}}>
              <Text style={[globalStyles.fontPrimary, {color: type === 'showcase' ? globalStyleVariables.TEXT_COLOR_PRIMARY : globalStyleVariables.TEXT_COLOR_TERTIARY}]}>
                我的橱窗
              </Text>
            </TouchableOpacity>
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
      <ScrollView style={{flex: 1}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {spuList?.map(spu => {
          return (
            <TouchableOpacity
              key={spu.spuId}
              activeOpacity={0.8}
              onPress={() => {
                handleSelectSpu(spu);
              }}>
              <View style={styles.spu}>
                <View style={styles.spuImage} />
                <View style={[{flex: 1, marginLeft: globalStyleVariables.MODULE_SPACE}]}>
                  {/* <Text>{spu.categoryName}</Text> */}
                  <Text numberOfLines={2}>{spu?.spuName}</Text>
                  <View style={globalStyles.containerRow}>
                    <Text style={globalStyles.fontPrimary}>￥{spu.salePriceYuan}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
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
    // backgroundColor: '#6cf',
    flex: 1,
    height: 35,
    padding: 0,
  },
  spu: {
    flexDirection: 'row',
    padding: globalStyleVariables.MODULE_SPACE,
  },
  spuImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#6cf',
  },
});
