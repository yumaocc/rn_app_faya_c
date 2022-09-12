import {Dispatch} from 'redux';
import {SPUF, VideoInfo, WorkTab} from '../../models';
import {Actions} from './actions';

export interface WorkDispatcher {
  changeTab: (tab: WorkTab) => void;
  setVideoInfo: (videoInfo: VideoInfo) => void;
  setWorkSPU: (spu: SPUF) => void;
}

export const getWorkDispatcher = (dispatch: Dispatch): WorkDispatcher => ({
  changeTab: (tab: WorkTab) => dispatch(Actions.changeTab(tab)),
  setVideoInfo: (videoInfo: VideoInfo) => dispatch(Actions.setVideoInfo(videoInfo)),
  setWorkSPU: (spu: SPUF) => dispatch(Actions.setWorkSPU(spu)),
});
