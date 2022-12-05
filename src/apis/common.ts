import {SearchParam} from '../fst/models';
import {AreaF, LocationCity, URLParseRule} from '../models';
import {originGet, post} from './helper';
import DeviceInfo from 'react-native-device-info';

export async function uploadToOSS(uri: string, fileName: string): Promise<string> {
  const formData = new FormData();
  const file = {uri, type: 'multipart/form-data', name: fileName};
  formData.append('file', file as any);
  return await post('/common/file/upload', formData, {headers: {'Content-Type': 'multipart/form-data'}});
}

export async function getAllCity(): Promise<LocationCity[]> {
  return await post('/location/with/company/all');
}

export async function getKFUrl(): Promise<string> {
  return await post('/center/config/enterprise/wechat/customer/service');
}

export async function getURLParser(): Promise<URLParseRule> {
  return await post('/common/app/scan/rules');
}

export async function report(locate: string, params: SearchParam = {}): Promise<boolean> {
  let info = null;
  try {
    info = {
      version: DeviceInfo.getVersion(),
      apiLevel: DeviceInfo.getApiLevel(),
      brand: DeviceInfo.getBrand(),
      systemName: DeviceInfo.getSystemName(),
      systemVersion: DeviceInfo.getSystemVersion(),
      uniqueId: await DeviceInfo.getUniqueId(),
      buildNumber: DeviceInfo.getBuildNumber(),
      isTablet: DeviceInfo.isTablet(),
      getFirstInstallTime: await DeviceInfo.getFirstInstallTime(),
      getBaseOs: await DeviceInfo.getBaseOs(),
    };
  } catch (error) {}
  return await originGet('http://faya-app-log.cn-beijing.log.aliyuncs.com/logstores/faya-app-web-logstore/track', {
    params: {
      APIVersion: '0.6.0',
      locate, // 用于定位错误位置
      env: __DEV__ ? 'dev' : 'prod',
      ...params,
      deviceInfo: info ? JSON.stringify(info) : null,
    },
  });
}

export async function getArea(): Promise<AreaF[]> {
  return await post('/street/list/all/no/street');
}
