import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Invite: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Invite</Text>
    </View>
  );
};

export default Invite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
