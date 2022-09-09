import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

const ShootVideo: React.FC = () => {
  useEffect(() => {});

  // function handleReady() {
  //   console.log('handle ready');
  // }
  return (
    <>
      <View style={styles.container}>
        {/* <AliyunVideoView onReady={handleReady} color="#66ccff" style={[styles.record]} /> */}
        <View />
      </View>
    </>
  );
};
export default ShootVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  record: {
    flex: 1,
  },
});
