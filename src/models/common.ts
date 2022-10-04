import {StyleProp, TextStyle, ViewStyle} from 'react-native';

export type OSType = 'ios' | 'android' | 'windows' | 'macos' | 'N/A';

export type PlatformType = 'WXMP' | 'WX' | 'DYMP' | 'APP' | 'WEB' | 'H5' | 'DESKTOP' | 'N/A';

export interface AppHeader {
  version?: string;
  platform?: PlatformType;
  os?: string;
  project?: 'FAYABD' | 'FAYAOA' | 'FAYABIZ' | 'FAYA' | string;
  token?: string;
}
export type StylePropText = StyleProp<TextStyle>;
export type StylePropView = StyleProp<ViewStyle>;
export type StylesProp = {
  [key: string]: StylePropText | StylePropView;
};

export type CacheKeys = 'token' | 'phone';

export type LoadingState = 'none' | 'noMore' | 'loading';

export type LoadListState<T> = {
  list: T[];
  index: number;
  status: LoadingState;
};
