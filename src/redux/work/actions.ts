import {SPUF, VideoInfo, WorkTab} from '../../models';
import {ActionsUnion, ActionWithPayload, createAction} from '../types';
import {ActionType} from './types';

export const Actions = {
  changeTab: (tab: WorkTab): ActionWithPayload<ActionType.CHANGE_TAB, WorkTab> => createAction(ActionType.CHANGE_TAB, tab),
  setVideoInfo: (videoInfo: VideoInfo): ActionWithPayload<ActionType.SET_VIDEO_INFO, VideoInfo> => createAction(ActionType.SET_VIDEO_INFO, videoInfo),
  setWorkSPU: (spu: SPUF): ActionWithPayload<ActionType.SET_WORK_SPU, SPUF> => createAction(ActionType.SET_WORK_SPU, spu),
};

export type WorkActions = ActionsUnion<typeof Actions>;
