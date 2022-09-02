import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface NotifyProps {
  title?: string;
}

const Notify: React.FC<NotifyProps> = props => {
  const {title} = props;
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};
Notify.defaultProps = {
  title: 'Notify',
};
export default Notify;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
