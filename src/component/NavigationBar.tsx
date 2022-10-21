import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, BackHandler} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StylePropView} from '../models';
import Icon from '../component/Icon';
import {globalStyleVariables} from '../constants/styles';

interface NavigationBarProps {
  title?: string | React.ReactNode;
  headerLeft?: React.ReactNode | false;
  leftIcon?: React.ReactNode;
  headerRight?: React.ReactNode;
  safeTop?: boolean;
  style?: StylePropView;
  color?: string;
  canBack?: boolean; // 安卓是否响应默认的返回按钮
  onBack?: () => void; // 返回按钮的点击事件，如果指定，会覆盖默认的返回事件
}

// 延伸返回按钮的点击区域
const hitSlop = {
  left: 15,
  right: 15,
  top: 15,
  bottom: 15,
};

const NavigationBar: React.FC<NavigationBarProps> = props => {
  const navigation = useNavigation();
  const safeArea = useSafeAreaInsets();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (props.canBack) {
        navigation.goBack();
        return true;
      } else {
        return false;
      }
    });
    return () => backHandler.remove();
  }, [navigation, props.canBack]);

  function handleBack() {
    if (props.onBack) {
      props.onBack();
      return;
    }
    navigation.canGoBack() && navigation.goBack();
  }

  function renderHeaderLeft() {
    if (props.headerLeft === false) {
      return null;
    }
    if (props.headerLeft) {
      return props.headerLeft;
    }
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={handleBack} hitSlop={hitSlop}>
        <View style={styles.defaultLeft}>{props.leftIcon || <Icon name="nav_back48" width={11} height={24} color={props.color} />}</View>
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
    paddingLeft: globalStyleVariables.MODULE_SPACE,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
