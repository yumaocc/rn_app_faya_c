import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useForceUpdate} from '../../fst/hooks';
import {CouponF, CouponFilterState, WalletInfo, WalletSummary} from '../../models';
import {RootState} from '../../redux/reducers';
import {useCommonDispatcher, useUserDispatcher} from './dispatchers';
import * as api from '../../apis';

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

export function useUsedCoupons(): [CouponF[], () => void] {
  const [signal, force] = useForceUpdate();
  const [coupons, setCoupons] = useState([]);
  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    api.user.getCouponList(CouponFilterState.Used).then(setCoupons).catch(commonDispatcher.error);
    setCoupons([]);
  }, [commonDispatcher, signal]);

  return [coupons, force];
}

export function useInvalidCoupons(): [CouponF[], () => void] {
  const [signal, force] = useForceUpdate();
  const [coupons, setCoupons] = useState([]);
  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    api.user.getCouponList(CouponFilterState.Invalid).then(setCoupons).catch(commonDispatcher.error);
    setCoupons([]);
  }, [commonDispatcher, signal]);

  return [coupons, force];
}

export function useWalletSummary(): [WalletSummary, () => void] {
  const [signal, force] = useForceUpdate();
  const walletSummary: WalletSummary = useSelector((state: RootState) => state.user.walletSummary);
  const [userDispatcher] = useUserDispatcher();

  useEffect(() => {
    userDispatcher.getWalletSummary();
  }, [signal, userDispatcher]);

  return [walletSummary, force];
}
