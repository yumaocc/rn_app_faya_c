import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {Button, Tabs} from '../../component';
import {TabsStyles} from '../../component/Tabs';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useRefCallback} from '../../fst/hooks';
import {useIsLoggedIn, useWorkDispatcher} from '../../helper/hooks';
import {RootState} from '../../redux/reducers';
import WorkList from './WorkList';
// import Icon from '../../component/Icon';
import {FakeNavigation, WorkTabType} from '../../models';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {goLogin} from '../../router/Router';
import MyStatusBar from '../../component/MyStatusBar';
import Icon from '../../component/Icon';
import {checkUpdate, currentVersion, downloadAndInstallApk, downloadAndInstallPatch, isFirstTime, isRolledBack, markSuccess, switchVersion} from '../../native-modules/Pushy';
import {Modal} from '@ant-design/react-native';
import {DownloadProgressData, UpdateCheck} from '../../native-modules/Pushy/type';
import {Linking} from 'react-native';
import logger from '../../helper/logger';

const Home: React.FC = () => {
  const currentTab = useSelector((state: RootState) => state.work.currentTab);
  const workState = useSelector((state: RootState) => state.work.works);
  const recommendWorks = useSelector((state: RootState) => state.work.works[WorkTabType.Recommend]);
  const followWorks = useSelector((state: RootState) => state.work.works[WorkTabType.Follow]);
  const nearbyWorks = useSelector((state: RootState) => state.work.works[WorkTabType.Nearby]);
  const tabs = useSelector((state: RootState) => state.work.tabs);

  const [showUpdate, setShowUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateCheck>();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progressData, setProgressData] = useState<DownloadProgressData>();
  const showFullUpdate = useMemo(() => {
    return !!updateInfo?.needFullUpdate && !downloadSuccess && !downloading;
  }, [downloadSuccess, downloading, updateInfo?.needFullUpdate]);

  const {width} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback();
  const isFocused = useIsFocused();
  const isLoggedIn = useIsLoggedIn();
  const navigation = useNavigation<FakeNavigation>();

  const [workDispatcher] = useWorkDispatcher();

  // useLog('showUpdate', showUpdate);

  const doDownload = useCallback(async (updateInfo: UpdateCheck) => {
    if (!updateInfo) {
      return;
    }
    setDownloading(true);
    const hash = await downloadAndInstallPatch(updateInfo, {onDownloadProgress: setProgressData});
    setDownloading(false);
    if (hash) {
      setDownloadSuccess(true);
    }
  }, []);

  useEffect(() => {
    if (isFirstTime) {
      markSuccess();
    } else if (isRolledBack) {
      logger.error('Home.tsx/Effect', {currentVersion, isFirstTime, isRolledBack});
    }
  }, []);

  useEffect(() => {
    if (__DEV__) {
      return;
    }
    checkUpdate()
      .then(res => {
        if (res.needFullUpdate || res.needPatchUpdate) {
          setUpdateInfo(res);
          setTimeout(() => {
            setShowUpdate(true);
          }, 1000);
        }
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (!updateInfo) {
      return;
    }
    // 自动下载热更包
    if (updateInfo.needPatchUpdate) {
      doDownload(updateInfo);
    }
  }, [doDownload, updateInfo]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const index = tabs.findIndex(t => t.key === currentTab.key);
    setTimeout(() => {
      ref.current?.scrollTo({
        x: width * index,
        y: 0,
        animated: false,
      });
    }, 0);
  }, [currentTab, isReady, ref, width, tabs]);

  useEffect(() => {
    const workList = workState[currentTab.type];
    const {list, status} = workList;
    if (!list?.length && status === 'none') {
      workDispatcher.loadWork(currentTab.type, true);
    }
  }, [currentTab.type, workDispatcher, workState]);

  function handleChangeTab(tab: string) {
    const foundTab = tabs.find(t => t.type === tab);
    if (foundTab) {
      workDispatcher.changeTab(foundTab);
    }
  }

  // function handleSearch() {
  //   console.log(1);
  // }

  const loadWork = useCallback(
    (type: WorkTabType) => {
      if (currentTab.type !== type) {
        return;
      }
      if (type === WorkTabType.Follow && !isLoggedIn) {
        // 未登录不加载关注列表
        return;
      }
      workDispatcher.loadWork(type);
    },
    [currentTab.type, isLoggedIn, workDispatcher],
  );

  const loadRecommend = useCallback(() => {
    loadWork(WorkTabType.Recommend);
  }, [loadWork]);
  const loadFollow = useCallback(() => {
    loadWork(WorkTabType.Follow);
  }, [loadWork]);
  const loadNearby = useCallback(() => {
    loadWork(WorkTabType.Nearby);
  }, [loadWork]);

  const refreshWork = useCallback(
    (type: WorkTabType) => {
      if (type !== currentTab.type) {
        return;
      }
      if (type === WorkTabType.Follow && !isLoggedIn) {
        // 未登录不加载关注列表
        return;
      }
      workDispatcher.loadWork(type, true);
      return Promise.resolve();
    },
    [currentTab.type, isLoggedIn, workDispatcher],
  );
  const refreshRecommend = useCallback(() => {
    return refreshWork(WorkTabType.Recommend);
  }, [refreshWork]);
  const refreshFollow = useCallback(() => {
    return refreshWork(WorkTabType.Follow);
  }, [refreshWork]);
  const refreshNearby = useCallback(() => {
    return refreshWork(WorkTabType.Nearby);
  }, [refreshWork]);

  function handleScan() {
    navigation.navigate('Scanner');
  }

  function handleCloseUpdate() {
    setShowUpdate(false);
    return true;
  }

  function handleRestart() {
    switchVersion(updateInfo.versionHash);
  }
  // async function handleUpdate() {
  //   doDownload(updateInfo);
  // }
  async function handleFullUpdate() {
    const url = Platform.select({
      ios: updateInfo?.iosUrl || '',
      android: updateInfo?.androidUrl || '',
    });
    if (!url) {
      return;
    }
    if (Platform.OS === 'android' && url.endsWith('.apk')) {
      setDownloading(true);
      downloadAndInstallApk(url, setProgressData);
      setDownloading(false);
    } else {
      Linking.openURL(url);
    }
  }

  // useWhyDidYouUpdate('home加载', {type: currentTab.type, isLoggedIn, workDispatcher, refreshWork, refreshRecommend, loadRecommend, loadWork});

  return (
    <>
      <SafeAreaView edges={['top']} style={{flex: 1, backgroundColor: '#fff'}}>
        {isFocused && <MyStatusBar barStyle="dark-content" />}
        <View style={styles.container}>
          <View style={{position: 'relative', height: 50}}>
            <Tabs styles={tabStyles} gap={30} currentKey={currentTab.type} tabs={tabs.map(tab => ({title: tab.title, key: tab.key}))} onChange={handleChangeTab} />
            <View style={styles.scanIcon}>
              <TouchableOpacity activeOpacity={0.8} onPress={handleScan}>
                <Icon name="wode_scan48" size={24} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView ref={setRef} horizontal style={{flex: 1}} snapToInterval={width} showsHorizontalScrollIndicator={false} scrollEnabled={false}>
            <View style={{width}}>
              {isLoggedIn ? (
                <WorkList list={followWorks} onRefresh={refreshFollow} onLoadMore={loadFollow} />
              ) : (
                <View style={[{paddingTop: 40}, globalStyles.containerCenter]}>
                  <Button style={{marginTop: 10}} title="请先登录" type="primary" onPress={() => goLogin()} />
                </View>
              )}
            </View>
            <View style={{width}}>
              <WorkList list={recommendWorks} onRefresh={refreshRecommend} onLoadMore={loadRecommend} />
            </View>
            <View style={{width}}>
              <WorkList list={nearbyWorks} onRefresh={refreshNearby} onLoadMore={loadNearby} />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      <Modal
        styles={{
          body: {paddingHorizontal: 0, paddingBottom: 0, zIndex: 40},
          innerContainer: {paddingTop: 0, borderRadius: globalStyleVariables.RADIUS_MODAL},
        }}
        style={{width: width - 40}}
        visible={showUpdate}
        onClose={handleCloseUpdate}
        animationType="fade"
        onRequestClose={handleCloseUpdate}
        transparent
        maskClosable={false}>
        <View style={{backgroundColor: '#fff'}}>
          <View style={[globalStyles.containerCenter, {height: 50}]}>
            <Text style={[globalStyles.fontPrimary, {fontSize: 18}]}>版本更新</Text>
          </View>
          <View style={[{paddingHorizontal: 15, paddingVertical: 20}]}>
            <Text style={[globalStyles.fontSecondary, {textAlign: 'center'}]}>
              {downloadSuccess ? '更新完成，点击重启应用' : `检测到新版本，${downloading ? '正在为您更新' : '点击立即更新下载安装新版本'}`}
            </Text>
          </View>

          <View style={[{padding: 15}]}>
            {showFullUpdate && <Button type="primary" onPress={handleFullUpdate} title="立即更新" />}
            {downloadSuccess && <Button type="primary" onPress={handleRestart} title="立即重启" />}
            {downloading && (
              <View style={{width: '100%'}}>
                <Text style={{textAlign: 'center'}}>{progressData ? `${progressData.received}/${progressData.total}` : ''}正在更新</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchIcon: {
    position: 'absolute',
    height: 50,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#fff',
  },
  scanIcon: {
    position: 'absolute',
    height: 50,
    left: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workContainer: {
    flex: 1,
  },
});

const tabStyles: Partial<TabsStyles> = {
  container: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'flex-end',
  },
  tabText: {
    color: globalStyleVariables.TEXT_COLOR_TERTIARY,
    fontSize: 18,
  },
  activeTabText: {
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
};
