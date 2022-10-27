import React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

const Scanner: React.FC = () => {
  const devices = useCameraDevices();
  console.log(devices);
  function handleSuccess(e: any) {
    console.log(e);
  }

  if (!devices.back) {
    return (
      <View style={styles.loading}>
        <Text>loading</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Camera style={{flex: 1}} device={devices.back} isActive />
    </View>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
