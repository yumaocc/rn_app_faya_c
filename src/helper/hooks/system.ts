import {useEffect, useMemo} from 'react';
import {BackHandler, Dimensions, Platform, useWindowDimensions} from 'react-native';
import {navigateBack} from '../../router/Router';

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
