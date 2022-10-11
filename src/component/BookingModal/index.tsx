import moment, {Moment} from 'moment';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity, Animated, Easing} from 'react-native';
import {useCommonDispatcher} from '../../helper/hooks';
import * as api from '../../apis';
import {findItem, formatMoment} from '../../fst/helper';
import {BookingModelF, DayBookingModelF, GroupedShopBookingModel} from '../../models';
import Popup from '../Popup';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Calendar from '../Calendar';
import {groupBy} from 'lodash';
import Button from '../Button';

interface BookingModalProps {
  visible: boolean;
  skuId: number;
  onClose: () => void;
  onSelect?: (model: BookingModelF) => void;
}

const BookingModal: React.FC<BookingModalProps> = props => {
  const {skuId, onClose, onSelect} = props;
  const [month, setMonth] = useState<Moment>(moment());
  const [bookingModels, setBookingModels] = useState<DayBookingModelF[]>([]);
  const [currentBookingModel, setCurrentBookingModel] = useState<DayBookingModelF>();
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectDay, setSelectDay] = useState<Moment>(null);
  const [selectShop, setSelectShop] = useState<GroupedShopBookingModel>(null);
  const [selectModal, setSelectModal] = useState<BookingModelF>(null);

  const arrowRotation = useRef(new Animated.Value(0));
  const [commonDispatcher] = useCommonDispatcher();
  const {height} = useWindowDimensions();

  const shops: GroupedShopBookingModel[] = useMemo(() => {
    const list = currentBookingModel?.list || [];
    const res = groupBy(list, 'shopId');
    const shops = Object.keys(res).map(shopId => {
      const shop = findItem(list, e => e.shopId === Number(shopId));
      return {
        id: shop.id,
        name: shop.shopName,
        list: res[shopId],
      };
    });
    return shops;
  }, [currentBookingModel]);

  useEffect(() => {
    const start = month.startOf('month');
    const end = month.endOf('month');
    api.spu
      .getBookingModal(skuId, formatMoment(start), formatMoment(end))
      .then(res => {
        setBookingModels(res);
      })
      .catch(commonDispatcher.error);
  }, [skuId, commonDispatcher, month]);

  useEffect(() => {
    Animated.timing(arrowRotation.current, {
      easing: Easing.linear,
      toValue: showCalendar ? 0 : 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [showCalendar]);

  function handleSelectDay(day: Moment, bookingModel: DayBookingModelF) {
    setSelectDay(day);
    setCurrentBookingModel(bookingModel);
    setSelectShop(null);
    setSelectModal(null);
    setShowCalendar(false);
  }

  function handleSubmit() {
    onSelect && onSelect(selectModal);
    onClose();
  }

  function renderDay(day: Moment) {
    const key = day.format('x');
    const dayInt = day.format('YYYYMMDD');
    const foundModel = bookingModels.find(model => String(model.stockDateInt) === dayInt);
    const isToday = day.isSame(moment(), 'day');
    const isCurrentMonth = day.isSame(month, 'month');
    if (!isCurrentMonth) {
      return <View style={[styles.day, {flex: 1}]} key={key} />;
    }
    const dayFontSize = isToday ? 12 : 18;
    const dayColor = isToday ? globalStyleVariables.COLOR_LINK : globalStyleVariables.TEXT_COLOR_PRIMARY;
    let stockText = '';
    let isFull = false;
    let hasRest = false;
    if (!foundModel) {
      stockText = '-';
    } else {
      const {usedStock, allStock} = foundModel;
      if (usedStock >= allStock) {
        stockText = '满';
        isFull = true;
      } else {
        hasRest = true;
        stockText = `余:${allStock - usedStock}`;
      }
    }
    const stockColor = isFull ? globalStyleVariables.COLOR_WARNING_RED : globalStyleVariables.TEXT_COLOR_PRIMARY;
    if (hasRest) {
      return (
        <TouchableOpacity
          style={{flex: 1}}
          activeOpacity={0.7}
          key={key}
          onPress={() => {
            handleSelectDay(day, foundModel);
          }}>
          <View style={[styles.day]}>
            <Text style={[globalStyles.fontPrimary, {fontSize: dayFontSize, lineHeight: 18, color: dayColor}]}>{isToday ? '今日' : day.date()}</Text>
            <Text style={[globalStyles.fontPrimary, {fontSize: 12, color: stockColor}]}>{stockText}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <View key={key} style={[styles.day, {flex: 1}]}>
        <Text style={[globalStyles.fontPrimary, {fontSize: dayFontSize, lineHeight: 18, color: dayColor}]}>{isToday ? '今日' : day.date()}</Text>
        <Text style={[globalStyles.fontPrimary, {fontSize: 12, color: stockColor}]}>{stockText}</Text>
      </View>
    );
  }

  if (!props.visible) {
    return null;
  }
  return (
    <Popup visible onClose={onClose} style={[styles.container, {height: height * 0.7}]}>
      <View style={[globalStyles.containerRow, styles.modalTitle]}>
        <View style={styles.modelIcon} />
        <Text style={[globalStyles.fontPrimary, {flex: 1, textAlign: 'center'}]}>选择预约</Text>
        <View style={styles.modelIcon}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcon name="close" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={[styles.stepContent]}>
        <TouchableOpacity
          onPress={() => {
            setShowCalendar(!showCalendar);
          }}>
          <View style={[globalStyles.containerLR, {paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
            <View>
              <Text style={[globalStyles.fontSecondary]}>时间</Text>
              <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{selectDay?.format('YYYY-MM-DD') || '请选择'}</Text>
            </View>
            <Animated.View style={[styles.arrowIconContainer, {transform: [{rotate: arrowRotation.current.interpolate({inputRange: [0, 1], outputRange: ['0deg', '180deg']})}]}]}>
              <MaterialIcon name="arrow-drop-down" size={16} color="#000" />
            </Animated.View>
          </View>
        </TouchableOpacity>
        {showCalendar && (
          <View>
            <View style={styles.dateBar}>
              <TouchableOpacity onPress={() => setMonth(month.clone().subtract(1, 'month'))}>
                <Text style={globalStyles.fontPrimary}>上一月</Text>
              </TouchableOpacity>
              <View style={[globalStyles.containerCenter, {flex: 1}]}>
                <Text style={globalStyles.fontPrimary}>{month.format('YYYY年MM月')}</Text>
              </View>
              <TouchableOpacity onPress={() => setMonth(month.clone().add(1, 'month'))}>
                <Text style={globalStyles.fontPrimary}>下一月</Text>
              </TouchableOpacity>
            </View>
            <Calendar value={month} styles={{row: {marginTop: 10}}} startAtSunday={true} renderDay={renderDay} style={styles.calendar} />
          </View>
        )}
        {!!selectDay && (
          <View>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE}]} />
            <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
              <Text style={[globalStyles.fontSecondary]}>选择店铺</Text>
            </View>
            <View style={styles.modelItemContainer}>
              {shops.map(shop => {
                const active = shop.id === selectShop?.id;
                return (
                  <TouchableOpacity activeOpacity={0.8} key={shop.id} onPress={() => setSelectShop(shop)}>
                    <View style={[styles.modelItem, active && styles.modelItemActive]}>
                      <Text style={[styles.modelText, active && styles.modelTextActive]}>{shop.name}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
        {!!selectShop && (
          <View>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE}]} />
            <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
              <Text style={[globalStyles.fontSecondary]}>选择预约型号</Text>
            </View>
            <View style={styles.modelItemContainer}>
              {selectShop?.list.map(item => {
                const active = item.id === selectModal?.id;
                return (
                  <TouchableOpacity activeOpacity={0.8} key={item.id} onPress={() => setSelectModal(item)}>
                    <View style={[styles.modelItem, active && styles.modelItemActive]}>
                      <Text style={[styles.modelText, active && styles.modelTextActive]}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
      <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
        <Button disabled={!selectModal} title="保存" style={{height: 40}} onPress={handleSubmit} />
      </View>
    </Popup>
  );
};

export default BookingModal;

BookingModal.defaultProps = {
  visible: false,
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 10,
  },
  modalTitle: {
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
  },
  modelIcon: {
    width: 24,
    height: 24,
  },
  stepContent: {
    flex: 1,
  },
  modelState: {
    // marginTop: globalStyleVariables.MODULE_SPACE,
  },
  monthTitle: {
    backgroundColor: '#f4f4f4',
    paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER,
    paddingVertical: 7,
  },
  calendar: {
    marginTop: 10,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
  },
  day: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  dateBar: {
    backgroundColor: '#00000008',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    height: 35,
  },
  arrowIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: globalStyleVariables.BORDER_COLOR,
  },
  modelItemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modelItem: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderColor: '#f2f2f2',
    borderRadius: 5,
    borderWidth: 2,
    marginRight: globalStyleVariables.MODULE_SPACE,
    marginBottom: globalStyleVariables.MODULE_SPACE,
  },
  modelItemActive: {
    backgroundColor: '#ffeeeb',
    borderColor: globalStyleVariables.COLOR_PRIMARY,
  },
  modelText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  modelTextActive: {
    color: globalStyleVariables.COLOR_PRIMARY,
  },
});
