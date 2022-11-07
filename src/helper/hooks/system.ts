import {useEffect, useMemo, useState} from 'react';
import {BackHandler, Dimensions, Keyboard, Platform, useWindowDimensions} from 'react-native';
import {navigateBack} from '../../router/Router';
import DeviceInfo from 'react-native-device-info';
import pkg from '../../../package.json';

export function useAndroidBack() {
  useEffect(() => {
    const subs = BackHandler.addEventListener('hardwareBackPress', () => {
      navigateBack();
      return true;
    });
    return () => {
      subs.remove();
    };
  }, []);
}

/**
 * see https://juejin.cn/post/6898680528598859790
 */
export function useDeviceDimensions(): {width: number; height: number} {
  const {height, width} = useWindowDimensions();
  const screenHeight = useMemo(() => {
    if (Platform.OS === 'ios') {
      return height;
    }
    const screenDimensions = Dimensions.get('screen');
    return screenDimensions.height;
  }, [height]);

  return {width, height: screenHeight};
}

export function useKeyboardHeight(): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return keyboardHeight;
}

export function useVersionInfo() {
  const [version, setVersion] = useState('');
  const [build, setBuild] = useState('');

  useEffect(() => {
    const version = DeviceInfo.getVersion();
    const buildNumber = DeviceInfo.getBuildNumber();
    setVersion(version);
    setBuild(buildNumber);
  }, []);

  const versionText = useMemo(() => {
    if (version && build) {
      return `v${version}(${build})`;
    }
    return '';
  }, [build, version]);

  return {
    version,
    build,
    bundle: pkg.version,
    versionText,
  };
}
