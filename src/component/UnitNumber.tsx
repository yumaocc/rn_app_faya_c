import React from 'react';
import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';

interface UnitNumberProps {
  value: number | string;
  desensitization?: boolean; // 数据是否脱敏
  type?: 'money' | 'number'; // 数据类型, money类型会做千分位隔断
  unit?: string;
  style?: StyleProp<TextStyle>;
}

const UnitNumber: React.FC<UnitNumberProps> = props => {
  const {value, unit, type, desensitization, style} = props;
  const numValue = Number(value) || 0;
  let valueStr = '';
  if (desensitization) {
    valueStr = '*****';
  } else if (type === 'money') {
    valueStr = numValue.toLocaleString();
  } else {
    valueStr = String(value);
  }
  if (typeof value === 'string') {
    valueStr = value;
  }
  return (
    <Text style={[styles.container, style]}>
      <Text style={styles.value}>{valueStr}</Text>
      <Text style={styles.unit}> {unit}</Text>
    </Text>
  );
};
UnitNumber.defaultProps = {
  type: 'number',
  desensitization: false,
  unit: '元',
};
export default UnitNumber;

const styles = StyleSheet.create({
  container: {
    color: '#333',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 12,
  },
});
