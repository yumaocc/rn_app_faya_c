import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {NavigationBar} from '../../component';
import IconTest from './testComponents/IconTest';

const TestPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <NavigationBar title="测试" />
      <ScrollView style={{flex: 1}}>
        <View />
        {true && <IconTest />}
      </ScrollView>
    </View>
  );
};

export default TestPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
