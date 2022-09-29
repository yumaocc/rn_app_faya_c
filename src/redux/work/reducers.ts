import produce from 'immer';
import {PublishConfig, SPUF, VideoInfo, WorkTab, WorkTabType} from '../../models';
import {WorkActions} from './actions';
import {ActionType} from './types';

export interface WorkState {
  tabs: WorkTab[];
  currentTab: WorkTab;
  videoInfo?: VideoInfo;
  bindSPU?: SPUF;
  publishConfig?: PublishConfig;
}

export const initialState: WorkState = {
  tabs: [
    {title: '关注', type: WorkTabType.Follow, key: WorkTabType.Follow},
    {title: '推荐', type: WorkTabType.Recommend, key: WorkTabType.Recommend},
    {title: '附近', type: WorkTabType.Nearby, key: WorkTabType.Nearby},
  ],
  currentTab: {
    title: '推荐',
    type: WorkTabType.Recommend,
    key: WorkTabType.Recommend,
  },
};

export default (state = initialState, action: WorkActions): WorkState => {
  switch (action.type) {
    case ActionType.CHANGE_TAB:
      return produce(state, draft => {
        draft.currentTab = action.payload;
      });
    case ActionType.SET_VIDEO_INFO:
      return produce(state, draft => {
        draft.videoInfo = action.payload;
      });
    case ActionType.SET_WORK_SPU:
      return produce(state, draft => {
        draft.bindSPU = action.payload;
      });
    case ActionType.SET_PUBLISH_CONFIG:
      return produce(state, draft => {
        draft.publishConfig = action.payload;
      });
    case ActionType.RESET:
      return initialState;
    default:
      return state;
  }
};
