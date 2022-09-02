import produce from 'immer';
import {WorkTab} from '../../models';
import {WorkActions} from './actions';
import {ActionType} from './types';

export interface WorkState {
  tabs: WorkTab[];
  currentTab: WorkTab;
}

export const initialState: WorkState = {
  tabs: [WorkTab.Follow, WorkTab.Recommend, WorkTab.Nearby],
  currentTab: WorkTab.Recommend,
};

export default (state = initialState, action: WorkActions): WorkState => {
  switch (action.type) {
    case ActionType.CHANGE_TAB:
      return produce(state, draft => {
        draft.currentTab = action.payload;
      });
    default:
      return state;
  }
};
