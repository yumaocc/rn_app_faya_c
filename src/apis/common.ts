import {post} from './helper';

export async function uploadToOSS(uri: string, fileName: string): Promise<string> {
  const formData = new FormData();
  const file = {uri, type: 'multipart/form-data', name: fileName};
  formData.append('file', file as any);
  return await post('/common/file/upload', formData, {headers: {'Content-Type': 'multipart/form-data'}});
}
