import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface HomeProps {
  title?: string;
}

const Home: React.FC<HomeProps> = props => {
  const {title} = props;
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};
Home.defaultProps = {
  title: 'Home',
};
export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
