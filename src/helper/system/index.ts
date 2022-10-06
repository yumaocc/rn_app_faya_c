import {Platform, PermissionsAndroid, Alert, Linking} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {displayName} from '../../../app.json';
import {APP_SCHEMES} from '../../constants';
import {AppInstallCheckType} from '../../models';

export function getVideoNameByPath(videPath: string) {
  const shortName = videPath.split('/').pop();
  const extName = shortName.split('.').pop();
  if (!extName) {
    return 'upload.mp4';
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
  console.log(scheme);
  if (!scheme) {
    return false;
  } else {
    return await Linking.canOpenURL(scheme);
  }
}
