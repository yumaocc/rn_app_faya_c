import {Dispatch} from 'redux';
import {SPUDetailF} from '../../models';
import {Actions} from './actions';

export interface SPUDispatcher {
  setSPU(spu: SPUDetailF): void;
}

export const getSPUDispatcher = (dispatch: Dispatch) => ({
  setSPU: (spu: SPUDetailF) => dispatch(Actions.setCurrentSPU(spu)),
});
