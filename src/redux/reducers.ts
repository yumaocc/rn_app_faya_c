import {combineReducers} from 'redux';
import common, {CommonState} from './common/reducers';
import user, {UserState} from './user/reducers';

export interface RootState {
  readonly common: CommonState;
  readonly user: UserState;
}

export default combineReducers<RootState>({
  common,
  user,
});
