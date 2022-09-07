import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useForceUpdate} from '../../fst/hooks';
import {CouponF, WalletInfo} from '../../models';
import {RootState} from '../../redux/reducers';
import {useUserDispatcher} from './dispatchers';

export function useWallet(): [WalletInfo, () => void] {
  const [signal, force] = useForceUpdate();
  const wallet: WalletInfo = useSelector((state: RootState) => state.user.walletInfo);
  const [userDispatcher] = useUserDispatcher();

  useEffect(() => {
    userDispatcher.getWalletInfo();
  }, [signal, userDispatcher]);

  return [wallet, force];
}

export function useCoupons(): [CouponF[], () => void] {
  const [signal, force] = useForceUpdate();
  const coupons: CouponF[] = useSelector((state: RootState) => state.user.couponList);
  const [userDispatcher] = useUserDispatcher();

  useEffect(() => {
    userDispatcher.getCouponList();
  }, [signal, userDispatcher]);

  return [coupons, force];
}
