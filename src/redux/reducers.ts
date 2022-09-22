import {combineReducers} from 'redux';
import common, {CommonState} from './common/reducers';
import user, {UserState} from './user/reducers';
import work, {WorkState} from './work/reducers';
import spu, {SPUState} from './spu/reducers';
import order, {OrderState} from './order/reducers';

export interface RootState {
  readonly common: CommonState;
  readonly user: UserState;
  readonly work: WorkState;
  readonly spu: SPUState;
  readonly order: OrderState;
}

export default combineReducers<RootState>({
  common,
  user,
  work,
  spu,
  order,
});
