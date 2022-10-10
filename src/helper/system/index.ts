import {Platform, PermissionsAndroid, Alert, Linking} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';
import {displayName} from '../../../app.json';
import {APP_SCHEMES} from '../../constants';
import {AppInstallCheckType, ImageCompressOptions, ImageCompressResult} from '../../models';

export function getVideoNameByPath(videPath: string) {
  return getFileNameByPath(videPath, 'upload.mp4');
}

export function getFileNameByPath(filePath: string, defaultName = 'file.png') {
  // return filePath.split('/').pop();
  const shortName = filePath.split('/').pop();
  const extName = shortName.split('.').pop();
  if (!extName) {
    return defaultName;
  }
  return shortName;
}

const hasLocationPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(e => {
      console.log('打开设置失败', e);
    });
  };

  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    Alert.alert('权限被拒绝');
  }

  if (status === 'disabled') {
    Alert.alert(`请在设置中允许"${displayName}"访问您的位置以为您提供更具有地域特色的服务`, '', [
      {text: '去设置', onPress: openSetting},
      {text: '知道了', onPress: () => {}},
    ]);
  }

  return false;
};

const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasLocationPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  // ACCESS_FINE_LOCATION
  // ACCESS_COARSE_LOCATION
  const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }
  if (status === PermissionsAndroid.RESULTS.DENIED) {
    Alert.alert('权限被拒绝');
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    Alert.alert('请允许访问您的位置');
  }

  return false;
};

export async function getLocation(): Promise<Geolocation.GeoPosition> {
  const hasPermission = await hasLocationPermission();

  if (!hasPermission) {
    return Promise.reject(new Error('权限申请失败'));
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position);
      },
      error => {
        reject(error);
      },
      {timeout: 15000, forceLocationManager: true},
    );
  });
}

export async function checkAppInstall(appType: AppInstallCheckType): Promise<boolean> {
  const scheme = APP_SCHEMES[appType];
  if (!scheme) {
    return false;
  } else {
    return await Linking.canOpenURL(scheme);
  }
}

export async function copyFileUrl(uri: string, fileName: string) {
  const destPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
  await RNFS.copyFile(uri, destPath);
  await RNFS.stat(destPath);
  return destPath;
}

export async function compressImage(config: ImageCompressOptions): Promise<ImageCompressResult> {
  let defaultOptions: ImageCompressOptions = {
    path: '',
    quality: 100,
    width: undefined,
    height: undefined,
    compressFormat: 'JPEG',
    outputPath: undefined,
    keepMeta: false,
    rotation: 0,
    options: {
      mode: 'contain',
      onlyScaleDown: true,
    },
  };
  const {path, width, height, compressFormat, quality, rotation, outputPath, keepMeta, options} = Object.assign(defaultOptions, config);

  return await ImageResizer.createResizedImage(path, width, height, compressFormat, quality, rotation, outputPath, keepMeta, options);
}

export async function compressImageUntil(config: ImageCompressOptions, size: number): Promise<ImageCompressResult> {
  const res = await compressImage(config);
  if (res.size > size) {
    const quality = config.quality - 10;
    if (quality <= 0) {
      return Promise.reject(new Error('图片压缩失败'));
    }
    return await compressImageUntil({...config, quality}, size);
  } else {
    return res;
  }
}
