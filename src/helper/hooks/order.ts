import {useEffect, useState} from 'react';
import {OrderDetailF} from '../../models';
import * as api from '../../apis';
import {useForceUpdate} from '../../fst/hooks';

export function useOrderDetail(id: string): [OrderDetailF, () => void] {
  const [orderDetail, setOrderDetail] = useState<OrderDetailF>();
  const [signal, update] = useForceUpdate();
  useEffect(() => {
    async function f() {
      const res = await api.order.getOrderDetail(id);
      setOrderDetail(res);
    }
    id && f();
  }, [id, signal]);

  return [orderDetail, update];
}
