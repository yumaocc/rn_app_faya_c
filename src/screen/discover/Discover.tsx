import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
interface DiscoverProps {
  title?: string;
}

const Discover: React.FC<DiscoverProps> = props => {
  const {title} = props;
  return (
    <>
      <View style={styles.container}>
        <View style={styles.bannerContainer}>
          <Image source={{uri: 'https://fakeimg.pl/198?text=loading'}} style={styles.banner} />
        </View>

        <Text>{title}</Text>
      </View>
    </>
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
    backgroundColor: '#6cf',
    position: 'relative',
  },
  bannerContainer: {
    position: 'absolute',
    top: 0,
    height: 150,
  },
  banner: {
    width: '100%',
    height: '100%',
  },
});
