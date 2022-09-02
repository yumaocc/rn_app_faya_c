export enum UserState {
  NORMAL = 0,
  BLOCKED = 1, // 禁止登录
}

export interface UserInfo {
  id: number;
  telephone: string;
  status: UserState;
  token: string;
}
