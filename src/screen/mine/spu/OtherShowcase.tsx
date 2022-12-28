import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, RefreshControl, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import {useSelector} from 'react-redux';
import {NavigationBar} from '../../../component';
import Icon from '../../../component/Icon';
import MyStatusBar from '../../../component/MyStatusBar';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useLog} from '../../../fst/hooks';
import {useParams, useSPUDispatcher} from '../../../helper/hooks';
import {isReachBottom} from '../../../helper/system';
import {FakeNavigation, SPUF} from '../../../models';
import {RootState} from '../../../redux/reducers';
import SPUCard from '../../common/SPUCard';

const Showcase: React.FC = () => {
  const {userId} = useParams<{userId: number}>();
  const [search, setSearch] = React.useState(''); // 文本框内容
  const [keyword, setKeyword] = React.useState(''); // 发起搜索时的关键字

  // const showcaseSPUList = useSelector((state: RootState) => state.spu.showCaseSPUList);
  const showcaseSPUList = useSelector((state: RootState) => state.spu.userShowcase[String(userId)]);
  const showEmpty = useMemo(() => showcaseSPUList?.status === 'noMore' && showcaseSPUList?.list.length === 0, [showcaseSPUList]);

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
          <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
            {showcaseSPUList?.list.map(spu => {
              return <SPUCard spu={spu} key={spu.spuId} onSelect={goSPUDetail} />;
            })}
          </View>
        </View>
        {showEmpty && (
          <View style={[globalStyles.containerCenter, {paddingTop: 100, paddingBottom: 20}]}>
            <View style={[globalStyles.containerCenter]}>
              <View style={[globalStyles.containerCenter, {width: 50, height: 50, borderRadius: 50, backgroundColor: '#0000000D', marginBottom: 15}]}>
                <Icon name="empty_zuopin" size={30} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
              </View>
              <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>没有找到符合条件的商品</Text>
            </View>
          </View>
        )}
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
