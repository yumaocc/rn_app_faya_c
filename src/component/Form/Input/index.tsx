import React, {useCallback, useMemo} from 'react';
import {InputItem} from '@ant-design/react-native';
import {InputItemProps} from '@ant-design/react-native/lib/input-item';
import {globalStyleVariables} from '../../../constants/styles';
import isNil from 'lodash/isNil';

const Input: React.FC<InputItemProps> = props => {
  const {value, type, onChange, styles, ...restProps} = props;
  const shouldWrap = useMemo(() => type === 'number', [type]);
  const wrappedValue = useMemo(() => {
    if (shouldWrap) {
      return isNil(value) ? '' : String(value);
    } else {
      return value;
    }
  }, [value, shouldWrap]);

  const wrappedOnChange = useCallback(
    (value: string) => {
      if (shouldWrap) {
        if (!value) {
          onChange('');
          return;
        }
        const number = Number(value) as unknown as string;
        onChange(number);
      } else {
        onChange(value);
      }
    },
    [shouldWrap, onChange],
  );

  return (
    <InputItem
      placeholderTextColor={globalStyleVariables.TEXT_COLOR_TERTIARY}
      value={wrappedValue}
      {...restProps}
      onChange={wrappedOnChange}
      styles={{
        container: {height: 40, margin: 0},
        ...styles,
      }}
    />
  );
};
Input.defaultProps = {
  clear: true,
  textAlign: 'right',
  last: true,
  type: 'text',
  placeholder: '请输入',
  labelNumber: 2,
  styles: {},
};
export default Input;
