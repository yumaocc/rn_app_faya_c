import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const WithdrawalRecords: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>WithdrawalRecords</Text>
    </View>
  );
};

export default WithdrawalRecords;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
