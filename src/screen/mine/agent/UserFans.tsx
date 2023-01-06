import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar} from '../../../component';
import MyStatusBar from '../../../component/MyStatusBar';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useCommonDispatcher, useParams} from '../../../helper/hooks';
import {FakeNavigation, LoadListState, OtherUserDetail} from '../../../models';
import * as api from '../../../apis';
import {isReachBottom} from '../../../helper/system';
// import MyImage from '../../../component/MyImage';
import {useNavigation} from '@react-navigation/native';
import {BoolEnum} from '../../../fst/models';
import Icon from '../../../component/Icon';
import Empty from '../../../component/Empty';
import {getPrettyNumber} from '../../../fst/helper/data';
import MyImage from '../../../component/MyImage';

type ListType = 'fans' | 'follows';

const UserFans: React.FC = () => {
  const {type, userId} = useParams<{type: ListType; userId: number}>();
  const [currentType, setCurrentType] = React.useState<ListType>(type || 'fans');
  const [userData, setUserData] = useState<LoadListState<OtherUserDetail>>({list: [], status: 'none', index: 0});
  const [initLoading, setInitLoading] = useState(true); // 是否显示初始化加载
  const [userInfo, setUserInfo] = useState<OtherUserDetail>();

  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation<FakeNavigation>();

  const canShowFans = useMemo(() => userInfo?.userSettings?.publicMyFans === BoolEnum.TRUE, [userInfo?.userSettings?.publicMyFans]);
  const canShowFollows = useMemo(() => userInfo?.userSettings?.publicMyFollow === BoolEnum.TRUE, [userInfo?.userSettings?.publicMyFollow]);
  const canShowEmpty = useMemo(() => {
    if (currentType === 'fans') {
      return !canShowFans;
    } else {
      return !canShowFollows;
    }
  }, [canShowFans, canShowFollows, currentType]);

  useEffect(() => {
    api.user.getOtherUserInfo(userId).then(setUserInfo).catch(commonDispatcher.error);
  }, [commonDispatcher, userId]);

  const loadUserList = useCallback(
    async (type: ListType, replace = false) => {
      if (userData.status !== 'noMore' || replace) {
        const index = replace ? 1 : userData.index + 1;
        const pageSize = 20;
        try {
          let res: OtherUserDetail[];
          const params = {pageIndex: index, pageSize, id: userId};
          if (type === 'fans') {
            if (userInfo?.userSettings?.publicMyFans !== BoolEnum.TRUE) {
              res = [];
            } else {
              res = await api.user.userFans(params);
            }
          } else {
            if (userInfo?.userSettings?.publicMyFollow !== BoolEnum.TRUE) {
              res = [];
            } else {
              res = await api.user.userFollows(params);
            }
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
    [commonDispatcher, userData, userId, userInfo],
  );

  useEffect(() => {
    setInitLoading(true);
    setUserData({list: [], status: 'none', index: 0});
  }, [currentType]);

  useEffect(() => {
    if (!initLoading || !userInfo) {
      return;
    }
    loadUserList(currentType, true);
  }, [currentType, loadUserList, initLoading, userInfo]);

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
      <MyStatusBar />
      <NavigationBar showBottomLine title={userInfo?.nickName || 'TA的粉丝/关注'} />
      <View style={[globalStyles.containerRow, {alignItems: 'center', justifyContent: 'center'}]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setCurrentType('fans')}>
          <View style={[globalStyles.containerRow]}>
            {!canShowFans && <Icon name="empty_lock" color={currentType === 'fans' ? '#333' : '#999'} />}
            <Text style={[globalStyles.fontPrimary, {color: currentType === 'fans' ? globalStyleVariables.TEXT_COLOR_PRIMARY : globalStyleVariables.TEXT_COLOR_TERTIARY}]}>
              粉丝{getPrettyNumber(userInfo?.nums?.fansNums) || 0}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={{marginLeft: 40}} onPress={() => setCurrentType('follows')}>
          <View style={[globalStyles.containerRow]}>
            {!canShowFollows && <Icon name="empty_lock" color={currentType === 'follows' ? '#333' : '#999'} />}
            <Text style={[globalStyles.fontPrimary, {color: currentType === 'follows' ? globalStyleVariables.TEXT_COLOR_PRIMARY : globalStyleVariables.TEXT_COLOR_TERTIARY}]}>
              关注{getPrettyNumber(userInfo?.nums?.followNums) || 0}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
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
                  <MyImage source={{uri: item.avatar}} defaultSource={require('../../../assets/avatar_def.png')} style={{width: 50, height: 50, borderRadius: 50}} />
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
          {canShowEmpty && <Empty style={[{marginTop: 120}]} icon="empty_lock" text="由于对方的隐私设置，您暂时无法查看" />}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default UserFans;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
