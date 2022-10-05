import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationBar} from '../../component';
import {globalStyleVariables} from '../../constants/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const Refund: React.FC = () => {
  return (
    <View style={styles.container}>
      <NavigationBar
        title="退款"
        headerRight={
          <View style={{paddingRight: globalStyleVariables.MODULE_SPACE}}>
            <MaterialIcon name="support-agent" size={24} color="#333" />
          </View>
        }
      />
      <View style={{flex: 1}}>
        <Text>退款</Text>
      </View>
    </View>
  );
};

export default Refund;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
