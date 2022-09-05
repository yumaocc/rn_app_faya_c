import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const OrderList: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>orderList</Text>
    </View>
  );
};
OrderList.defaultProps = {
  title: 'OrderList',
};
export default OrderList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
