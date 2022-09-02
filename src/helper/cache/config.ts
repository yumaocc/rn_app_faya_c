import {getItem, setItem} from './helper';

export async function getToken(): Promise<string> {
  return await getItem('token');
}
export async function setToken(token: string): Promise<void> {
  await setItem('token', token);
}
