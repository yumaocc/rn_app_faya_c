import {getItem, setItem} from './helper';

export async function setPhone(phone: string) {
  await setItem('phone', phone);
}
export async function getPhone() {
  return await getItem('phone');
}
