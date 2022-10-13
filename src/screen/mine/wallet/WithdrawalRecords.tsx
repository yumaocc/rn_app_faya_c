import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {NavigationBar} from '../../../component';

const WithdrawalRecords: React.FC = () => {
  return (
    <View style={styles.container}>
      <NavigationBar title="提现记录" />
      <ScrollView style={{flex: 1}}>
        <View>
          <Text>提现记录</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default WithdrawalRecords;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
