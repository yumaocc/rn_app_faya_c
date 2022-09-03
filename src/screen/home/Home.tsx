import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {Tabs} from '../../component';
import {useWorkDispatcher} from '../../helper/hooks';
import {RootState} from '../../redux/reducers';
import WorkList from './WorkList';

const Home: React.FC = () => {
  const currentTab = useSelector((state: RootState) => state.work.currentTab);
  const tabs = useSelector((state: RootState) => state.work.tabs);

  const [workDispatcher] = useWorkDispatcher();

  function handleChangeTab(tab: string) {
    console.log(tab);
    const foundTab = tabs.find(t => t.type === tab);
    if (foundTab) {
      workDispatcher.changeTab(foundTab);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <View style={styles.container}>
        <Tabs currentKey={currentTab.type} tabs={tabs.map(tab => ({title: tab.title, key: tab.key}))} onChange={handleChangeTab} />
        <View style={styles.workContainer}>
          <WorkList />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  workContainer: {
    flex: 1,
    // backgroundColor: '#6cf',
  },
});
