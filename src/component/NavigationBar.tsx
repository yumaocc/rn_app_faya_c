import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, BackHandler} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StylePropView} from '../models';
import Icon from '../component/Icon';

interface NavigationBarProps {
  title?: string | React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  safeTop?: boolean;
  style?: StylePropView;
  color?: string;
  canBack?: boolean; // 安卓是否响应默认的返回按钮
}

const NavigationBar: React.FC<NavigationBarProps> = props => {
  const navigation = useNavigation();
  const safeArea = useSafeAreaInsets();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (props.canBack) {
        navigation.goBack();
      }
      return true;
    });
    return () => backHandler.remove();
  }, [navigation, props.canBack]);

  function handleBack() {
    navigation.canGoBack() && navigation.goBack();
  }

  function renderHeaderLeft() {
    if (props.headerLeft) {
      return props.headerLeft;
    }
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={handleBack}>
        <View style={styles.defaultLeft}>
          <Icon name="nav_back48" size={24} color={props.color} />
        </View>
      </TouchableOpacity>
    );
  }
  function renderHeaderRight() {
    if (props.headerRight) {
      return props.headerRight;
    }
    return null;
  }

  function renderTitle() {
    if (!props.title) {
      return null;
    }
    const isString = typeof props.title === 'string';
    if (isString) {
      return (
        <Text style={[styles.titleText, {color: props.color}]} numberOfLines={1}>
          {props.title}
        </Text>
      );
    } else {
      return props.title;
    }
  }

  return (
    <View style={[{paddingTop: props.safeTop ? safeArea.top : 0}, props.style]}>
      <View style={styles.container}>
        <View style={styles.title}>{renderTitle()}</View>
        <View style={styles.left}>{renderHeaderLeft()}</View>
        <View style={styles.right}>{renderHeaderRight()}</View>
      </View>
    </View>
  );
};
NavigationBar.defaultProps = {
  title: '',
  safeTop: true,
  color: '#333',
  canBack: true,
};
export default NavigationBar;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'relative',
    height: 40,
  },
  left: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  right: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 24,
    paddingLeft: 10,
    // paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
