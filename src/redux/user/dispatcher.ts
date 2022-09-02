import {Dispatch} from 'redux';
import {Actions} from './actions';

export interface UserDispatcher {
  logout(): void;
  
}

export const getUserDispatcher = (dispatch: Dispatch): UserDispatcher => ({
  
  logout: () => dispatch(Actions.logout()),
  
});
