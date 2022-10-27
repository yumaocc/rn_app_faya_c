import React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';

const Scanner: React.FC = () => {
  function handleSuccess(e: any) {
    console.log(e);
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Text>Scanner</Text>
    </View>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
