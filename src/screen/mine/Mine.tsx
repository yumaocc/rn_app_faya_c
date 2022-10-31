import Icon from '../../component/Icon';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TouchableWithoutFeedback, Platform, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {Tabs} from '../../component';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {FakeNavigation, MyWorkTabType} from '../../models';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {useCommonDispatcher, useIsLoggedIn, useUserDispatcher} from '../../helper/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WorkList from './work/WorkList';
import {TabsStyles} from '../../component/Tabs';
import {goLogin} from '../../router/Router';
import MyStatusBar from '../../component/MyStatusBar';

const Mine: React.FC = () => {
  const detail = useSelector((state: RootState) => state.user.myDetail);
  const tabs = useSelector((state: RootState) => state.user.myTabs);
  const items = useMemo(() => tabs.map(e => ({title: e.title, key: String(e.value)})), [tabs]);
  const currentTabKey = useSelector((state: RootState) => String(state.user.currentTabType));
  const allWorks = useSelector((state: RootState) => state.user.myWorks);
  const userHasShowcase = useMemo(() => detail?.level > 0, [detail]);

  const [showFixTab, setShowFixTab] = useState(false);

  const navigation = useNavigation<FakeNavigation>();
  const isLoggedIn = useIsLoggedIn();
  const [userDispatcher] = useUserDispatcher();
  const [commonDispatcher] = useCommonDispatcher();
  const isFocused = useIsFocused();
  const {top} = useSafeAreaInsets();
  // const {width} = useWindowDimensions();
  // const [ref, setRef, isReady] = useRefCallback();

  // useEffect(() => {
  //   if (!isReady) {
  //     return;
  //   }
  //   const index = tabs.findIndex(t => t.value === Number(currentTabKey));
  //   setTimeout(() => {
  //     ref.current?.scrollTo({
  //       x: width * index,
  //       y: 0,
  //       animated: true,
  //     });
  //   }, 0);
  // }, [currentTabKey, isReady, ref, width, tabs]);

  useEffect(() => {
    if (isLoggedIn) {
      userDispatcher.getMyDetail();
    }
  }, [userDispatcher, isLoggedIn]);

  function handleCopy() {
    if (detail?.account) {
      Clipboard.setString(detail?.account);
      commonDispatcher.info('复制成功');
    }
  }
  function loginIn() {
    goLogin();
  }

  function goSettings() {
    // userDispatcher.logout();
    navigation.navigate('Settings');
  }

  function goAgentProfile() {
    if (!detail.level) {
      return;
    }
    navigation.navigate('Profile');
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

  function handleChangeTab(key: string) {
    userDispatcher.changeMyTab(Number(key) as MyWorkTabType);
  }

  function renderStatusBar() {
    return <MyStatusBar barStyle="light-content" />;
    // return Platform.OS === 'ios' ? <StatusBar barStyle={showFixTab ? 'dark-content' : 'light-content'} /> : <StatusBar barStyle="dark-content" backgroundColor="#fff" />;
  }

  function loadWork() {
    userDispatcher.loadMyWork(Number(currentTabKey) as MyWorkTabType);
  }

  function handleScrollEnd() {
    if (isFocused) {
      loadWork();
    }
  }
  function goMyShowcase() {
    navigation.navigate('MyShowcase');
  }

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    if (isFocused) {
      userDispatcher.loadMyWork(Number(currentTabKey) as MyWorkTabType, true);
    }
  }, [currentTabKey, isLoggedIn, userDispatcher, isFocused]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {isFocused && renderStatusBar()}
      {showFixTab && (
        <View style={[styles.fixedHeader, {paddingTop: top}]}>
          <Tabs tabs={items} currentKey={currentTabKey} onChange={handleChangeTab} showIndicator style={[styles.fixedTab]} styles={tabStyles} />
        </View>
      )}
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{position: 'relative'}}
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}>
        <Image source={require('../../assets/mine-bg.png')} style={styles.cover} />
        <View style={[styles.container, {paddingTop: 170, paddingBottom: 20}]}>
          {/* 顶部扫码等按钮栏 */}
          <View style={[globalStyles.containerLR, {position: 'absolute', top: top + 10, width: '100%', paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Scanner')}>
              <Icon name="wode_scan48" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={globalStyles.containerLR}>
              {!!isLoggedIn && (
                <>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('MyCode')}>
                    <Icon name="wode_erweima48" size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{marginLeft: globalStyleVariables.MODULE_SPACE}} activeOpacity={0.8} onPress={goSettings}>
                    <Icon name="wode_hanbao48" size={24} color="#fff" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
          <View style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: '#fff'}}>
            {/* 头像栏 */}
            <View style={[styles.userData]}>
              <View style={styles.avatarContainer}>
                <TouchableWithoutFeedback onPress={goAgentProfile}>
                  <View style={{alignItems: 'center'}}>
                    {!!detail.avatar && <Image style={[styles.avatar]} source={{uri: detail.avatar}} />}
                    {!detail.avatar && <Image style={[styles.avatar]} source={require('../../assets/avatar_def.png')} />}
                    {detail?.level === 1 && <Image source={require('../../assets/tag_darensign_xinshou.png')} style={styles.agentBadge} />}
                    {detail?.level === 2 && <Image source={require('../../assets/tag_darensign_zishen.png')} style={styles.agentBadge} />}
                    {detail?.level === 3 && <Image source={require('../../assets/tag_darensign_jinjie.png')} style={styles.agentBadge} />}
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={[globalStyles.containerRow, {justifyContent: 'space-around', flex: 1, height: 62}]}>
                <View style={{alignItems: 'center', flex: 1}}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{detail?.nums?.fansNums}</Text>
                  <Text style={[globalStyles.fontPrimary]}>粉丝</Text>
                </View>
                <View style={{alignItems: 'center', flex: 1}}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{detail?.nums?.followNums}</Text>
                  <Text style={[globalStyles.fontPrimary]}>关注</Text>
                </View>
                <View style={{alignItems: 'center', flex: 1}}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{detail?.nums?.likeNums}</Text>
                  <Text style={[globalStyles.fontPrimary]}>获赞</Text>
                </View>
              </View>
            </View>

            {/* 用户基本信息栏 */}
            <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER, paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
              <View style={globalStyles.containerRow}>
                <Text style={styles.userName} numberOfLines={1}>
                  {detail?.nickName}
                </Text>
                {!isLoggedIn && (
                  <TouchableOpacity activeOpacity={0.8} onPress={loginIn}>
                    <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_PRIMARY, marginLeft: globalStyleVariables.MODULE_SPACE}]}>立即登录</Text>
                  </TouchableOpacity>
                )}
              </View>
              {detail?.account && (
                <View style={[globalStyles.containerRow, globalStyles.halfModuleMarginTop]}>
                  <Text style={[globalStyles.fontPrimary]}>发芽号：{detail?.account}</Text>
                  <TouchableOpacity activeOpacity={0.8} onPress={handleCopy}>
                    <Icon name="all_copy" size={18} color="#ccc" style={{marginLeft: 10}} />
                  </TouchableOpacity>
                </View>
              )}
              <View style={globalStyles.halfModuleMarginTop}>
                <Text style={globalStyles.fontSecondary} numberOfLines={1}>
                  {detail?.say}
                </Text>
              </View>
            </View>

            {!!isLoggedIn && (
              <>
                {/* 订单入口栏 */}
                <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE, paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
                  <TouchableOpacity activeOpacity={0.8} style={{flex: 1}} onPress={() => navigation.navigate('Wallet')}>
                    <View style={[globalStyles.containerRow]}>
                      <View style={[globalStyles.containerCenter, styles.entry]}>
                        <Icon name="wode_qianbao48" color={globalStyleVariables.TEXT_COLOR_PRIMARY} size={24} />
                      </View>
                      <Text>钱包</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{flex: 1}}>
                    {userHasShowcase && (
                      <TouchableOpacity activeOpacity={0.8} style={{flex: 1}} onPress={goMyShowcase}>
                        <View style={[globalStyles.containerRow]}>
                          <View style={[globalStyles.containerCenter, styles.entry]}>
                            <Icon name="wode_chuchuang48" color={globalStyleVariables.TEXT_COLOR_PRIMARY} size={24} />
                          </View>
                          <Text>橱窗</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                  {/* <View style={{flex: 1}} /> */}
                </View>

                {/* 作品分类 */}
                <Tabs
                  tabs={items}
                  currentKey={currentTabKey}
                  onChange={handleChangeTab}
                  showIndicator
                  style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}
                  styles={tabStyles}
                />
                <View>
                  {tabs.map(tab => {
                    const isCurrentTab = String(tab.value) === currentTabKey;
                    if (isCurrentTab) {
                      return (
                        <View key={tab.value}>
                          <WorkList list={allWorks[tab.value]} onClickWork={index => navigation.navigate('MyWorkDetail', {index})} />
                        </View>
                      );
                    } else {
                      return null;
                    }
                  })}
                </View>
                {/* <ScrollView
                  ref={setRef}
                  horizontal
                  style={{marginTop: globalStyleVariables.MODULE_SPACE}}
                  snapToInterval={width}
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={false}>
                  {tabs.map(tab => {
                    return (
                      <View style={{width}} key={tab.value}>
                        <WorkList list={allWorks[tab.value]} onClickWork={index => navigation.navigate('MyWorkDetail', {index})} />
                      </View>
                    );
                  })}
                </ScrollView> */}
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
Mine.defaultProps = {
  title: 'Mine',
};
export default Mine;
const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  cover: {
    width: '100%',
    height: 180,
    position: 'absolute',
    top: 0,
  },
  userData: {
    height: 83,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  agentBadge: {
    width: 93,
    height: 24,
    position: 'absolute',
    bottom: 0,
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
  fixedTab: {
    backgroundColor: '#fff',
  },
  fixedHeader: {
    position: 'absolute',
    backgroundColor: '#fff',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 3,
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
