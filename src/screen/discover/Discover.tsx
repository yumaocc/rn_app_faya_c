import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface DiscoverProps {
  title?: string;
}

const Discover: React.FC<DiscoverProps> = props => {
  const {title} = props;
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};
Discover.defaultProps = {
  title: 'Discover',
};
export default Discover;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
