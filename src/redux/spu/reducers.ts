import {SPUDetailF} from '../../models';
import {SPUActions} from './actions';

export interface SPUState {
  currentSPU?: SPUDetailF;
}

export const initialState: SPUState = {};

export default (state: SPUState = initialState, action: SPUActions) => {
  switch (action.type) {
    default:
      return state;
  }
};
