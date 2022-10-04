import {useRoute} from '@react-navigation/native';
import {useRef, useEffect, useCallback, useState, useMemo} from 'react';
import {Animated, AppState, Easing} from 'react-native';
import {ImageLibraryOptions, Asset, launchImageLibrary} from 'react-native-image-picker';
import {FakeRoute} from '../../models/route';

export function useInfinityRotate() {
  const rotateAnim = useRef(new Animated.Value(0)).current; // 初始角度
  useEffect(() => {
    const duration = 150000;
    const animate = Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 180,
        duration,
        easing: Easing.linear,
        isInteraction: false,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 360,
        duration,
        easing: Easing.linear,
        isInteraction: false,
        useNativeDriver: true,
      }),
    ]);
    Animated.loop(animate).start();
  }, [rotateAnim]);
  return rotateAnim;
}

export function useRNSelectPhoto(): [(option?: Partial<ImageLibraryOptions>) => Promise<Asset[]>] {
  const openGallery = useCallback(async (option: Partial<ImageLibraryOptions> = {}) => {
    const defaultOptions: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.5,
      selectionLimit: 6,
    };
    const mergedOptions = {...defaultOptions, ...option};
    try {
      const res = await launchImageLibrary(mergedOptions);
      if (res.didCancel) {
        return [];
      }
      return res.assets || [];
    } catch (error) {
      return [];
    }
  }, []);
  return [openGallery];
}

export function useDivideData<T>(dataSource: T[]): [T[], T[]] {
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  useEffect(() => {
    const leftData = dataSource.filter((item, index) => index % 2 === 0);
    const rightData = dataSource.filter((item, index) => index % 2 !== 0);
    setLeft(leftData);
    setRight(rightData);
  }, [dataSource]);
  return [left, right];
}

export function useParams<T = any>(): T {
  const route = useRoute() as FakeRoute;
  const param = useMemo(() => route.params || {}, [route]);
  return param;
}

export function useAppState() {
  const appStateRef = useRef(AppState.currentState);
  const [appState, setAppState] = useState(appStateRef.current);
  useEffect(() => {
    const subscribe = AppState.addEventListener('change', nextState => {
      appStateRef.current = nextState;
      setAppState(nextState);
    });
    return () => {
      subscribe.remove();
    };
  }, []);

  return appState;
}
