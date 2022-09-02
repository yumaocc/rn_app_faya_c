import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {REQUEST_TIMEOUT} from '../constants';
import {CustomError, PagedData, Response} from '../fst/models';
import {AppHeader} from '../models';
import {Platform} from 'react-native';
import packageJSON from '../../package.json';

const currentHeader = axios.defaults.headers.common || {};
const headers: AppHeader = {
  os: `${Platform.OS}|${Platform.Version || 'N/A'}`,
  version: packageJSON.version,
  platform: 'APP',
  project: 'FAYA',
};
axios.defaults.headers.common = {...currentHeader, ...headers};

console.log('headers', headers);

axios.defaults.timeout = REQUEST_TIMEOUT;

export function resetBaseURL(baseURL: string) {
  axios.defaults.baseURL = baseURL;
}
export function resetToken(token: string) {
  axios.defaults.headers.common.token = token;
}

axios.interceptors.response.use((response: AxiosResponse) => {
  const {data} = response;
  switch (data.code) {
    case 8000:
      // fixme: 导航怎么办
      // location.href = '/#/login';
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

export async function postPaged<T, P>(url: string, data?: P, config?: AxiosRequestConfig): Promise<PagedData<T>> {
  const res = await axios.post<Response<T>>(url, data, config);
  if (res.data.code === 1) {
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
