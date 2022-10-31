import {Platform, PermissionsAndroid, Alert, Linking, NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';
import {displayName} from '../../../app.json';
import {APP_SCHEMES} from '../../constants';
import {AppInstallCheckType, ImageCompressOptions, ImageCompressResult, QRCodeScanResult, URLParseRule} from '../../models';
import CameraRoll from '@react-native-community/cameraroll';

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

export function isReachBottom(e: NativeSyntheticEvent<NativeScrollEvent>, offset = 50): boolean {
  var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
  var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
  var scrollViewHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
  return offsetY + scrollViewHeight + offset >= contentSizeHeight;
}

async function hasAndroidStoragePermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

export async function saveImageToGallery(uri: string) {
  const isRemote = uri.startsWith('http');
  if (isRemote) {
    if (Platform.OS === 'ios') {
      // ios可以直接保存远程图片
      return await CameraRoll.save(uri, {type: 'auto'});
    } else {
      const fileName = getFileNameByPath(uri);
      const toPath = RNFS.CachesDirectoryPath + '/' + fileName;
      await RNFS.downloadFile({
        fromUrl: uri,
        toFile: toPath,
      }).promise;
      const hasPermission = await hasAndroidStoragePermission();
      if (!hasPermission) {
        return Promise.reject(new Error('请允许发芽访问您的相册'));
      }
      return await CameraRoll.save(toPath, {type: 'auto'});
    }
  } else {
    // todo: 本地图片保存到相册
  }
}

export function getTempFilePath(fileName: string) {
  return `${RNFS.TemporaryDirectoryPath}/${fileName}`;
}

export function parseLink(content: string, parseRule: URLParseRule): QRCodeScanResult {
  const {home, invite, friend, spu, work} = parseRule;
  const schemeReg = /^([a-zA-Z]+:\/\/)/;
  const scheme = content.match(schemeReg)[1];
  const homeMatch = content.match(new RegExp(home));
  const inviteMatch = content.match(new RegExp(invite));
  const friendMatch = content.match(new RegExp(friend));
  const spuMatch = content.match(new RegExp(spu));
  const workMatch = content.match(new RegExp(work));
  if (friendMatch) {
    const userId = friendMatch[2];
    if (userId) {
      return {
        type: 'friend',
        content,
        isURL: true,
        scheme,
        data: {userId},
      };
    }
  }
  if (inviteMatch) {
    const userId = inviteMatch[2];
    if (userId) {
      return {
        type: 'invite',
        content,
        isURL: true,
        scheme,
        data: {userId},
      };
    }
  }
  if (spuMatch) {
    const spuId = spuMatch[2];
    if (spuId) {
      return {
        type: 'spu',
        content,
        isURL: true,
        scheme,
        data: {spuId},
      };
    }
  }
  if (workMatch) {
    const workId = workMatch[2];
    if (workId) {
      return {
        type: 'work',
        content,
        isURL: true,
        scheme,
        data: {workId},
      };
    }
  }
  if (homeMatch) {
    return {
      type: 'home',
      content,
      isURL: true,
      scheme,
      data: {},
    };
  }
  const urlReg = /^https?:\/\//;
  return {
    type: 'unknown',
    content,
    isURL: urlReg.test(content),
    scheme,
    data: {},
  };
}
