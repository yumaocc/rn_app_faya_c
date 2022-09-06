import moment, {Moment} from 'moment';
import React, {useEffect, useMemo, useState} from 'react';
import {useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import Popup from '../../Popup';
import Picker from '../../Picker';
import {DATE_TIME_FORMAT, DEFAULT_END_DATE, DEFAULT_START_DATE} from '../../../constants';
// import {useLog} from '../helper/hooks';

type RenderDateFunction = (date: Moment) => React.ReactElement;

interface DatePickerProps {
  value?: Moment;
  mode?: 'datetime' | 'date';
  format?: string; // only use if no children
  title?: string;
  min?: Moment;
  max?: Moment;
  placeholder?: string;
  children?: React.ReactNode | RenderDateFunction;
  onChange?: (date: Moment) => void;
}

const DatePicker: React.FC<DatePickerProps> = props => {
  const {value, min, max, mode, onChange} = props;
  // console.log('value!', value);
  const valueDate = useMemo(() => {
    return value || moment();
  }, [value]);

  const [show, setShow] = useState(false);
  const [chosenYear, setChosenYear] = useState<string>('');
  const [chosenMonth, setChosenMonth] = useState<string>('');
  const [chosenDay, setChosenDay] = useState<string>('');
  const [chosenHour, setChosenHour] = useState<string>('');
  const [chosenMinute, setChosenMinute] = useState<string>('');

  useEffect(() => {
    setChosenYear(valueDate.format('YYYY'));
    setChosenMonth(valueDate.format('MM'));
    setChosenDay(valueDate.format('DD'));
    setChosenHour(valueDate.format('HH'));
    setChosenMinute(valueDate.format('mm'));
  }, [valueDate]);

  // 计算可用的年份
  const years = useMemo(() => {
    const years = [];
    const minYear = min.year();
    const maxYear = max.year();
    for (let i = minYear; i <= maxYear; i++) {
      years.push(i.toString());
    }
    return years;
  }, [min, max]);

  // 计算可用的月份
  const months = useMemo(() => {
    const months = [];
    if (!chosenYear) {
      return [];
    }
    const mmt = moment(`${chosenYear}-01-01`, 'YYYY-MM-DD');
    for (let i = 0; i < 12; i++) {
      const start = mmt.startOf('month').isBetween(min, max, 'month', '[]');
      const end = mmt.endOf('month').isBetween(min, max, 'month', '[]');
      if (mmt.isValid() && (start || end)) {
        months.push(mmt.format('MM'));
      }
      mmt.add(1, 'month');
    }
    return months;
  }, [chosenYear, min, max]);

  // 计算可用的天数
  const days = useMemo(() => {
    const days = [];
    if (!chosenYear || !chosenMonth) {
      return [];
    }
    const mmt = moment(`${chosenYear}-${chosenMonth}-01`, 'YYYY-MM-DD');
    const maxDay = mmt.daysInMonth();
    for (let i = 0; i < maxDay; i++) {
      const start = mmt.startOf('day').isBetween(min, max, 'day', '[]');
      const end = mmt.endOf('day').isBetween(min, max, 'day', '[]');
      if (mmt.isValid() && (start || end)) {
        days.push(mmt.format('DD'));
      }
      mmt.add(1, 'day');
    }
    return days;
  }, [min, max, chosenYear, chosenMonth]);

  // 计算可用的小时 todo: 没有考虑选中日期的影响
  const hours = useMemo(() => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i.toString().padStart(2, '0'));
    }
    return hours;
  }, []);

  // 计算可用的分钟 todo: 没有考虑选中日期的影响
  const minutes = useMemo(() => {
    const minutes = [];
    for (let i = 0; i < 60; i++) {
      minutes.push(i.toString().padStart(2, '0'));
    }
    return minutes;
  }, []);

  // 当前选中的时间
  const currentDate = useMemo(() => {
    const date = moment(`${chosenYear}-${chosenMonth}-${chosenDay} ${chosenHour}:${chosenMinute}`, 'YYYY-MM-DD HH:mm');
    if (date.isValid()) {
      if (date.isAfter(max)) {
        return max;
      }
      if (date.isBefore(min)) {
        return min;
      }
      return date;
    }
    return min;
  }, [chosenYear, chosenMonth, chosenDay, chosenHour, chosenMinute, min, max]);
  // useLog(currentDate, 'currentDate');
  // useLog(value, 'value');

  // useLog(chosenYear, 'chosenYear');
  // useLog(chosenMonth, 'chosenMonth');
  // useLog(chosenDay, 'chosenDay');

  // useLog(years, 'years');
  // useLog(months, 'months');
  // useLog(days, 'days');

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  function handleOk() {
    onChange && onChange(currentDate);
    handleClose();
  }

  const renderChild = useCallback(() => {
    if (!props.children) {
      const hasValue = value && value.isValid();
      let format = props.format;
      if (format === 'default') {
        if (props.mode === 'date') {
          format = 'YYYY-MM-DD';
        } else if (props.mode === 'datetime') {
          format = 'YYYY/MM/DD HH:mm';
        }
      }
      if (hasValue) {
        return <Text>{value.format(format)}</Text>;
      } else {
        return <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>{props.placeholder}</Text>;
      }
    }
    if (typeof props.children === 'function') {
      return props.children(value);
    }
    return props.children;
  }, [value, props]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setShow(true);
        }}>
        {renderChild()}
      </TouchableOpacity>
      <Popup visible={show} onClose={handleClose}>
        <View style={styles.container}>
          <View style={[globalStyles.borderBottom, styles.headerWrapper]}>
            <TouchableOpacity onPress={handleClose}>
              <Text>取消</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{props.title}</Text>
            <TouchableOpacity onPress={handleOk}>
              <Text style={styles.ok}>确定</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickerContainer}>
            <Picker style={{flex: 1}} value={chosenYear} onChange={value => setChosenYear(value as string)} items={years.map(item => ({label: item, value: item}))} />
            <Picker style={{flex: 1}} value={chosenMonth} onChange={value => setChosenMonth(value as string)} items={months.map(item => ({label: item, value: item}))} />
            <Picker style={{flex: 1}} value={chosenDay} onChange={value => setChosenDay(value as string)} items={days.map(item => ({label: item, value: item}))} />
            {mode === 'datetime' && (
              <>
                <Picker style={{flex: 1}} value={chosenHour} onChange={value => setChosenHour(value as string)} items={hours.map(item => ({label: item, value: item}))} />
                <Picker style={{flex: 1}} value={chosenMinute} onChange={value => setChosenMinute(value as string)} items={minutes.map(item => ({label: item, value: item}))} />
              </>
            )}
          </View>
        </View>
      </Popup>
    </>
  );
};
DatePicker.defaultProps = {
  title: '选择日期',
  mode: 'date',
  format: 'default',
  value: undefined,
  min: moment(DEFAULT_START_DATE, DATE_TIME_FORMAT).startOf('day'),
  max: moment(DEFAULT_END_DATE, DATE_TIME_FORMAT).endOf('day'),
  placeholder: '请选择日期',
};
export default DatePicker;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerContainer: {
    flexDirection: 'row',
  },
  ok: {
    color: globalStyleVariables.COLOR_PRIMARY,
  },
});
