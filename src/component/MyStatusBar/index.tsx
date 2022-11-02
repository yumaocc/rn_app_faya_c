import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';

interface MyStatusBarProps {
  backgroundColor?: string;
  barStyle?: 'default' | 'light-content' | 'dark-content';
  hasHeight?: boolean;
}

const MyStatusBar: React.FC<MyStatusBarProps> = props => {
  const height = StatusBar.currentHeight || 0;

  return (
    <View style={[styles.container, {height: props.hasHeight ? height : 0}]}>
      <StatusBar translucent backgroundColor={props.backgroundColor} barStyle={props.barStyle} />
    </View>
  );
};

export default MyStatusBar;

MyStatusBar.defaultProps = {
  backgroundColor: 'transparent',
  barStyle: 'dark-content',
  hasHeight: false,
};

const styles = StyleSheet.create({
  container: {},
});
