import React, {useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '../../component';
import {RecorderView} from '../../native-modules/RecorderView';
import {RecorderViewRef} from '../../native-modules/RecorderView/types';

console.log(RecorderView);

const ShootVideo: React.FC = () => {
  const ref = useRef<RecorderViewRef>(null);
  useEffect(() => {});

  // function handleReady() {
  //   console.log('handle ready');
  // }
  function handleError(e: any) {
    console.log(e);
  }
  function handleClick() {
    ref.current?.sendAction({type: 'startPreview', payload: '123123'});
  }
  return (
    <>
      <View style={styles.container}>
        <RecorderView style={styles.record} ref={ref} onRecordError={handleError} />
        <SafeAreaView style={styles.coverContainer}>
          <Button title="开始录制" onPress={handleClick} />
        </SafeAreaView>
      </View>
    </>
  );
};
export default ShootVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
    position: 'relative',
  },
  record: {
    flex: 1,
  },
  coverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
