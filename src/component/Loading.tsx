import React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {StylePropView} from '../models';

interface LoadingProps {
  style?: StylePropView;
}

const Loading: React.FC<LoadingProps> = props => {
  return (
    <View style={[styles.container, props.style]}>
      <LottieView style={styles.animate} source={require('../lottie/loading.json')} autoPlay loop />
    </View>
  );
};

export default Loading;

Loading.defaultProps = {
  style: {},
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animate: {
    width: 100,
  },
});
