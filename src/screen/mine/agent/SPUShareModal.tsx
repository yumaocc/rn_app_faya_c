import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SPUShareModal: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>SPUShareModal</Text>
    </View>
  );
};

export default SPUShareModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
