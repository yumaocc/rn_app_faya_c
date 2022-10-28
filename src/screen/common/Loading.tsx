import React, {useEffect} from 'react';
import {View, Image, StyleSheet, StatusBar} from 'react-native';
import {useCommonDispatcher} from '../../helper/hooks';
// import LottieView from 'lottie-react-native';

const Loading: React.FC = () => {
  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    setTimeout(() => {
      //  显示品牌1s
      commonDispatcher.initApp();
    }, 1000);
  }, [commonDispatcher]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={require('../../assets/slogan_white.png')} style={styles.slogan} />
      {/* <LottieView style={styles.anim} source={require('../../lotties/loading.json')} autoPlay loop /> */}
    </View>
  );
};
export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6F4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slogan: {
    marginTop: -240,
    width: 290,
    height: 130,
  },
  anim: {
    width: 100,
  },
});
