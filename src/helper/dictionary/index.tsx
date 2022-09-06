import {OrderStatus} from '../../models';

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
