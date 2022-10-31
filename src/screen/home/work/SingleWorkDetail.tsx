import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SingleWorkDetail: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>SingleWorkDetail</Text>
    </View>
  );
};

export default SingleWorkDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
