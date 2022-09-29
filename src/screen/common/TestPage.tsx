import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Video, {OnProgressData} from 'react-native-video';
import {Button} from '../../component';
import {getValidPercent} from '../../fst/helper';

const demoVideo = 'http://vod.faya.life/17e7f98a5eba4971b7b79ccbe9d9ea79/a16ce360d97f4235b513bdad9a078807-c82ef6d939b36e5c92bfe67ab02c9ec0-fd.mp4';

const TestPage: React.FC = () => {
  const [paused, setPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  function handleProgress(e: OnProgressData) {
    const {currentTime, seekableDuration} = e;
    // conso
    const p = getValidPercent(Math.round((currentTime / seekableDuration) * 100));
    console.log(p);
    setProgress(p);
  }

  return (
    <View style={styles.container}>
      <Video source={{uri: demoVideo}} paused={paused} style={styles.video} repeat onProgress={handleProgress} />
      <View style={{marginTop: 30}}>
        <Text>{progress}</Text>
        <Button title="播放/暂停" onPress={() => setPaused(!paused)} />
      </View>
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
