import {LoadingState, OrderStatus} from '../../models';

export function dictOrderState(state: OrderStatus): string {
  switch (state) {
    case OrderStatus.All:
      return '全部';
    case OrderStatus.WaitPay:
      return '待支付';
    case OrderStatus.Paid:
      return '已支付';
    case OrderStatus.Canceled:
      return '已取消';
    case OrderStatus.Timeout:
      return '已超时';
    case OrderStatus.Completed:
      return '已完成';
    case OrderStatus.Refunding:
      return '退款中';
    case OrderStatus.RefundFailed:
      return '退款失败';
    case OrderStatus.Refunded:
      return '已退款';
    case OrderStatus.Booked:
      return '已预约';
    default:
      return '';
  }
}

export function dictLoadingState(state: LoadingState) {
  switch (state) {
    case 'loading':
      return '正在加载';
    case 'noMore':
      return '没有更多啦';
    case 'none':
      return '滑动加载';
  }
}

export function dictAgentLevel(num: number) {
  if (!num) {
    return '';
  }
  switch (num) {
    case 1:
      return '新手达人';
    case 2:
      return '进阶达人';
    case 3:
      return '资深达人';
    default:
      return '';
  }
}
