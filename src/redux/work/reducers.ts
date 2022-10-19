import produce from 'immer';
import {PublishConfig, SPUF, VideoInfo, WorkList, WorkTab, WorkTabType} from '../../models';
import {WorkActions} from './actions';
import {ActionType} from './types';

export interface WorkState {
  tabs: WorkTab[];
  currentTab: WorkTab;
  videoInfo?: VideoInfo;
  bindSPU?: SPUF;
  publishConfig?: PublishConfig;
  works: {
    [WorkTabType.Recommend]: WorkList;
    [WorkTabType.Follow]: WorkList;
    [WorkTabType.Nearby]: WorkList;
  };
  // recommendWorks: WorkList;
  // followWorks: WorkList;
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
  works: {
    [WorkTabType.Recommend]: {
      list: [],
      index: 0,
      status: 'none',
    },
    [WorkTabType.Follow]: {
      list: [],
      index: 0,
      status: 'none',
    },
    [WorkTabType.Nearby]: {
      list: [],
      index: 0,
      status: 'none',
    },
  },
};

export default (state = initialState, action: WorkActions): WorkState => {
  switch (action.type) {
    case ActionType.CHANGE_TAB:
      return produce(state, draft => {
        draft.currentTab = action.payload;
      });
    case ActionType.LOAD_WORK:
      return produce(state, draft => {
        const {tabType, replace} = action.payload;
        const work = state.works[tabType];
        if (replace || work.status !== 'noMore') {
          draft.works[tabType].status = 'loading';
        }
      });
    case ActionType.LOAD_WORK_FAIL:
      return produce(state, draft => {
        const type = action.payload;
        draft.works[type].status = 'noMore';
      });
    case ActionType.LOAD_WORK_SUCCESS:
      return produce(state, draft => {
        const {workList, tabType} = action.payload;
        draft.works[tabType] = workList;
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
