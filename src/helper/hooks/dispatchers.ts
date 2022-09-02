import {useMemo} from 'react';
import {useDispatch} from 'react-redux';
import {CommonDispatcher, getCommonDispatcher, UserDispatcher, getUserDispatcher, WorkDispatcher, getWorkDispatcher} from '../../redux/dispatchers';

export function useCommonDispatcher(): [CommonDispatcher] {
  const dispatch = useDispatch();
  const dispatcher = useMemo(() => getCommonDispatcher(dispatch), [dispatch]);
  return [dispatcher];
}
export function useUserDispatcher(): [UserDispatcher] {
  const dispatch = useDispatch();
  const dispatcher = useMemo(() => getUserDispatcher(dispatch), [dispatch]);
  return [dispatcher];
}
export function useWorkDispatcher(): [WorkDispatcher] {
  const dispatch = useDispatch();
  const dispatcher = useMemo(() => getWorkDispatcher(dispatch), [dispatch]);
  return [dispatcher];
}
