import {Dispatch} from 'redux';
import {VideoInfo, WorkTab} from '../../models';
import {Actions} from './actions';

export interface WorkDispatcher {
  changeTab: (tab: WorkTab) => void;
  setVideoInfo: (videoInfo: VideoInfo) => void;
}

export const getWorkDispatcher = (dispatch: Dispatch): WorkDispatcher => ({
  changeTab: (tab: WorkTab) => dispatch(Actions.changeTab(tab)),
  setVideoInfo: (videoInfo: VideoInfo) => dispatch(Actions.setVideoInfo(videoInfo)),
});
