import React, {useMemo} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {dictOrderState} from '../../../helper/dictionary';
import {OrderF, OrderStatus} from '../../../models';
import {Button} from '../../../component';
import {BoolEnum} from '../../../fst/models';
import Icon from '../../../component/Icon';

interface OrderItemProps {
  order: OrderF;
  onGoDetail?: (id: string) => void;
  onPayAgain?: (id: string) => void;
  onGoComment?: (id: string) => void;
}

const OrderItem: React.FC<OrderItemProps> = props => {
  const {order, onGoDetail, onPayAgain, onGoComment} = props;
  const canComment = useMemo(() => order.status === OrderStatus.Completed && order.evaluated === BoolEnum.FALSE, [order]);
  const commentText = useMemo(() => (order.canGetCommentPackage === BoolEnum.TRUE ? '评价拿红包' : '去评价'), [order]);
  const showBooking = useMemo(() => order?.status === OrderStatus.Paid && order?.needBooking === BoolEnum.TRUE, [order?.needBooking, order?.status]);

  function handleGoDetail() {
    onGoDetail && onGoDetail(order.orderBigIdStr);
  }

  function handlePay() {
    onPayAgain && onPayAgain(order.orderBigIdStr);
  }

  function handleClickOrder() {
    if (order.status === OrderStatus.WaitPay) {
      handlePay();
    } else {
      handleGoDetail();
    }
  }

  return (
    <View style={styles.order}>
      <TouchableOpacity activeOpacity={0.8} onPress={handleClickOrder}>
        <View style={[globalStyles.containerRow, {alignItems: 'flex-start'}]}>
          <Image source={{uri: order.spuCoverImage}} defaultSource={require('../../../assets/sku_def_1_1.png')} style={styles.orderCover} />
          <View style={{flex: 1}}>
            <View style={[globalStyles.containerLR]}>
              <View style={globalStyles.containerRow}>
                <Icon name="shangpin_shanghu24" size={15} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                <Text style={[globalStyles.fontPrimary, globalStyles.moduleMarginLeft]}>{order.bizName}</Text>
              </View>
              <View>
                <Text style={[order.status === OrderStatus.Paid && {color: globalStyleVariables.COLOR_PRIMARY}]}>{dictOrderState(order.status)}</Text>
              </View>
            </View>
            <Text style={[globalStyles.fontPrimary, {lineHeight: 20, marginTop: globalStyleVariables.MODULE_SPACE}]}>{order.skuName}</Text>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_SMALLER}]} />
            <View style={globalStyles.containerLR}>
              <Text style={globalStyles.fontTertiary}>数量</Text>
              <Text style={globalStyles.fontPrimary}>x{order.quantityOfOrder}</Text>
            </View>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_SMALLER}]} />
            <View style={globalStyles.containerLR}>
              <View style={[globalStyles.containerRow, {alignItems: 'flex-end'}]}>
                <Text style={[globalStyles.fontTertiary, {paddingBottom: 3}]}>实付</Text>
                <Text style={[globalStyles.fontPrimary, {padding: 0, marginLeft: 10}]}>
                  <Text>¥</Text>
                  <Text style={{fontSize: 20}}>{order.paidRealMoneyYuan}</Text>
                </Text>
              </View>
              {order.status === OrderStatus.Paid && <Button style={styles.button} type="primary" onPress={handleGoDetail} title="立即使用" />}
              {order.status === OrderStatus.WaitPay && <Button style={styles.button} type="primary" onPress={handlePay} title="立即支付" />}
              {showBooking && <Button style={styles.button} type="primary" onPress={handleGoDetail} title="立即预约" />}
              {canComment && (
                <Button
                  style={styles.button}
                  type="primary"
                  onPress={() => {
                    onGoComment && onGoComment(order.orderBigIdStr);
                  }}
                  title={commentText}
                />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  order: {
    backgroundColor: '#fff',
    marginBottom: globalStyleVariables.MODULE_SPACE,
    borderRadius: 5,
    padding: globalStyleVariables.MODULE_SPACE,
  },
  orderCover: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
  button: {
    height: 30,
    paddingLeft: 7,
    paddingRight: 7,
  },
  buttonText: {
    fontSize: 12,
  },
});
