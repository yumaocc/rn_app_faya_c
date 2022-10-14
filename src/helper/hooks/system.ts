import {useEffect} from 'react';
import {BackHandler} from 'react-native';
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
