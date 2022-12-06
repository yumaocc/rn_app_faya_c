import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions} from 'react-native';
import Icon from '../../component/Icon';
import QRCode from 'react-native-qrcode-svg';
// import {Popover} from '@ant-design/react-native';
import Popover from 'react-native-popover-view';

import {Modal, NavigationBar} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useCommonDispatcher, useParams} from '../../helper/hooks';
import {LocationNavigateInfo, OrderDetailF, OrderPackageSKU, PayChannel} from '../../models';
import * as api from '../../apis';
import {StylePropView} from '../../models';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {navigateTo} from '../../router/Router';
import {ExpressInfo, OrderPackage, OrderShop, OrderStatus} from '../../models/order';
import {BoolEnum} from '../../fst/models';
import Loading from '../../component/Loading';
import {useIsFocused} from '@react-navigation/native';
import KFModal from '../common/KFModal';
import MyStatusBar from '../../component/MyStatusBar';
import {callPhone, openMap} from '../../helper/system';
import NavigationModal from '../common/NavigateModal';
import Clipboard from '@react-native-clipboard/clipboard';
import {reFormatDate} from '../../fst/helper';

const OrderDetail: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const [orderDetail, setOrderDetail] = useState<OrderDetailF>();
  const [showBatch, setShowBatch] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [currentCode, setCurrentCode] = useState<OrderPackageSKU>();
  const [showMenu, setShowMenu] = useState(false);
  const [showKF, setShowKF] = useState(false);
  const [showSelectMap, setShowSelectMap] = useState(false);
  const [navigationInfo, setNavigationInfo] = useState<LocationNavigateInfo>(null);
  const [expressExpand, setExpressExpand] = useState(false); // 是否展开物流信息
  const [expressInfoList, setExpressInfoList] = useState<ExpressInfo[]>([]);
  const [currentExpressIndex, setCurrentExpressIndex] = useState(0);
  const orderCompleted = orderDetail?.status === OrderStatus.Completed;
  const orderCanceled = orderDetail?.status === OrderStatus.Canceled;
  const orderCanUse = useMemo(() => [OrderStatus.Booked, OrderStatus.Paid].includes(orderDetail?.status), [orderDetail]);
  const [commonDispatcher] = useCommonDispatcher();
  const {height} = useWindowDimensions();
  const canShowRefund = useMemo(() => {
    return [OrderStatus.Paid, OrderStatus.Booked, OrderStatus.Completed].includes(orderDetail?.status);
  }, [orderDetail?.status]);

  const {bottom} = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const loadingDetail = useCallback(async () => {
    if (!id) {
      return;
    }
    const res = await api.order.getOrderDetail(id);
    setOrderDetail(res);
  }, [id]);

  // 从预约或者其他地方过来，也需要刷新
  useEffect(() => {
    if (isFocused) {
      loadingDetail();
    }
  }, [isFocused, loadingDetail]);

  //有订单详情后，去请求物流信息
  useEffect(() => {
    if (!orderDetail) {
      return;
    }
    if (orderDetail.needExpress === BoolEnum.TRUE && orderDetail.expressList?.length) {
      const telephone = orderDetail.userAddress?.contactPhone;
      const tasks: Promise<ExpressInfo>[] = [];
      orderDetail.expressList.forEach(expressNo => {
        const task = api.order.checkExpressInfo({telephone, no: expressNo});
        tasks.push(task);
      });
      Promise.all(tasks)
        .then(res => {
          setExpressInfoList(res);
        })
        .catch(commonDispatcher.error);
    }
  }, [commonDispatcher.error, orderDetail]);

  function handleShowCode(code: OrderPackageSKU) {
    if (code.code && code.codeUrl) {
      setCurrentCode(code);
      setShowCode(true);
    }
  }

  // function handleSelect(key: string) {
  //   // console.log('key', key);
  //   switch (key) {
  //     case 'refund':
  //       navigateTo('Refund', {id});
  //       break;
  //     case 'kf':
  //       setTimeout(() => {
  //         setShowKF(true);
  //       }, 0);
  //       break;
  //   }
  // }

  function handleRefund() {
    setShowMenu(false);
    navigateTo('Refund', {id});
  }
  function openKf() {
    setShowMenu(false);
    setShowKF(true);
  }

  function goBooking(orderSmallId: string) {
    navigateTo('OrderBooking', {id: orderSmallId});
  }

  const goNavigation = useCallback((shop: OrderShop) => {
    setNavigationInfo({
      name: shop.shopName,
      address: shop.shopAddress,
      latitude: shop.latitude,
      longitude: shop.longitude,
    });
    setShowSelectMap(true);
  }, []);

  function onCopy(text: string) {
    if (text) {
      Clipboard.setString(text);
      commonDispatcher.info('复制成功');
    }
  }

  function renderCodeItem(orderPackage: OrderPackage, index: number) {
    return (
      <View key={index} style={{marginBottom: globalStyleVariables.MODULE_SPACE}}>
        <Text style={[globalStyles.fontPrimary]}>{orderPackage.packageName}</Text>
        <View style={{marginTop: globalStyleVariables.MODULE_SPACE}}>
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

  // 渲染物流信息
  function renderExpressInfo() {
    const expressInfo = expressInfoList?.find((e, i) => i === currentExpressIndex);
    if (!expressInfo) {
      return null;
    }
    if (!expressExpand) {
      // 未展开物流信息
      const first = expressInfo.list[0];
      return (
        <>
          <View style={[globalStyles.containerRow, {alignItems: 'flex-start', paddingVertical: 15}]}>
            <View style={[globalStyles.containerCenter, {height: 24, width: 24}]}>
              <View style={[styles.dot]} />
            </View>
            <View style={{flex: 1}}>
              <Text style={[globalStyles.fontPrimary, {lineHeight: 24}]}>{first.status}</Text>
              <View>
                <Text style={[globalStyles.fontTertiary]}>{first.time}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => setExpressExpand(true)}>
            <View style={[globalStyles.containerCenter, {height: 50}]}>
              <Text style={[{color: globalStyleVariables.COLOR_LINK}]}>展开物流信息</Text>
            </View>
          </TouchableOpacity>
        </>
      );
    }
    return (
      <ScrollView style={{maxHeight: height / 2}}>
        {expressInfo.list.map((info, index) => {
          const isFirst = index === 0;
          const isLast = index === expressInfo.list.length - 1;
          return (
            <View key={index} style={[globalStyles.containerRow, {alignItems: 'flex-start'}]}>
              <View style={[{height: '100%', alignItems: 'center'}]}>
                <View style={{width: StyleSheet.hairlineWidth, height: 24, backgroundColor: isFirst ? 'transparent' : '#d9d9d9'}} />
                <View style={[globalStyles.containerCenter]}>
                  <View style={[styles.dot]} />
                </View>
                <View style={{width: StyleSheet.hairlineWidth, flex: 1, backgroundColor: isLast ? 'transparent' : '#d9d9d9'}} />
              </View>

              <View style={{flex: 1, padding: 15}}>
                <Text style={[globalStyles.fontPrimary, {lineHeight: 24, color: isFirst ? '#333' : '#999'}]}>{info.status}</Text>
                <View>
                  <Text style={[globalStyles.fontTertiary]}>{info.time}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <MyStatusBar />
        <NavigationBar
          title="订单详情"
          headerRight={
            // <Popover
            //   overlay={[
            //     <Popover.Item key="refund" value="refund">
            //       <Text style={styles.popoverText}>申请退款</Text>
            //     </Popover.Item>,
            //     <Popover.Item key="kf" value="kf">
            //       <Text style={styles.popoverText}>联系客服</Text>
            //     </Popover.Item>,
            //   ]}
            //   onSelect={handleSelect}
            //   placement="bottom">
            //   <Icon name="nav_more" size={24} color="#333" style={{marginRight: 20}} />
            // </Popover>

            <Popover
              isVisible={showMenu}
              onRequestClose={() => setShowMenu(false)}
              animationConfig={{
                delay: 0,
                duration: 16,
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
                {canShowRefund && (
                  <TouchableOpacity activeOpacity={0.8} onPress={handleRefund}>
                    <View style={styles.popoverItem}>
                      <Text style={styles.popoverText}>申请退款</Text>
                    </View>
                  </TouchableOpacity>
                )}

                <TouchableOpacity activeOpacity={0.8} onPress={openKf}>
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
              {/* 用户收货地址 */}
              {!!orderDetail?.userAddress && (
                <View style={{marginBottom: 10}}>
                  <View style={[{padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}]}>
                    <View>
                      <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>
                        {orderDetail?.userAddress.province}
                        {orderDetail?.userAddress.city}
                        {orderDetail?.userAddress.area}
                      </Text>
                    </View>
                    <View>
                      <Text style={[globalStyles.fontPrimary, {fontSize: 18}]}>{orderDetail?.userAddress.detailAddress}</Text>
                    </View>
                    <View style={[globalStyles.containerRow]}>
                      <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>
                        {orderDetail?.userAddress.name} {orderDetail?.userAddress.contactPhone}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              {/* 用户物流信息 */}
              {orderDetail?.needExpress === BoolEnum.TRUE && (
                <View style={{marginBottom: 10}}>
                  {expressInfoList?.length ? (
                    <View style={[{paddingHorizontal: 15, paddingTop: 15, backgroundColor: '#fff'}]}>
                      {/* 大于1个物流信息时展示 */}
                      {expressInfoList?.length > 1 && (
                        <ScrollView horizontal>
                          {expressInfoList.map((_, i) => {
                            const active = i === currentExpressIndex;
                            const wrapperStyle = {backgroundColor: active ? '#ff59341a' : '#00000008'};
                            const textStyle = {color: active ? globalStyleVariables.COLOR_PRIMARY : '#333'};
                            return (
                              <TouchableOpacity key={i} onPress={() => setCurrentExpressIndex(i)}>
                                <View style={[{marginRight: 10, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 5}, wrapperStyle]}>
                                  <Text style={[textStyle]}>包裹{i + 1}</Text>
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      )}
                      {renderExpressInfo()}
                    </View>
                  ) : (
                    <View style={[{backgroundColor: '#fff', padding: 15}]}>
                      <Text>物流信息</Text>
                      <View style={[globalStyles.lineHorizontal, {marginVertical: 10}]} />
                      <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_PRIMARY}]}>等待发货</Text>
                    </View>
                  )}
                </View>
              )}
              <View style={{paddingBottom: bottom}}>
                <View style={[{padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}]}>
                  <View style={[globalStyles.containerRow, {alignItems: 'flex-start'}]}>
                    <Image source={{uri: orderDetail?.spuCoverImage}} style={styles.orderCover} />
                    <View>
                      <View style={globalStyles.containerRow}>
                        <Icon name="shangpin_shanghu24" size={15} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                        <Text style={[globalStyles.fontPrimary, {fontSize: 12, marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER}]}>{orderDetail?.bizName}</Text>
                      </View>
                      <Text style={[globalStyles.fontPrimary, {lineHeight: 20, marginTop: globalStyleVariables.MODULE_SPACE}]} numberOfLines={2}>
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
                    {!!orderDetail?.canUseShops?.length && (
                      <View style={[{marginTop: globalStyleVariables.MODULE_SPACE, backgroundColor: '#fff', padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
                        <View style={[globalStyles.containerLR, {height: 24}]}>
                          <Text style={[globalStyles.fontStrong]}>可用门店（{orderDetail.canUseShops?.length}）</Text>
                          {orderDetail.canUseShops?.length > 1 && <Icon name="all_arrowR36" size={18} color={globalStyleVariables.TEXT_COLOR_SECONDARY} />}
                        </View>
                        <View style={[globalStyles.lineHorizontal, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]} />
                        {/* 店铺列表 */}
                        <View style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}>
                          {orderDetail.canUseShops?.map((shop, index) => {
                            const showNavigation = shop.latitude && shop.longitude;
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
                                    {showNavigation && (
                                      <TouchableOpacity activeOpacity={0.9} onPress={() => goNavigation(shop)}>
                                        <View style={styles.shopAction}>
                                          <Icon name="shangpin_dianpu_daohang" size={16} color="#49a0ff" />
                                        </View>
                                      </TouchableOpacity>
                                    )}
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
                    )}
                  </View>
                )}

                {/* 订单信息 */}
                <View style={[{marginTop: globalStyleVariables.MODULE_SPACE, backgroundColor: '#fff', padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
                  <View style={{height: 24}}>
                    <Text style={[globalStyles.fontStrong]}>订单信息</Text>
                  </View>
                  {/* <View style={[globalStyles.lineHorizontal, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]} /> */}
                  <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_SMALLER}]} />
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={[globalStyles.fontPrimary]}>用户姓名</Text>
                    <Text style={globalStyles.fontSecondary}>{orderDetail?.paidName}</Text>
                  </View>
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={globalStyles.fontPrimary}>联系电话</Text>
                    <Text style={globalStyles.fontSecondary}>{orderDetail?.paidPhone}</Text>
                  </View>
                  {orderDetail?.canBookingTime && (
                    <View style={[globalStyles.containerLR, {height: 30}]}>
                      <Text style={globalStyles.fontPrimary}>开始预约时间</Text>
                      <Text style={globalStyles.fontSecondary}>{orderDetail?.canBookingTime}</Text>
                    </View>
                  )}

                  {orderDetail?.useBeginTime && orderDetail?.useEndTime && (
                    <View style={[globalStyles.containerLR, {height: 30}]}>
                      <Text style={globalStyles.fontPrimary}>使用日期</Text>
                      <Text style={globalStyles.fontSecondary}>
                        {reFormatDate(orderDetail?.useBeginTime, 'YYYY.MM.DD')}-{reFormatDate(orderDetail?.useEndTime, 'YYYY.MM.DD')}
                      </Text>
                    </View>
                  )}
                  <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_SMALLER}]} />
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={globalStyles.fontPrimary}>订单编号</Text>
                    <View style={globalStyles.containerRow}>
                      <TouchableOpacity activeOpacity={0.8} onPress={() => onCopy(orderDetail?.orderBigId)}>
                        <View style={[globalStyles.tagWrapper, {backgroundColor: '#3333331A'}]}>
                          <Text style={[globalStyles.tag, globalStyles.fontPrimary, {fontSize: 10}]}>复制</Text>
                        </View>
                      </TouchableOpacity>
                      <Text style={[globalStyles.fontSecondary, {marginLeft: 5}]}>{orderDetail?.orderBigId}</Text>
                    </View>
                  </View>
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={globalStyles.fontPrimary}>套餐名称</Text>
                    <Text style={globalStyles.fontSecondary}>{orderDetail?.skuName}</Text>
                  </View>
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={globalStyles.fontPrimary}>购买数量</Text>
                    <Text style={globalStyles.fontSecondary}>x{orderDetail?.numberOfProducts || 0}</Text>
                  </View>
                  <View style={[globalStyles.containerLR, {height: 30}]}>
                    <Text style={globalStyles.fontPrimary}>支付方式</Text>
                    <Text style={globalStyles.fontSecondary}>{orderDetail?.ypPayChannel === PayChannel.ALIPAY ? '支付宝' : '微信'}</Text>
                  </View>
                  <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE_SMALLER}]} />
                  {!!orderDetail?.willReturnUserCommission && (
                    <View style={[globalStyles.containerLR, {height: 30}]}>
                      <Text style={globalStyles.fontPrimary}>返芽</Text>
                      <Text style={globalStyles.fontSecondary}>{orderDetail?.willReturnUserCommissionYuan}</Text>
                    </View>
                  )}
                  {orderDetail?.canUseIntegral === BoolEnum.TRUE && (
                    <View style={[globalStyles.containerLR, {height: 30}]}>
                      <Text style={globalStyles.fontPrimary}>优惠券</Text>
                      <Text style={globalStyles.fontSecondary}>-¥{orderDetail?.usedCouponMoneyYuan}</Text>
                    </View>
                  )}
                  {orderDetail?.canUseCoupon === BoolEnum.TRUE && (
                    <View style={[globalStyles.containerLR, {height: 30}]}>
                      <Text style={globalStyles.fontPrimary}>使用芽</Text>
                      <Text style={globalStyles.fontSecondary}>-¥{orderDetail?.usedIntegralMoneyYuan}</Text>
                    </View>
                  )}
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
      {showSelectMap && <NavigationModal visible={true} onClose={() => setShowSelectMap(false)} onSelect={app => openMap(navigationInfo, app)} />}
      {showKF && <KFModal visible={true} onClose={() => setShowKF(false)} />}
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
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#d9d9d9',
  },
});
