import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface NavigationBarProps {
  title?: string | React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

const NavigationBar: React.FC<NavigationBarProps> = props => {
  const navigation = useNavigation();
  const safeArea = useSafeAreaInsets();

  function handleBack() {
    navigation.canGoBack && navigation.goBack();
  }

  function renderHeaderLeft() {
    if (props.headerLeft) {
      return props.headerLeft;
    }
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={handleBack}>
        <View style={styles.defaultLeft}>
          <View style={styles.arrow} />
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
        <Text style={styles.titleText} numberOfLines={1}>
          {props.title}
        </Text>
      );
    } else {
      return props.title;
    }
  }

  return (
    <View style={{backgroundColor: '#fff', paddingTop: safeArea.top}}>
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
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  right: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrow: {
    width: 12,
    height: 12,
    marginRight: 5,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    transform: [{rotate: '-45deg'}],
  },
});
