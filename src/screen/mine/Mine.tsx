import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface MineProps {
  title?: string;
}

const Mine: React.FC<MineProps> = props => {
  const {title} = props;
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};
Mine.defaultProps = {
  title: 'Mine',
};
export default Mine;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
