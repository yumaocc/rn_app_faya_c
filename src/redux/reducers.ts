import {combineReducers} from 'redux';
import common, {CommonState} from './common/reducers';
import user, {UserState} from './user/reducers';
import work, {WorkState} from './work/reducers';

export interface RootState {
  readonly common: CommonState;
  readonly user: UserState;
  readonly work: WorkState;
}

export default combineReducers<RootState>({
  common,
  user,
  work,
});
