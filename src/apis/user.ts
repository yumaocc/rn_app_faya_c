import {post} from './helper';
import {UserInfo} from '../models';

export async function userLogin(phone: string, code: string): Promise<UserInfo> {
  return await post<UserInfo, {code: string; telephone: string}>('/user/login', {
    telephone: phone,
    code,
  });
}

// 发送验证码
export async function sendVerifyCode(phone: string) {
  return await post<boolean, {telephone: string}>('/user/login/verify/code', {
    telephone: phone,
  });
}
