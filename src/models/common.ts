import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {RootStackParamList} from './route';

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

// 发芽使用的站点城市
export interface LocationCity {
  province: string;
  city: string;
  area: string;
  name: string;
  firstLetter: string;
  id: number;
}

export interface SystemConfig {
  token: string;
  phone: string;
  locationId: number;
  locationName: string;
  shareUserId: string;
  touristId: string;
  buyUserName: string;
  buyUserPhone: string;
}

export interface QRCodeScanResult {
  content: string;
  type: 'friend' | 'invite' | 'spu' | 'work' | 'home' | 'unknown';
  isURL: boolean;
  scheme: string;
  data?: any; // 如果是推广码或者好友码，可以带上对应的信息
}

export interface URLParseRule {
  invite: string;
  friend: string;
  spu: string;
  work: string;
  home: string;
}

export interface LocationNavigateInfo {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
}

export type SupportMapAppName = 'amap' | 'qq' | 'baidu' | 'apple';

export interface DeepNavigationParam {
  name: keyof RootStackParamList;
  params?: any;
  key: string;
}

// 省市区数据
export interface AreaF {
  id: number;
  name: string;
  pid: number;
  children?: AreaF[];
}
