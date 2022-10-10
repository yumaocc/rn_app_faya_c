export type CameraType = 'front' | 'back';

export type AppInstallCheckType = 'alipay' | 'wechat' | 'amap' | 'baidumap' | 'qqmap';

// see https://www.npmjs.com/package/@bam.tech/react-native-image-resizer
export interface ImageCompressOptions {
  path: string;
  quality: number; // 0 - 100, jpg 有效
  width?: number;
  height?: number;
  rotation?: number;
  compressFormat?: 'JPEG' | 'PNG' | 'WEBP'; // android only
  outputPath?: string;
  keepMeta?: boolean; // JPEG 只能用false
  options?: {
    mode?: 'cover' | 'stretch' | 'contain';
    onlyScaleDown?: boolean;
  };
}

export interface ImageCompressResult {
  uri: string;
  path: string;
  name: string;
  size: number;
}
