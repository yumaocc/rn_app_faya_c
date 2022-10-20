import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar, useWindowDimensions, Platform, NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {NavigationBar, Tabs} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {FakeNavigation, OtherUserDetail, UserFollowState, UserWorkTabType} from '../../models';
import * as api from '../../apis';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {useCommonDispatcher, useParams, useUserDispatcher} from '../../helper/hooks';
import Icon from '../../component/Icon';
import {useForceUpdate, useRefCallback} from '../../fst/hooks';
import WorkList from './work/WorkList';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {TabsStyles} from '../../component/Tabs';

const User: React.FC = () => {
  const {id} = useParams<{id: number}>();
  const [userInfo, setUserInfo] = useState<OtherUserDetail>(null);
  const [showFixTab, setShowFixTab] = useState(false);

  const token = useSelector((state: RootState) => state.common.token);
  const userWorks = useSelector((state: RootState) => state.user.otherUserWorks[String(id)]);
  const [userDispatcher] = useUserDispatcher();
  const [commonDispatcher] = useCommonDispatcher();
  const {width} = useWindowDimensions();
  const [signal, updateSignal] = useForceUpdate();
  const [ref, setRef, isReady] = useRefCallback();
  const isFocused = useIsFocused();
  const navigation = useNavigation<FakeNavigation>();
  // useLog('userWorks', userWorks);

  // 是否已关注
  const followed = useMemo(() => userInfo && [UserFollowState.FOLLOW_EACH_OTHER, UserFollowState.FOLLOWED_USER].includes(userInfo?.hasCare), [userInfo]);

  const tabs = useMemo(() => {
    if (!userWorks) {
      return [];
    }
    return userWorks.tabs.map(tab => ({title: tab.title, key: String(tab.type)}));
  }, [userWorks]);
  const currentKey = useMemo(() => String(userWorks?.currentTabType), [userWorks]);

  const fetchUser = useCallback(
    async (userId: number) => {
      try {
        const userDetail = await api.user.getOtherUserInfo(userId);
        setUserInfo(userDetail);
      } catch (error) {
        commonDispatcher.error(error);
      }
    },
    [commonDispatcher],
  );

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id, userDispatcher, signal, fetchUser]);

  useEffect(() => {
    if (id) {
      userDispatcher.initOtherUser(id);
    }
    return () => {
      if (id) {
        userDispatcher.destroyOtherUser(id);
      }
    };
  }, [id, userDispatcher]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const index = tabs.findIndex(t => t.key === currentKey);
    setTimeout(() => {
      ref.current?.scrollTo({
        x: width * index,
        y: 0,
        animated: true,
      });
    }, 0);
  }, [currentKey, isReady, ref, width, tabs]);

  useEffect(() => {
    const workList = userWorks?.works[currentKey];
    if (!workList) {
      return;
    }
    if (Number(currentKey) === UserWorkTabType.Like) {
      // 喜欢不一定要加载
    }
    const {list, status} = workList;
    if (!list?.length && status === 'none') {
      userDispatcher.loadOtherUserWork(Number(currentKey), id, true);
    }
  }, [currentKey, id, userDispatcher, userWorks?.works]);

  async function followUser() {
    if (!token) {
      userDispatcher.login({
        back: true,
      });
      return;
    }
    try {
      await api.user.followUser(id);
      updateSignal();
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  // async function sendMessage() {
  //   console.log(1);
  // }
  function handleCopy() {
    if (userInfo?.account) {
      Clipboard.setString(userInfo?.account);
      commonDispatcher.info('复制成功');
    }
  }

  function handleTabChange(key: string) {
    userDispatcher.changeOtherUserTab(Number(key), id);
  }

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isFocused) {
        const {y} = e.nativeEvent.contentOffset;
        // console.log(y);
        const threshold = Platform.select({
          ios: 352,
          android: 410,
        });
        if (y > threshold && !showFixTab) {
          setShowFixTab(true);
        } else if (y <= threshold && showFixTab) {
          setShowFixTab(false);
        }
      }
    },
    [isFocused, showFixTab],
  );

  function loadWork() {
    userDispatcher.loadOtherUserWork(Number(currentKey), id);
  }

  function handleScrollEnd() {
    if (isFocused) {
      loadWork();
    }
  }

  function handleGoShowCase() {
    // todo
    navigation.navigate({
      name: 'OtherShowcase',
      params: {userId: id},
      key: 'OtherShowcase-' + id,
    });
  }

  function goWorkList(index: number) {
    navigation.navigate({name: 'UserWorkDetail', params: {index, userId: id}, key: 'UserWorkDetail' + Date.now()});
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView style={{flex: 1}} contentContainerStyle={{position: 'relative'}} onScroll={handleScroll} scrollEventThrottle={16} onMomentumScrollEnd={handleScrollEnd}>
        <Image source={require('../../assets/mine-bg.png')} style={styles.cover} />
        <View style={{flex: 1, paddingBottom: 30}}>
          <NavigationBar title="" color="#fff" />
          <View style={[styles.userActions]}>
            {!followed && (
              <TouchableOpacity activeOpacity={0.7} onPress={followUser}>
                <View style={[styles.userAction]}>
                  <Text style={[globalStyles.fontPrimary, {color: '#fff'}]}>{userInfo?.hasCare === UserFollowState.FOLLOWED_ME ? '回关' : '关注'}</Text>
                </View>
              </TouchableOpacity>
            )}
            {followed && (
              <TouchableOpacity activeOpacity={0.7} onPress={followUser}>
                <View style={[globalStyles.containerCenter, styles.userAction, {backgroundColor: 'transparent', paddingHorizontal: 10}]}>
                  <Icon name="wode_yiguanzhu48" size={24} color="#fff" />
                </View>
              </TouchableOpacity>
            )}
            {/* {true && (
              <TouchableOpacity activeOpacity={0.7} onPress={sendMessage}>
                <View style={[styles.userAction]}>
                  <Icon name="wode_sixin30" color="#fff" size={15} />
                  <Text style={[globalStyles.fontPrimary, {color: '#fff', marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER}]}>发私信</Text>
                </View>
              </TouchableOpacity>
            )} */}
          </View>
          <View style={[styles.container, {paddingTop: 0, marginTop: 20}]}>
            <View style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: '#fff'}}>
              {/* 头像栏 */}
              <View style={[styles.userData]}>
                {!!userInfo?.avatar && <Image style={[styles.avatar]} source={{uri: userInfo.avatar}} />}
                {!userInfo?.avatar && <Image style={[styles.avatar]} source={require('../../assets/avatar_def.png')} />}
                <View style={[globalStyles.containerRow, {justifyContent: 'space-around', flex: 1, height: 62}]}>
                  <View style={{alignItems: 'center', flex: 1}}>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{userInfo?.nums?.fansNums}</Text>
                    <Text style={[globalStyles.fontPrimary]}>粉丝</Text>
                  </View>
                  <View style={{alignItems: 'center', flex: 1}}>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{userInfo?.nums?.followNums}</Text>
                    <Text style={[globalStyles.fontPrimary]}>关注</Text>
                  </View>
                  <View style={{alignItems: 'center', flex: 1}}>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{userInfo?.nums?.likeNums}</Text>
                    <Text style={[globalStyles.fontPrimary]}>获赞</Text>
                  </View>
                </View>
              </View>

              {/* 用户基本信息栏 */}
              <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER, paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
                <View style={globalStyles.containerRow}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {userInfo?.nickName}
                  </Text>
                </View>
                {!!userInfo?.account && (
                  <View style={[globalStyles.containerRow, globalStyles.halfModuleMarginTop]}>
                    <Text style={[globalStyles.fontPrimary]}>发芽号：{userInfo?.account}</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={handleCopy}>
                      <Icon name="all_copy" size={18} color="#ccc" style={{marginLeft: 10}} />
                    </TouchableOpacity>
                  </View>
                )}
                <View style={globalStyles.halfModuleMarginTop}>
                  <Text style={globalStyles.fontSecondary} numberOfLines={1}>
                    {userInfo?.say}
                  </Text>
                </View>
              </View>

              {true && (
                <>
                  {/* 订单入口栏 */}
                  <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE, paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
                    <TouchableOpacity activeOpacity={0.8} style={{flex: 1}} onPress={handleGoShowCase}>
                      <View style={[globalStyles.containerRow]}>
                        <View style={[globalStyles.containerCenter, styles.entry]}>
                          <Icon name="wode_dingdan48" color={globalStyleVariables.TEXT_COLOR_PRIMARY} size={24} />
                        </View>
                        <Text>橱窗</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* 作品分类 */}
                  <Tabs
                    tabs={tabs}
                    currentKey={currentKey}
                    onChange={handleTabChange}
                    showIndicator
                    style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}
                    styles={tabStyles}
                  />
                  <ScrollView
                    ref={setRef}
                    horizontal
                    style={{marginTop: globalStyleVariables.MODULE_SPACE}}
                    snapToInterval={width}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}>
                    {tabs.map(tab => {
                      return (
                        <View style={{width}} key={tab.key}>
                          <WorkList list={userWorks?.works[tab.key]} onClickWork={index => goWorkList(index)} />
                        </View>
                      );
                    })}
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cover: {
    width: '100%',
    height: 180,
    position: 'absolute',
    top: 0,
  },
  userActions: {
    height: 35,
    marginTop: 30,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  userAction: {
    height: 35,
    borderRadius: 35,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: globalStyleVariables.MODULE_SPACE,
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  userData: {
    height: 83,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  entry: {
    width: 60,
    height: 60,
    backgroundColor: '#00000008',
    marginRight: 10,
    borderRadius: 5,
  },
});

const tabStyles: Partial<TabsStyles> = {
  tab: {
    width: '100%',
    alignItems: 'center',
  },
  activeTabText: {
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  indictor: {
    marginTop: 10,
    width: '100%',
  },
  indictorActive: {
    backgroundColor: '#333',
  },
  tabContainer: {
    flex: 1,
  },
};
