import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const OrderDetail: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>OrderDetail</Text>
    </View>
  );
};
OrderDetail.defaultProps = {
  title: 'OrderDetail',
};
export default OrderDetail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
