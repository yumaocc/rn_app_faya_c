import React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {NavigationBar} from '../../../component';

const Profile: React.FC = () => {
  return (
    <View style={styles.container}>
      <NavigationBar title="达人主页" />
      <StatusBar barStyle="dark-content" />
      <Text>Profile</Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
