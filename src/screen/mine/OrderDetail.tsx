import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import Icon from '../../component/Icon';
import QRCode from 'react-native-qrcode-svg';
import Popover from 'react-native-popover-view';

import {Modal, NavigationBar} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useParams} from '../../helper/hooks';
import {OrderDetailF, OrderPackageSKU, PayChannel} from '../../models';
import * as api from '../../apis';
import {StylePropView} from '../../models';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {navigateTo} from '../../router/Router';
import {OrderPackage, OrderStatus} from '../../models/order';
import {BoolEnum} from '../../fst/models';
import Loading from '../../component/Loading';
import {useIsFocused} from '@react-navigation/native';
import KFModal from '../common/KFModal';
import MyStatusBar from '../../component/MyStatusBar';
import {callPhone} from '../../helper/system';

const OrderDetail: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const [orderDetail, setOrderDetail] = useState<OrderDetailF>();
  const [showBatch, setShowBatch] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [currentCode, setCurrentCode] = useState<OrderPackageSKU>();
  const [showMenu, setShowMenu] = useState(false);
  const [showKF, setShowKF] = useState(false);
  const orderCompleted = orderDetail?.status === OrderStatus.Completed;
  const orderCanceled = orderDetail?.status === OrderStatus.Canceled;
  const orderCanUse = useMemo(() => [OrderStatus.Booked, OrderStatus.Paid].includes(orderDetail?.status), [orderDetail]);

  const {bottom} = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const loadingDetail = useCallback(async () => {
    if (!id) {
      return;
    }
    const res = await api.order.getOrderDetail(id);
    setOrderDetail(res);
  }, [id]);

  useEffect(() => {
    if (isFocused) {
      loadingDetail();
    }
  }, [isFocused, loadingDetail]);

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

  function goBooking(orderSmallId: string) {
    navigateTo('OrderBooking', {id: orderSmallId});
  }

  function renderCodeItem(orderPackage: OrderPackage, index: number) {
    return (
      <View key={index} style={{marginBottom: globalStyleVariables.MODULE_SPACE}}>
        <Text style={[globalStyles.fontPrimary]}>{orderPackage.packageName}</Text>
        <View style={{marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}}>
          <View>
            {orderPackage.list?.map((sku, i) => {
              const {status, code, codeUrl} = sku;
              const hasCode = !!(code && codeUrl);
              const canUse = [OrderStatus.Booked, OrderStatus.Paid].includes(status);
              const canUseCode = canUse && hasCode;
              const booked = status === OrderStatus.Booked;
              const codeStyle: StylePropView[] = [styles.code];
              const needBooking = orderDetail?.needBooking === BoolEnum.TRUE && status === OrderStatus.Paid;

              if (booked) {
                codeStyle.push(styles.codeBooked);
              }
              return (
                <View key={i} style={codeStyle}>
                  <View style={[globalStyles.containerLR]}>
                    <View>
                      <Text numberOfLines={1} style={[globalStyles.fontPrimary, {color: '#fff', textDecorationLine: canUse ? 'none' : 'line-through'}]}>
                        {sku.code}
                      </Text>
                      <Text style={[globalStyles.fontTertiary, {color: '#ffffffb2', textDecorationLine: canUse ? 'none' : 'line-through'}]}>使用时请出示此二维码</Text>
                    </View>
                    {canUseCode && (
                      <TouchableOpacity activeOpacity={0.8} onPress={() => handleShowCode(sku)}>
                        <Icon name="wode_erweima48" color="#fff" size={24} />
                      </TouchableOpacity>
                    )}
                  </View>
                  {/* 需要预约才显示！ */}
                  <View style={{marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}}>
                    {needBooking && (
                      <TouchableOpacity activeOpacity={0.8} onPress={() => goBooking(sku.orderSmallId)}>
                        <View style={globalStyles.containerRow}>
                          <Text style={[globalStyles.fontTertiary, {color: '#fff'}]}>立即预约</Text>
                          <Icon name="all_arrowR36" color="#fff" size={12} />
                        </View>
                      </TouchableOpacity>
                    )}
                    {booked && (
                      <View style={globalStyles.containerLR}>
                        <View style={{flex: 1}}>
                          <Text numberOfLines={1} style={[globalStyles.fontTertiary, {color: '#ffffffb2'}]}>
                            {sku.bookingDateAndShopAndModel}
                          </Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => goBooking(sku.orderSmallId)}>
                          <View style={globalStyles.containerRow}>
                            <Text style={[globalStyles.fontTertiary, {color: '#fff'}]}>修改预约</Text>
                            <Icon name="all_arrowR36" color="#fff" size={12} />
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
      </View>
    );
  }

  function renderOrderStatus() {
    if (orderCompleted) {
      return (
        <View style={[styles.orderStatus, {backgroundColor: '#333'}]}>
          <Text style={[globalStyles.fontTertiary, styles.orderStatusText]}>订单已完成</Text>
        </View>
      );
    }
    if (orderCanceled) {
      return (
        <View style={[styles.orderStatus, {backgroundColor: '#999'}]}>
          <Text style={[globalStyles.fontTertiary, styles.orderStatusText]}>已取消订单</Text>
        </View>
      );
    }
  }

  return (
    <>
      <View style={styles.container}>
        <MyStatusBar />
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
                  <Icon name="nav_more" size={24} color="#333" style={{marginRight: 20}} />
                </TouchableOpacity>
              }
              popoverStyle={{borderRadius: globalStyleVariables.RADIUS_MODAL}}
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
        {!orderDetail && <Loading style={{marginTop: 150}} />}
        {orderDetail && (
          <>
            {renderOrderStatus()}

            <ScrollView style={{flex: 1, backgroundColor: '#f4f4f4'}}>
              <View style={{paddingBottom: bottom}}>
                <View style={[{padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}]}>
                  <View style={[globalStyles.containerRow, {alignItems: 'flex-start'}]}>
                    <Image source={{uri: orderDetail?.spuCoverImage}} style={styles.orderCover} />
                    <View>
                      <View style={globalStyles.containerRow}>
                        <Icon name="shangpin_shanghu24" size={15} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                        <Text style={globalStyles.fontPrimary}>{orderDetail?.bizName}</Text>
                      </View>
                      <Text style={[globalStyles.fontPrimary]} numberOfLines={2}>
                        {orderDetail.spuName}
                      </Text>
                    </View>
                  </View>
                  {orderCanUse && (
                    <TouchableOpacity activeOpacity={0.8} style={[globalStyles.containerCenter, styles.batchCheck]} onPress={() => setShowBatch(true)}>
                      <Text style={[globalStyles.fontPrimary]}>批量核销</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {orderCanUse && (
                  <View>
                    {/* 电子码 */}
                    <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}}>{orderDetail.list?.map(renderCodeItem)}</View>

                    {/* 可用门店 */}
                    <View style={[{marginTop: globalStyleVariables.MODULE_SPACE, backgroundColor: '#fff', padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
                      <View style={[globalStyles.containerLR, {height: 24}]}>
                        <Text style={[globalStyles.fontStrong]}>可用门店{orderDetail.canUseShops?.length ? `（${orderDetail.canUseShops?.length}）` : ''}</Text>
                        {orderDetail.canUseShops?.length > 1 && <Icon name="all_arrowR36" size={18} color={globalStyleVariables.TEXT_COLOR_SECONDARY} />}
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
                                      <Icon name="shangpin_dianpu_daohang" size={16} color="#49a0ff" />
                                    </View>
                                  </TouchableOpacity>
                                  {shop.shopContactPhone && (
                                    <TouchableOpacity activeOpacity={0.9} onPress={() => callPhone(shop.shopContactPhone)}>
                                      <View style={[styles.shopAction, {marginLeft: globalStyleVariables.MODULE_SPACE}]}>
                                        <Icon name="shangpin_dianpu_dianhua" size={16} color="#48db94" />
                                      </View>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                )}

                {/* 订单信息 */}
                <View style={[{marginTop: globalStyleVariables.MODULE_SPACE, backgroundColor: '#fff', padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
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
                      <Text>总金额：</Text>
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
      {showBatch && (
        <Modal visible={true} onClose={() => setShowBatch(false)} footer={false} title="电子码" styles={{body: styles.modalBody}}>
          <View style={[styles.qrcodeContainer]}>
            <Text style={globalStyles.fontPrimary}>请向商家出示此电子码</Text>
            <View style={[styles.qrcode, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
              <QRCode value={orderDetail?.codeUrl} size={200} />
            </View>
            <Text style={[globalStyles.fontPrimary, {fontSize: 24}]}>{orderDetail?.code}</Text>
          </View>
        </Modal>
      )}

      {/* 单个电子码 */}
      {showCode && (
        <Modal visible={true} onClose={() => setShowCode(false)} footer={false} title="电子码" styles={{body: styles.modalBody}}>
          <View style={[styles.qrcodeContainer]}>
            <Text style={globalStyles.fontPrimary}>请向商家出示此电子码</Text>
            <View style={[styles.qrcode, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
              <QRCode value={currentCode?.codeUrl} size={200} />
            </View>
            <Text style={[globalStyles.fontPrimary, {fontSize: 24}]}>{currentCode?.code}</Text>
          </View>
        </Modal>
      )}
      <KFModal visible={showKF} onClose={() => setShowKF(false)} />
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
    borderRadius: 5,
    marginTop: globalStyleVariables.MODULE_SPACE_BIGGER,
  },
  code: {
    borderRadius: 5,
    backgroundColor: '#42C2BB',
    padding: globalStyleVariables.MODULE_SPACE,
    marginBottom: globalStyleVariables.MODULE_SPACE,
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
    borderRadius: globalStyleVariables.RADIUS_MODAL,
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
  orderStatus: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderStatusText: {
    color: '#fff',
  },
});
