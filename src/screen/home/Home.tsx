import React, {useEffect} from 'react';
import {View, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {Tabs} from '../../component';
import {TabsStyles} from '../../component/Tabs';
import {globalStyleVariables} from '../../constants/styles';
import {useRefCallback} from '../../fst/hooks';
import {useWorkDispatcher} from '../../helper/hooks';
import {RootState} from '../../redux/reducers';
import WorkList from './WorkList';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {WorkTabType} from '../../models';

const Home: React.FC = () => {
  const currentTab = useSelector((state: RootState) => state.work.currentTab);
  const workState = useSelector((state: RootState) => state.work.works);
  const recommendWorks = useSelector((state: RootState) => state.work.works[WorkTabType.Recommend]);
  const followWorks = useSelector((state: RootState) => state.work.works[WorkTabType.Follow]);
  const nearbyWorks = useSelector((state: RootState) => state.work.works[WorkTabType.Nearby]);
  const tabs = useSelector((state: RootState) => state.work.tabs);
  const {width} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback();

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
        animated: true,
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

  function handleSearch() {
    console.log(1);
  }

  function loadWork(type: WorkTabType) {
    workDispatcher.loadWork(type);
  }
  function refreshWork(type: WorkTabType) {
    workDispatcher.loadWork(type, true);
  }

  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <View style={styles.container}>
        <View style={{position: 'relative'}}>
          <Tabs styles={tabStyles} gap={30} currentKey={currentTab.type} tabs={tabs.map(tab => ({title: tab.title, key: tab.key}))} onChange={handleChangeTab} />
          <View style={styles.searchIcon}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleSearch}>
              <MaterialIcon name="search" size={24} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView ref={setRef} horizontal style={{flex: 1}} snapToInterval={width} showsHorizontalScrollIndicator={false} scrollEnabled={false}>
          <View style={{width}}>
            <WorkList list={followWorks} onRefresh={() => refreshWork(WorkTabType.Follow)} onLoadMore={() => loadWork(WorkTabType.Follow)} />
          </View>
          <View style={{width}}>
            <WorkList list={recommendWorks} onRefresh={() => refreshWork(WorkTabType.Recommend)} onLoadMore={() => loadWork(WorkTabType.Recommend)} />
          </View>
          <View style={{width}}>
            <WorkList list={nearbyWorks} onRefresh={() => refreshWork(WorkTabType.Nearby)} onLoadMore={() => loadWork(WorkTabType.Nearby)} />
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
  workContainer: {
    flex: 1,
    // backgroundColor: '#6cf',
  },
});

const tabStyles: Partial<TabsStyles> = {
  container: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#6cf',
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
