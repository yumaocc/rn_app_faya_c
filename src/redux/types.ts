import {ActionType as UserActionType} from './user/types';
import {ActionType as CommonActionType} from './common/types';
import {ActionType as WorkActionType} from './work/types';
import {ActionType as SPUActionType} from './spu/types';
import {ActionType as OrderActionType} from './order/types';

export type ActionType = UserActionType | CommonActionType | WorkActionType | SPUActionType | OrderActionType;

export interface Action<T extends ActionType> {
  type: T;
}

export interface ActionWithPayload<T extends ActionType, P> extends Action<T> {
  payload: P;
}

export function createAction<T extends ActionType>(type: T): Action<T>;
export function createAction<T extends ActionType, P>(type: T, payload: P): ActionWithPayload<T, P>;
export function createAction<T extends ActionType, P>(type: T, payload?: P): Action<T> | ActionWithPayload<T, P> {
  return payload === undefined ? {type} : {type, payload};
}

type FunctionType = (...args: any[]) => any;
type ActionCreatorsMapObject = {[actionCreator: string]: FunctionType};

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;
