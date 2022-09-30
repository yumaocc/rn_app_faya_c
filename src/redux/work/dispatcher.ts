import {Dispatch} from 'redux';
import {PublishConfig, SPUF, VideoInfo, WorkTab, WorkTabType} from '../../models';
import {Actions} from './actions';

export interface WorkDispatcher {
  changeTab: (tab: WorkTab) => void;
  setVideoInfo: (videoInfo: VideoInfo) => void;
  setWorkSPU: (spu: SPUF) => void;
  setPublishConfig: (config: PublishConfig) => void;
  loadWork: (tabType: WorkTabType, replace?: boolean) => void;
}

export const getWorkDispatcher = (dispatch: Dispatch): WorkDispatcher => ({
  changeTab: (tab: WorkTab) => dispatch(Actions.changeTab(tab)),
  setVideoInfo: (videoInfo: VideoInfo) => dispatch(Actions.setVideoInfo(videoInfo)),
  setWorkSPU: (spu: SPUF) => dispatch(Actions.setWorkSPU(spu)),
  setPublishConfig: (config: PublishConfig) => dispatch(Actions.setPublishConfig(config)),
  loadWork: (tabType: WorkTabType, replace?: boolean) => dispatch(Actions.loadWork(tabType, replace)),
});
