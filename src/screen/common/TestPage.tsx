import React from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {NavigationBar} from '../../component';
import {globalStyleVariables} from '../../constants/styles';

const wait = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(null), timeout);
  });
};

const TestPage: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // console.log('去刷新');

    wait(1000).then(() => setRefreshing(false));
  }, []);
  return (
    <View style={styles.container}>
      <NavigationBar title="测试" />
      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            title="下拉刷新"
            colors={[globalStyleVariables.COLOR_PRIMARY]}
            titleColor={globalStyleVariables.COLOR_PRIMARY}
            tintColor={globalStyleVariables.COLOR_PRIMARY}
          />
        }>
        <View>
          <View style={{height: 900, backgroundColor: '#6cf'}}>
            <Text>顶部</Text>
          </View>
          <Text>底部</Text>
        </View>
      </ScrollView>
      {/* <Video source={{uri: demoVideo}} paused={paused} style={styles.video} repeat onProgress={handleProgress} />
      <View style={{marginTop: 30}}>
        <Text>{progress}</Text>
        <Button title="播放/暂停" onPress={() => setPaused(!paused)} />
      </View> */}
    </View>
  );
};

export default TestPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    height: 200,
  },
});
