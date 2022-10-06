import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Icon} from '@ant-design/react-native';

import QRCode from 'react-native-qrcode-svg';
import Popover from 'react-native-popover-view';

import {Button, Modal, NavigationBar} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useParams} from '../../helper/hooks';
import {OrderDetailF, OrderPackageSKU, PayChannel} from '../../models';
import * as api from '../../apis';
import {StylePropView} from '../../models';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {navigateTo} from '../../router/Router';

const OrderDetail: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const [orderDetail, setOrderDetail] = React.useState<OrderDetailF>();
  const [showBatch, setShowBatch] = React.useState(false);
  const [showCode, setShowCode] = React.useState(false);
  const [currentCode, setCurrentCode] = React.useState<OrderPackageSKU>();
  const [showMenu, setShowMenu] = React.useState(false);

  const {bottom} = useSafeAreaInsets();

  useEffect(() => {
    async function f() {
      const res = await api.order.getOrderDetail(id);
      setOrderDetail(res);
    }
    id && f();
  }, [id]);

  function handleShowCode(code: OrderPackageSKU) {
    if (code.code && code.codeUrl) {
      setCurrentCode(code);
      setShowCode(true);
    }
  }

  async function handleRefund() {
    setShowMenu(false);
    navigateTo('Refund', {id});
  }

  return (
    <>
      <View style={styles.container}>
        <NavigationBar
          title="订单详情"
          headerRight={
            <Popover
              isVisible={showMenu}
              onRequestClose={() => setShowMenu(false)}
              animationConfig={{
                delay: 0,
                duration: 200,
              }}
              from={
                <TouchableOpacity activeOpacity={0.8} onPress={() => setShowMenu(true)}>
                  <MaterialIcon name="more-horiz" size={24} color="#333" style={{marginRight: 20}} />
                </TouchableOpacity>
              }
              backgroundStyle={{backgroundColor: '#00000011'}}
              arrowSize={{width: 0, height: 0}}>
              <View style={styles.popoverMenu}>
                <TouchableOpacity activeOpacity={0.8} onPress={handleRefund}>
                  <View style={styles.popoverItem}>
                    <Text style={styles.popoverText}>申请退款</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8}>
                  <View style={styles.popoverItem}>
                    <Text style={styles.popoverText}>联系客服</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Popover>
          }
        />
        {!orderDetail && <Text>loading...</Text>}
        {orderDetail && (
          <>
            <View style={[{padding: globalStyleVariables.MODULE_SPACE, backgroundColor: '#fff'}]}>
              <View style={[globalStyles.containerRow, {alignItems: 'flex-start'}]}>
                <Image source={{uri: orderDetail?.spuCoverImage}} style={styles.orderCover} />
                <View>
                  <View style={globalStyles.containerRow}>
                    <MaterialIcon name="storefront" size={15} />
                    <Text style={globalStyles.fontPrimary}>{orderDetail?.bizName}</Text>
                  </View>
                  <Text style={[globalStyles.fontPrimary]} numberOfLines={2}>
                    {orderDetail.spuName}
                  </Text>
                </View>
              </View>
              <Button title="批量核销" style={[styles.batchCheck]} textStyle={{color: globalStyleVariables.TEXT_COLOR_PRIMARY}} onPress={() => setShowBatch(true)} />
            </View>
            <ScrollView style={{flex: 1, backgroundColor: '#f4f4f4'}}>
              <View style={{paddingBottom: bottom}}>
                {/* 电子码 */}
                <View style={{padding: globalStyleVariables.MODULE_SPACE, backgroundColor: '#fff'}}>
                  {orderDetail.list?.map((orderPackage, index) => {
                    return (
                      <View key={index} style={{marginBottom: globalStyleVariables.MODULE_SPACE}}>
                        <Text style={[globalStyles.fontPrimary]}>{orderPackage.packageName}</Text>
                        <View style={{marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}}>
                          {orderPackage.list?.map((sku, i) => {
                            const booked = sku.bookingDateAndShopAndModel; // TODO: 是否预订的判断条件？
                            const codeStyle: StylePropView[] = [styles.code];
                            if (booked) {
                              codeStyle.push(styles.codeBooked);
                            }
                            return (
                              <View key={i} style={codeStyle}>
                                <View style={[globalStyles.containerLR]}>
                                  <View>
                                    <Text numberOfLines={1} style={[globalStyles.fontPrimary, {color: '#fff'}]}>
                                      {sku.code}
                                    </Text>
                                    <Text style={[globalStyles.fontTertiary, {color: '#ffffffb2'}]}>使用时请出示此二维码</Text>
                                  </View>
                                  <TouchableOpacity activeOpacity={0.8} onPress={() => handleShowCode(sku)}>
                                    <Icon name="qrcode" color="#fff" />
                                  </TouchableOpacity>
                                </View>
                                {/* 需要预约才显示！ */}
                                <View style={{marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}}>
                                  {!booked && (
                                    <TouchableOpacity activeOpacity={0.8}>
                                      <View style={globalStyles.containerRow}>
                                        <Text style={[globalStyles.fontTertiary, {color: '#fff'}]}>立即预约</Text>
                                        <Icon name="right" color="#fff" size={12} />
                                      </View>
                                    </TouchableOpacity>
                                  )}
                                  {booked && (
                                    <View style={globalStyles.containerLR}>
                                      <View style={{flex: 1}}>
                                        <Text numberOfLines={1} style={[globalStyles.fontTertiary, {color: '#ffffffb2'}]}>
                                          王大一 2022.04.12 型号名称型号名称型号名称型号名称型号名称
                                        </Text>
                                      </View>
                                      <TouchableOpacity activeOpacity={0.8}>
                                        <View style={globalStyles.containerRow}>
                                          <Text style={[globalStyles.fontTertiary, {color: '#fff'}]}>修改预约</Text>
                                          <Icon name="right" color="#fff" size={12} />
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  )}
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* 可用门店 */}
                <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff', padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
                  <View style={[globalStyles.containerLR, {height: 24}]}>
                    <Text style={[globalStyles.fontStrong]}>可用门店{orderDetail.canUseShops?.length ? `（${orderDetail.canUseShops?.length}）` : ''}</Text>
                    {orderDetail.canUseShops?.length > 1 && <MaterialIcon name="arrow-forward-ios" size={18} color={globalStyleVariables.TEXT_COLOR_SECONDARY} />}
                  </View>
                  <View style={[globalStyles.lineHorizontal, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]} />
                  {/* 店铺列表 */}
                  <View style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}>
                    {orderDetail.canUseShops?.map((shop, index) => {
                      return (
                        <View key={index}>
                          {index !== 0 && (
                            <View style={[globalStyles.lineHorizontal, {height: StyleSheet.hairlineWidth, marginVertical: globalStyleVariables.MODULE_SPACE_BIGGER}]} />
                          )}
                          <Text style={[globalStyles.fontStrong]}>{shop.shopName}</Text>
                          <View style={[globalStyles.containerLR]}>
                            <View style={[{flex: 1}]}>
                              <Text>{shop.shopAddress}</Text>
                            </View>
                            <View style={[globalStyles.containerRow, {marginLeft: globalStyleVariables.MODULE_SPACE}]}>
                              <TouchableOpacity activeOpacity={0.9}>
                                <View style={styles.shopAction}>
                                  <MaterialIcon name="navigation" size={16} color="#49a0ff" />
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.9}>
                                <View style={[styles.shopAction, {marginLeft: globalStyleVariables.MODULE_SPACE}]}>
                                  <MaterialIcon name="call" size={16} color="#48db94" />
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* 订单信息 */}
                <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff', padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
                  <Text style={[globalStyles.fontStrong]}>订单信息</Text>
                  <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_SMALLER}]} />
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={[globalStyles.fontPrimary]}>用户姓名</Text>
                    <Text style={globalStyles.fontSecondary}>{orderDetail?.paidName}</Text>
                  </View>
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={globalStyles.fontPrimary}>联系电话</Text>
                    <Text style={globalStyles.fontSecondary}>{orderDetail?.paidPhone}</Text>
                  </View>
                  <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_SMALLER}]} />
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={globalStyles.fontPrimary}>订单编号</Text>
                    <Text style={globalStyles.fontSecondary}>{orderDetail?.orderBigId}</Text>
                  </View>
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={globalStyles.fontPrimary}>套餐名称</Text>
                    <Text style={globalStyles.fontSecondary}>{orderDetail?.skuName}</Text>
                  </View>
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={globalStyles.fontPrimary}>购买数量</Text>
                    <Text style={globalStyles.fontSecondary}>x{orderDetail?.numberOfProducts || 0}</Text>
                  </View>
                  <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE}]} />
                  {!!orderDetail?.willReturnUserCommission && (
                    <View style={[globalStyles.containerLR, {height: 30}]}>
                      <Text style={globalStyles.fontPrimary}>返芽</Text>
                      <Text style={globalStyles.fontSecondary}>{orderDetail?.willReturnUserCommissionYuan}</Text>
                    </View>
                  )}
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={globalStyles.fontPrimary}>支付方式</Text>
                    <Text style={globalStyles.fontSecondary}>{orderDetail?.ypPayChannel === PayChannel.ALIPAY ? '支付宝' : '微信'}</Text>
                  </View>
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={globalStyles.fontPrimary}>优惠券</Text>
                    <Text style={globalStyles.fontSecondary}>-¥{orderDetail?.usedCouponMoneyYuan}</Text>
                  </View>
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={globalStyles.fontPrimary}>使用芽</Text>
                    <Text style={globalStyles.fontSecondary}>-¥{orderDetail?.usedIntegralMoneyYuan}</Text>
                  </View>
                  <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE}]} />
                  <View>
                    <Text style={[globalStyles.fontPrimary, {textAlign: 'right'}]}>
                      <Text>实际支付：</Text>
                      <Text style={{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 18}}>¥{orderDetail?.paidAllMoneyYuan}</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </>
        )}
      </View>

      {/* 批量核销电子码 */}
      <Modal visible={showBatch} onClose={() => setShowBatch(false)} footer={false} title="电子码" styles={{body: styles.modalBody}}>
        <View style={[styles.qrcodeContainer]}>
          <Text style={globalStyles.fontPrimary}>请向商家出示此电子码</Text>
          <View style={[styles.qrcode, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
            <QRCode value={orderDetail?.codeUrl} size={200} />
          </View>
          <Text style={[globalStyles.fontPrimary, {fontSize: 24}]}>{orderDetail?.code}</Text>
        </View>
      </Modal>

      {/* 单个电子码 */}
      <Modal visible={showCode} onClose={() => setShowCode(false)} footer={false} title="电子码" styles={{body: styles.modalBody}}>
        <View style={[styles.qrcodeContainer]}>
          <Text style={globalStyles.fontPrimary}>请向商家出示此电子码</Text>
          <View style={[styles.qrcode, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
            <QRCode value={currentCode?.codeUrl} size={200} />
          </View>
          <Text style={[globalStyles.fontPrimary, {fontSize: 24}]}>{currentCode?.code}</Text>
        </View>
      </Modal>
    </>
  );
};
OrderDetail.defaultProps = {
  title: 'OrderDetail',
};
export default OrderDetail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  orderCover: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
  batchCheck: {
    backgroundColor: '#0000000D',
    borderWidth: 0,
    height: 40,
    marginTop: globalStyleVariables.MODULE_SPACE,
  },
  code: {
    borderRadius: 5,
    backgroundColor: '#42C2BB',
    padding: globalStyleVariables.MODULE_SPACE_SMALLER,
  },
  codeBooked: {
    backgroundColor: '#409FF5',
  },
  shopAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0000000D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    width: 260,
  },
  qrcodeContainer: {
    alignItems: 'center',
    // paddingVertical: 20,
    paddingBottom: 20,
  },
  qrcode: {
    width: 200,
    height: 200,
    backgroundColor: '#000',
  },
  popoverMenu: {
    padding: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
    borderRadius: 5,
    width: 100,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: globalStyleVariables.BORDER_COLOR,
  },
  popoverItem: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popoverText: {
    fontSize: 15,
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
});
