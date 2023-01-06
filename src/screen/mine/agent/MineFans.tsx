import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent, RefreshControl, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {NavigationBar} from '../../../component';
import MyStatusBar from '../../../component/MyStatusBar';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useCommonDispatcher, useParams} from '../../../helper/hooks';
import {FakeNavigation, LoadListState, OtherUserDetail} from '../../../models';
import {RootState} from '../../../redux/reducers';
import * as api from '../../../apis';
import {isReachBottom} from '../../../helper/system';
import {useNavigation} from '@react-navigation/native';
import {getPrettyNumber} from '../../../fst/helper/data';

type ListType = 'fans' | 'follows';

const MineFans: React.FC = () => {
  const {type} = useParams<{type: ListType}>();
  const [currentType, setCurrentType] = React.useState<ListType>(type || 'fans');
  const [userData, setUserData] = useState<LoadListState<OtherUserDetail>>({list: [], status: 'none', index: 0});
  const [initLoading, setInitLoading] = useState(true); // 是否显示初始化加载

  const userInfo = useSelector((state: RootState) => state.user.myDetail);

  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation<FakeNavigation>();

  const loadUserList = useCallback(
    async (type: ListType, replace = false) => {
      if (userData.status !== 'noMore' || replace) {
        const index = replace ? 1 : userData.index + 1;
        const pageSize = 20;
        try {
          let res: OtherUserDetail[];
          if (type === 'fans') {
            res = await api.user.mineFans({pageIndex: index, pageSize});
          } else {
            res = await api.user.mineFollows({pageIndex: index, pageSize});
          }
          const newUsers: LoadListState<OtherUserDetail> = {
            list: replace ? res : [...userData.list, ...res],
            status: res.length < pageSize ? 'noMore' : 'none',
            index,
          };
          setInitLoading(false);
          setUserData(newUsers);
        } catch (error) {
          commonDispatcher.error(error);
        }
      }
    },
    [commonDispatcher, userData],
  );

  useEffect(() => {
    setInitLoading(true);
    setUserData({list: [], status: 'none', index: 0});
  }, [currentType]);

  useEffect(() => {
    if (!initLoading) {
      return;
    }
    loadUserList(currentType, true);
  }, [currentType, loadUserList, initLoading]);

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (isReachBottom(e)) {
      loadUserList(currentType);
    }
  }

  function handleRefresh() {
    loadUserList(currentType, true);
  }

  function goUserDetail(userId: number) {
    navigation.navigate({
      name: 'User',
      params: {id: userId},
      key: 'User-' + userId, // 每次去往个人中心需要新建一个key，否则会返回之前的页面
    });
  }

  return (
    <View style={styles.container}>
      <NavigationBar
        showBottomLine
        title={
          <View style={globalStyles.containerRow}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setCurrentType('fans')}>
              <Text style={[globalStyles.fontPrimary, {color: currentType === 'fans' ? globalStyleVariables.TEXT_COLOR_PRIMARY : globalStyleVariables.TEXT_COLOR_TERTIARY}]}>
                粉丝{getPrettyNumber(userInfo?.nums?.fansNums) || 0}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={{marginLeft: 40}} onPress={() => setCurrentType('follows')}>
              <Text style={[globalStyles.fontPrimary, {color: currentType === 'follows' ? globalStyleVariables.TEXT_COLOR_PRIMARY : globalStyleVariables.TEXT_COLOR_TERTIARY}]}>
                关注{getPrettyNumber(userInfo?.nums?.followNums) || 0}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
      <MyStatusBar />
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <ScrollView
          style={{flex: 1, paddingHorizontal: 15}}
          onMomentumScrollEnd={handleScrollEnd}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}>
          {userData.list.map(item => {
            return (
              <TouchableOpacity key={item.userId} activeOpacity={0.8} onPress={() => goUserDetail(item.userId)}>
                <View style={[globalStyles.containerRow, {marginBottom: 20}]}>
                  <Image source={{uri: item.avatar}} defaultSource={require('../../../assets/avatar_def.png')} style={{width: 50, height: 50, borderRadius: 50}} />
                  <View style={{marginLeft: 10, flex: 1}}>
                    <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_LINK}]} numberOfLines={1}>
                      {item.nickName}
                    </Text>
                    {!!item.say && <Text style={[globalStyles.fontTertiary, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]}>{item.say}</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default MineFans;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
