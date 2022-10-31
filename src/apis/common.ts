import {LocationCity, URLParseRule} from '../models';
import {post} from './helper';

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
