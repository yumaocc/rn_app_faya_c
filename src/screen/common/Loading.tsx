import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {useCommonDispatcher} from '../../helper/hooks';

const Loading: React.FC = () => {
  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    commonDispatcher.initApp();
  }, [commonDispatcher]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/slogan_white.png')} style={styles.slogan} />
    </View>
  );
};
export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF7F63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slogan: {
    marginTop: -240,
    width: 290,
    height: 130,
  },
});
