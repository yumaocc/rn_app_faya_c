import {VideoInfo, WorkTab} from '../../models';
import {ActionsUnion, ActionWithPayload, createAction} from '../types';
import {ActionType} from './types';

export const Actions = {
  changeTab: (tab: WorkTab): ActionWithPayload<ActionType.CHANGE_TAB, WorkTab> => createAction(ActionType.CHANGE_TAB, tab),
  setVideoInfo: (videoInfo: VideoInfo): ActionWithPayload<ActionType.SET_VIDEO_INFO, VideoInfo> => createAction(ActionType.SET_VIDEO_INFO, videoInfo),
};

export type WorkActions = ActionsUnion<typeof Actions>;
