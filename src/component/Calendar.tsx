import moment, {Moment} from 'moment';
import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {ALL_WEEK_START_WITH_SUNDAY, ALL_WEEK_START_WITH_MONDAY} from '../constants';
import {globalStyleVariables, globalStyles} from '../constants/styles';
import {WeekDay} from '../fst/models';

export type CalendarStyles = {
  [key in keyof typeof styles]: ViewStyle | TextStyle;
};

interface CalendarProps {
  value?: Moment;
  startAtSunday?: boolean;
  style?: ViewStyle;
  renderHeader?: boolean | ((startAtSunday: boolean) => React.ReactNode);
  renderDay?: (day: Moment) => React.ReactNode;
  styles?: Partial<CalendarStyles>;
}

const Calendar: React.FC<CalendarProps> = props => {
  const {value, startAtSunday} = props;

  const rows: Moment[][] = useMemo(() => {
    const start = value.clone().startOf('month');
    const end = value.clone().endOf('month');
    const days = end.diff(start, 'days') + 1;
    const rows = [];
    for (let i = 0; i < days; i++) {
      const day = start.clone().add(i, 'days');
      const weekDay = day.weekday();
      if (i === 0 || weekDay === (startAtSunday ? 0 : 1)) {
        rows.push([]);
      }
      rows[rows.length - 1].push(day);
    }
    // 补齐空行
    const firstRow: Moment[] = rows[0];
    const lastRow: Moment[] = rows[rows.length - 1];
    if (firstRow.length < 7) {
      const len = 7 - firstRow.length;
      for (let i = 0; i < len; i++) {
        firstRow.unshift(firstRow[0].clone().subtract(1, 'days'));
      }
    }
    if (lastRow.length < 7) {
      const len = 7 - lastRow.length;
      for (let i = 0; i < len; i++) {
        lastRow.push(lastRow[lastRow.length - 1].clone().add(1, 'days'));
      }
    }
    return rows;
  }, [startAtSunday, value]);

  function renderDay(day: Moment) {
    if (!props.renderDay) {
      const isToday = day.isSame(moment(), 'day');
      const isCurrentMonth = day.isSame(value, 'month');
      const isWeekend = [0, 6].includes(day.weekday());
      let color = isWeekend ? globalStyleVariables.COLOR_WARNING_RED : globalStyleVariables.TEXT_COLOR_PRIMARY;
      color = isCurrentMonth ? color : globalStyleVariables.TEXT_COLOR_TERTIARY;
      const key = day.format('x');
      return (
        <View key={key} style={[globalStyles.containerCenter, {flex: 1}]}>
          <Text style={[globalStyles.fontPrimary, {color}]}>{isToday ? '今' : day.date()}</Text>
        </View>
      );
    } else {
      return props.renderDay(day);
    }
  }

  function renderHeader() {
    if (!props.renderHeader) {
      return null;
    }
    if (typeof props.renderHeader === 'function') {
      return props.renderHeader(props.startAtSunday);
    }
    const headerData = props.startAtSunday ? ALL_WEEK_START_WITH_SUNDAY : ALL_WEEK_START_WITH_MONDAY;
    return (
      <View style={[styles.header, props.styles.header]}>
        {headerData.map(week => {
          const color = [WeekDay.Sunday, WeekDay.Saturday].includes(week.value) ? globalStyleVariables.COLOR_WARNING_RED : globalStyleVariables.TEXT_COLOR_PRIMARY;
          return (
            <View key={week.value} style={[globalStyles.containerCenter, {flex: 1}]}>
              <Text style={[globalStyles.fontPrimary, {color}]}>{week.labelSimple}</Text>
            </View>
          );
        })}
      </View>
    );
  }
  return (
    <View style={[styles.container, props.styles.container, props.style]}>
      {renderHeader()}
      <View>
        {rows.map((row, index) => {
          return (
            <View key={index} style={[styles.row, props.styles.row]}>
              {row.map(renderDay)}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Calendar;
Calendar.defaultProps = {
  value: moment(),
  startAtSunday: true,
  renderHeader: true,
  style: {},
  styles: {},
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
