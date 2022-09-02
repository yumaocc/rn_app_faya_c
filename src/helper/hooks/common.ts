import { useRef, useEffect, useCallback } from "react";
import { Animated, Easing } from "react-native";
import { ImageLibraryOptions, Asset, launchImageLibrary } from "react-native-image-picker";

export function useInfinityRotate() {
  const rotateAnim = useRef(new Animated.Value(0)).current; // 初始角度
  useEffect(() => {
    const duration = 30000;
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
