import React, {useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView, Text, TextInput, TextInputProps, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Modal, NavigationBar} from '../../../component';
import FormItem from '../../../component/Form/FormItem';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useSearch} from '../../../fst/hooks';
import {BookingModelF, OrderBookingDetailF, OrderBookingForm} from '../../../models';
import {useCommonDispatcher, useParams} from '../../../helper/hooks';
import * as api from '../../../apis';
import BookingModal from '../../../component/BookingModal';
import moment from 'moment';
import {BoolEnum} from '../../../fst/models';
import {navigateBack} from '../../../router/Router';
import Icon from '../../../component/Icon';

const OrderBooking: React.FC = () => {
  const params = useParams<{id: string}>();
  const [form, setFormField, setFormFields] = useSearch<OrderBookingForm>();
  const [bookingModel, setBookingModel] = useState<BookingModelF>();
  const [bookingDetail, setBookingDetail] = useState<OrderBookingDetailF>();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const booked = useMemo(() => bookingDetail?.reserved === BoolEnum.TRUE, [bookingDetail]);
  const skuId = useMemo(() => bookingDetail?.skuId, [bookingDetail]);
  const month = useMemo(() => {
    const day = bookingDetail?.bookingDateInt;
    if (day) {
      return moment(String(day), 'YYYYMMDD');
    }
  }, [bookingDetail]);
  const canCancel = useMemo(() => {
    const {bookingCanCancel, bookingCancelDay, bookingDateInt} = bookingDetail || {};
    if (bookingCanCancel === BoolEnum.FALSE) {
      return false;
    }
    if (bookingCancelDay) {
      return moment().isSameOrBefore(moment(String(bookingDateInt), 'YYYYMMDD HH:mm:ss').subtract(bookingCancelDay, 'days'), 'day');
    }
    return true;
  }, [bookingDetail]);

  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    if (params.id) {
      api.order
        .skuBookingDetail(params.id)
        .then(res => {
          console.log(res);
          const {name, memo, contactPhone} = res;
          setFormFields({
            name,
            memo,
            contactPhone,
          });
          setBookingDetail(res);
        })
        .catch(commonDispatcher.error);
    }
  }, [commonDispatcher.error, params.id, setFormFields]);

  function openBooking() {
    setShowBookingModal(true);
  }

  function check(): string {
    const {name, contactPhone} = form;
    if (!name) {
      return '请输入姓名';
    }
    if (!contactPhone) {
      return '请输入手机号';
    }
  }
  async function handleSubmit() {
    const errorMsg = check();
    if (errorMsg) {
      return commonDispatcher.error(errorMsg);
    }
    let modelInfo: Partial<OrderBookingForm> = {};
    if (!bookingModel) {
      modelInfo = {
        skuModelId: bookingDetail?.skuModelId,
        bizShopId: bookingDetail?.shopId,
        stockDateInt: bookingDetail?.bookingDateInt,
      };
    } else {
      modelInfo = {
        skuModelId: bookingModel?.skuModelId,
        bizShopId: bookingModel?.shopId,
        stockDateInt: bookingModel?.stockDateInt,
      };
    }
    if (!modelInfo.bizShopId || !modelInfo.skuModelId || !modelInfo.stockDateInt) {
      return commonDispatcher.error('请选择预约时间');
    }
    const submitData: OrderBookingForm = {
      ...form,
      ...modelInfo,
      orderSmallId: params.id,
    };
    console.log(submitData);
    try {
      await api.order.booking(submitData);
      commonDispatcher.success(booked ? '修改成功' : '预约成功');
      navigateBack();
    } catch (error) {
      commonDispatcher.error(error);
    }
  }
  function openCancel() {
    setShowCancelModal(true);
  }
  async function handleCancel() {
    setShowCancelModal(false);
    try {
      await api.order.cancelBooking(params.id);
      commonDispatcher.success('已取消预约');
      navigateBack();
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  function renderBookingInfo() {
    if (bookingModel) {
      return (
        <Text numberOfLines={2} style={[globalStyles.fontPrimary, styles.bookingInfo]}>
          {`${bookingModel?.stockDateInt} ${bookingModel?.name} ${bookingModel?.shopName}`}
        </Text>
      );
    }
    const {skuModelName, shopName, bookingDateInt} = bookingDetail || {};
    if (skuModelName && shopName && bookingDateInt) {
      const formatDate = moment(String(bookingDateInt), 'YYYYMMDD').format('YYYY-MM-DD');
      return (
        <Text numberOfLines={2} style={[globalStyles.fontPrimary, styles.bookingInfo]}>
          {`${formatDate} ${skuModelName} ${shopName}`}
        </Text>
      );
    }
    return <Text style={[{fontSize: 15, color: globalStyleVariables.TEXT_COLOR_TERTIARY}]}>请选择预约型号</Text>;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: '#fff'}}>
        <NavigationBar
          title="预约信息"
          style={{backgroundColor: '#fff'}}
          headerRight={
            <View style={{paddingRight: globalStyleVariables.MODULE_SPACE}}>
              {canCancel && (
                <TouchableOpacity onPress={openCancel}>
                  <Text>取消预约</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
        <ScrollView style={{flex: 1}} keyboardDismissMode="on-drag">
          <View style={{backgroundColor: '#fff', padding: globalStyleVariables.MODULE_SPACE_BIGGER}}>
            {/* <View>
              <Text>预约信息</Text>
            </View> */}
            <FormItem label="姓名" {...formItemProps}>
              <TextInput {...formItemInputProps} value={form.name} onChangeText={text => setFormField('name', text)} placeholder="请输入使用人姓名" />
            </FormItem>
            <View style={globalStyles.lineHorizontal} />
            <FormItem label="手机号" {...formItemProps}>
              <TextInput
                {...formItemInputProps}
                keyboardType="numeric"
                value={form.contactPhone}
                onChangeText={text => setFormField('contactPhone', text)}
                placeholder="请输入使用人手机号"
              />
            </FormItem>
            <View style={globalStyles.lineHorizontal} />
            <TouchableOpacity activeOpacity={0.8} onPress={openBooking}>
              <View style={[globalStyles.containerLR, {height: 50}]}>
                <Text style={[globalStyles.fontPrimary, {fontSize: 16}]}>预约信息</Text>
                <View style={[globalStyles.containerRow, {flex: 1, justifyContent: 'flex-end', marginLeft: 10}]}>
                  {renderBookingInfo()}
                  <Icon name="all_arrowR36" size={20} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                </View>
              </View>
            </TouchableOpacity>
            <View style={globalStyles.lineHorizontal} />
            <FormItem label="备注" {...formItemProps} vertical>
              <View style={styles.memo}>
                <TextInput
                  multiline
                  style={styles.memoText}
                  placeholderTextColor={globalStyleVariables.TEXT_COLOR_TERTIARY}
                  value={form.memo}
                  onChangeText={text => setFormField('memo', text)}
                  placeholder="请输入预约备注"
                />
              </View>
            </FormItem>
          </View>
        </ScrollView>
        <View style={[{padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
          <Button type="primary" title={booked ? '修改预约' : '立即预约'} style={{height: 40}} onPress={handleSubmit} />
        </View>
        {showBookingModal && <BookingModal month={month} visible={true} skuId={skuId} onClose={() => setShowBookingModal(false)} onSelect={setBookingModel} />}
        {showCancelModal && (
          <Modal title="提示" onClose={() => setShowCancelModal(false)} visible={true} showCancel okText="取消预约" cancelText="关闭" onOk={handleCancel}>
            <View style={[{paddingVertical: 20, paddingHorizontal: 20}]}>
              <Text>确定要取消预约吗？</Text>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </View>
  );
};

export default OrderBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  memo: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  memoText: {
    height: 100,
    textAlignVertical: 'top',
    padding: 0,
    // backgroundColor: '#f4f4f4',
  },
  bookingInfo: {
    flex: 1,
    fontSize: 15,
    textAlign: 'right',
  },
});

const formItemProps = {
  hiddenBorderBottom: true,
  hiddenBorderTop: true,
  styles: {
    container: {
      paddingVertical: 12,
    },
    children: {
      height: 20,
    },
  },
};

const formItemInputProps: TextInputProps = {
  placeholderTextColor: globalStyleVariables.TEXT_COLOR_TERTIARY,
  clearButtonMode: 'while-editing',
  style: {
    fontSize: 15,
    paddingRight: globalStyleVariables.MODULE_SPACE,
    textAlign: 'right',
    width: '100%',
    flex: 1,
    padding: 0,
  },
};
