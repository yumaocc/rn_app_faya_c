import {useMemo} from 'react';
import {useDispatch} from 'react-redux';
import {
  CommonDispatcher,
  getCommonDispatcher,
  UserDispatcher,
  getUserDispatcher,
} from '../../redux/dispatchers';

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
