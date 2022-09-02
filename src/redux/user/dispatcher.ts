import {Dispatch} from 'redux';
import {UserInfo} from '../../models';
import {Actions} from './actions';

export interface UserDispatcher {
  logout(): void;
  setUserInfo(userInfo?: UserInfo): void;
}

export const getUserDispatcher = (dispatch: Dispatch): UserDispatcher => ({
  logout: () => dispatch(Actions.logout()),
  setUserInfo: (userInfo?: UserInfo) => dispatch(Actions.setUserInfo(userInfo)),
});
