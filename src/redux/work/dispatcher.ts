import {Dispatch} from 'redux';
import {WorkTab} from '../../models';
import {Actions} from './actions';

export interface WorkDispatcher {
  changeTab: (tab: WorkTab) => void;
}

export const getWorkDispatcher = (dispatch: Dispatch): WorkDispatcher => ({
  changeTab: (tab: WorkTab) => dispatch(Actions.changeTab(tab)),
});
