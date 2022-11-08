import React, {useEffect} from 'react';
import {View, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity} from 'react-native';
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

const Home: React.FC = () => {
  const currentTab = useSelector((state: RootState) => state.work.currentTab);
  const workState = useSelector((state: RootState) => state.work.works);
  const recommendWorks = useSelector((state: RootState) => state.work.works[WorkTabType.Recommend]);
  const followWorks = useSelector((state: RootState) => state.work.works[WorkTabType.Follow]);
  const nearbyWorks = useSelector((state: RootState) => state.work.works[WorkTabType.Nearby]);
  const tabs = useSelector((state: RootState) => state.work.tabs);

  const {width} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback();
  const isFocused = useIsFocused();
  const isLoggedIn = useIsLoggedIn();
  const navigation = useNavigation<FakeNavigation>();

  const [workDispatcher] = useWorkDispatcher();

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

  function loadWork(type: WorkTabType) {
    if (type === WorkTabType.Follow && !isLoggedIn) {
      // 未登录不加载关注列表
      return;
    }
    workDispatcher.loadWork(type);
  }
  function refreshWork(type: WorkTabType) {
    if (type === WorkTabType.Follow && !isLoggedIn) {
      // 未登录不加载关注列表
      return;
    }
    workDispatcher.loadWork(type, true);
    return Promise.resolve();
  }

  function handleScan() {
    navigation.navigate('Scanner');
  }

  return (
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
              <WorkList
                list={followWorks}
                onRefresh={() => refreshWork(WorkTabType.Follow)}
                onLoadMore={() => {
                  if (currentTab.type === WorkTabType.Follow) {
                    loadWork(WorkTabType.Follow);
                  }
                }}
              />
            ) : (
              <View style={[{paddingTop: 40}, globalStyles.containerCenter]}>
                <Button style={{marginTop: 10}} title="请先登录" type="primary" onPress={goLogin} />
              </View>
            )}
          </View>
          <View style={{width}}>
            <WorkList
              list={recommendWorks}
              onRefresh={() => refreshWork(WorkTabType.Recommend)}
              onLoadMore={() => {
                if (currentTab.type === WorkTabType.Recommend) {
                  loadWork(WorkTabType.Recommend);
                }
              }}
            />
          </View>
          <View style={{width}}>
            <WorkList
              list={nearbyWorks}
              onRefresh={() => refreshWork(WorkTabType.Nearby)}
              onLoadMore={() => {
                if (currentTab.type === WorkTabType.Nearby) {
                  loadWork(WorkTabType.Nearby);
                }
              }}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
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
