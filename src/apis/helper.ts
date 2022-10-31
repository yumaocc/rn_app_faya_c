import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {REQUEST_TIMEOUT} from '../constants';
import {CustomError, PagedData, Response} from '../fst/models';
import {AppHeader} from '../models';
import {Platform} from 'react-native';
import packageJSON from '../../package.json';
import {goLogin} from '../router/Router';
import Crypto from '../helper/crypto';

const currentHeader = axios.defaults.headers.common || {};
const headers: AppHeader = {
  os: `${Platform.OS}|${Platform.Version || 'N/A'}`,
  version: packageJSON.version,
  platform: 'APP',
  project: 'FAYA',
};
axios.defaults.headers.common = {...currentHeader, ...headers, 'Content-Type': 'application/json'};

axios.defaults.timeout = REQUEST_TIMEOUT;

export function resetBaseURL(baseURL: string) {
  axios.defaults.baseURL = baseURL;
}
export function resetToken(token: string) {
  axios.defaults.headers.common.token = token;
}

export function getPublicKey() {
  const key = Crypto.enc.Base64.parse('MDEyMzQ1Njc4OUFCSEFFUQ==');
  const iv = Crypto.enc.Base64.parse('RFlnakNFSU1WcmoyVzl4Tg==');
  return [key, iv];
}

export function encrypt(data: any) {
  const str = JSON.stringify(data);
  const [key, iv] = getPublicKey();
  const encrypted = Crypto.AES.encrypt(str, key, {iv});
  // return encrypted.toString(Crypto.format.Hex);
  return encrypted.toString();
}

export function decrypt(str: string) {
  try {
    const [key, iv] = getPublicKey();
    const decrypted = Crypto.AES.decrypt(str, key, {iv}).toString(Crypto.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    return null;
  }
}

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  console.log(config);
  return config;
});

axios.interceptors.response.use((response: AxiosResponse) => {
  let {data} = response;
  console.log(`接口： ${response.config.url}请求成功：`);
  if (!response.data?.data?.content) {
    // console.log('response data:', response.data);
  } else {
    // console.log('response content: ', response.data.data.content);
  }

  switch (data.code) {
    case 8000:
      goLogin();
      return response;
    default:
      return response;
  }
});

export async function getPaged<T>(url: string, config?: AxiosRequestConfig): Promise<PagedData<T>> {
  const res = await axios.get<Response<T>>(url, config);
  if (res.data.code === 1) {
    return res.data.data;
  }
  throw new CustomError(res.data.msg, res.data.code);
}

export async function postPaged<T, P>(url: string, data?: P, config: AxiosRequestConfig = {}): Promise<PagedData<T>> {
  const mergedConfig = {headers: {'Content-Type': 'application/json'}, ...config};
  const contentType = mergedConfig.headers['Content-Type'];
  let requestData = data;
  const needEncrypt = contentType === 'application/json';

  if (needEncrypt && requestData) {
    requestData = encrypt(requestData);
  }
  const res = await axios.post<Response<T>>(url, requestData, mergedConfig);
  if (res.data.code === 1) {
    const data = res.data.data;
    if (needEncrypt) {
      return {
        ...data,
        content: decrypt(data.content),
      };
    }
    return res.data.data;
  }
  throw new CustomError(res.data.msg, res.data.code);
}

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await getPaged<T>(url, config);
  return res.content;
}
export async function post<T, P>(url: string, data?: P, config?: AxiosRequestConfig): Promise<T> {
  const res = await postPaged<T, P>(url, data, config);
  return res.content;
}
