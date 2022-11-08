import {PublishConfig, SPUDetailF, SPUF, VideoInfo, WorkList, WorkTab, WorkTabType} from '../../models';
import {ActionsUnion, ActionWithPayload, createAction, Action} from '../types';
import {ActionType} from './types';

export const Actions = {
  reset: (): Action<ActionType.RESET> => createAction(ActionType.RESET),
  changeTab: (tab: WorkTab): ActionWithPayload<ActionType.CHANGE_TAB, WorkTab> => createAction(ActionType.CHANGE_TAB, tab),
  setVideoInfo: (videoInfo: VideoInfo): ActionWithPayload<ActionType.SET_VIDEO_INFO, VideoInfo> => createAction(ActionType.SET_VIDEO_INFO, videoInfo),
  setWorkSPU: (spu: SPUF | SPUDetailF): ActionWithPayload<ActionType.SET_WORK_SPU, SPUF | SPUDetailF> => createAction(ActionType.SET_WORK_SPU, spu),
  setPublishConfig: (config: PublishConfig): ActionWithPayload<ActionType.SET_PUBLISH_CONFIG, PublishConfig> => createAction(ActionType.SET_PUBLISH_CONFIG, config),
  loadWork: (tabType: WorkTabType, replace?: boolean): ActionWithPayload<ActionType.LOAD_WORK, {replace?: boolean; tabType: WorkTabType}> =>
    createAction(ActionType.LOAD_WORK, {replace, tabType}),
  loadWorkFail: (tabType: WorkTabType): ActionWithPayload<ActionType.LOAD_WORK_FAIL, WorkTabType> => createAction(ActionType.LOAD_WORK_FAIL, tabType),
  loadWorkSuccess: (workList: WorkList, tabType: WorkTabType): ActionWithPayload<ActionType.LOAD_WORK_SUCCESS, {workList: WorkList; tabType: WorkTabType}> =>
    createAction(ActionType.LOAD_WORK_SUCCESS, {workList, tabType}),
};

export type WorkActions = ActionsUnion<typeof Actions>;
