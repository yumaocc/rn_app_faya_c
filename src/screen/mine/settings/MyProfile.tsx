import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MyProfile: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>MyProfile</Text>
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
