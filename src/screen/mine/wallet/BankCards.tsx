import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const BankCards: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>BankCards</Text>
    </View>
  );
};

export default BankCards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
