import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, RefreshControl, Image, TextInput, TouchableOpacity, FlatList, Platform, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar} from '../../../component';
import Empty from '../../../component/Empty';
import Icon from '../../../component/Icon';
import MyStatusBar from '../../../component/MyStatusBar';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useCommonDispatcher} from '../../../helper/hooks';
import {FakeNavigation, LoadListState, TeamMemberF} from '../../../models';
import * as api from '../../../apis';
import {useEffect} from 'react';
import {isReachBottom} from '../../../helper/system';
// import MyImage from '../../../component/MyImage';

const TeamMember: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>(''); //  // 搜索框输入的值，执行搜索时赋值给keyword
  const [keyword, setKeyword] = useState<string>(''); // 搜索关键字
  const [initLoading, setInitLoading] = useState(true); // 是否显示初始化加载
  const [totalMemberCount, setTotalMemberCount] = useState<number>(0); // 团队总人数
  const [memberData, setMemberData] = useState<LoadListState<TeamMemberF>>({list: [], status: 'none', index: 0});

  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation<FakeNavigation>();

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (isReachBottom(e)) {
      // loadUserList(currentType);
      loadMemberList(keyword);
    }
  }
  function handleRefresh() {
    // setInitLoading(true);
    loadMemberList(keyword, true);
  }

  const loadMemberList = useCallback(
    async (name: string, replace = false) => {
      if (memberData.status !== 'noMore' || replace) {
        const index = replace ? 1 : memberData.index + 1;
        const pageSize = 20;
        setInitLoading(false);
        setMemberData({...memberData, status: 'loading'});
        try {
          const res = await api.user.getMyTeamList({
            name,
            pageIndex: index,
            pageSize,
          });
          setTotalMemberCount(res.page?.pageTotal || 0);
          const newUsers: LoadListState<TeamMemberF> = {
            list: replace ? res.content : [...memberData.list, ...res.content],
            status: res.content.length < pageSize ? 'noMore' : 'none',
            index,
          };
          setMemberData(newUsers);
        } catch (error) {
          commonDispatcher.error(error);
        }
      }
    },
    [commonDispatcher, memberData],
  );

  useEffect(() => {
    setInitLoading(true);
  }, [keyword]);

  useEffect(() => {
    if (!initLoading) {
      return;
    }
    loadMemberList(keyword, true);
  }, [initLoading, keyword, loadMemberList]);

  function renderItem({item}: {item: TeamMemberF}) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('TeamMemberDetail', {shareSnowId: item.shareSnowId})}>
        <View style={[globalStyles.containerRow, {paddingVertical: 5}]}>
          <Image source={{uri: item.avatar}} defaultSource={require('../../../assets/avatar_def.png')} style={{width: 50, height: 50, borderRadius: 50}} />
          <View style={[{marginLeft: 10, flex: 1}]}>
            <Text style={[globalStyles.fontPrimary]}>{item.nickName}</Text>
            <View style={[globalStyles.containerLR, {marginTop: 5}]}>
              <Text style={[globalStyles.fontTertiary]}>{item.invitedTime}</Text>
              <Text style={[globalStyles.fontTertiary]}>通过组队码加入团队</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  function doSearch() {
    setKeyword(searchValue);
  }
  function renderEmpty() {
    if (memberData.status === 'loading') {
      return null;
    }
    return <Empty style={{marginTop: 120}} text={keyword ? '暂无符合搜索的团队成员' : '暂无团队成员'} />;
  }
  return (
    <View style={styles.container}>
      <NavigationBar title="我的团队" />
      <MyStatusBar />
      <SafeAreaView edges={['bottom']} style={{flex: 1}}>
        <FlatList
          style={{flex: 1}}
          data={memberData.list}
          renderItem={renderItem}
          keyExtractor={item => String(item.userId)}
          ListEmptyComponent={renderEmpty}
          stickyHeaderIndices={[0]}
          onMomentumScrollEnd={handleScrollEnd}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 15}}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          ListFooterComponent={<Text style={[globalStyles.fontPrimary, {color: '#999', textAlign: 'center', marginTop: 20}]}>共{totalMemberCount}人</Text>}
          ListHeaderComponent={
            <View style={[styles.searchContainer]}>
              <View style={globalStyles.containerRow}>
                <View style={[globalStyles.containerRow, styles.searchBar]}>
                  <Icon name="nav_search48" size={24} color="#999" />
                  <TextInput
                    style={[styles.searchInput]}
                    clearButtonMode="while-editing"
                    returnKeyType="search"
                    placeholder="搜索团队成员"
                    value={searchValue}
                    onSubmitEditing={doSearch}
                    onChangeText={setSearchValue}
                  />
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={() => doSearch()}>
                  <Text style={[globalStyles.fontPrimary, {marginLeft: 10}]}>搜索</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}
        />
      </SafeAreaView>
    </View>
  );
};

export default TeamMember;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 15,
    height: 35,
    borderRadius: 35,
  },
  searchInput: {
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
    flex: 1,
    margin: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
