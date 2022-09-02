import React from 'react';
import {StyleSheet} from 'react-native';
import {Checkbox as AntCheckbox} from '@ant-design/react-native';
import {OnChangeParams} from '@ant-design/react-native/lib/checkbox/PropsType';

export interface CheckboxProps {
  indeterminate?: boolean;
  checked?: boolean;
  onChange?: (e: boolean) => void;
  children?: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = props => {
  const {children, onChange, ...restProps} = props;
  function wrappedOnChange(e: OnChangeParams) {
    onChange && onChange(e.target.checked);
  }
  return (
    <AntCheckbox.CheckboxItem styles={{Line: styles.item}} onChange={wrappedOnChange} {...restProps}>
      {children}
    </AntCheckbox.CheckboxItem>
  );
};
Checkbox.defaultProps = {
  checked: false,
};
export default Checkbox;
const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 0,
    height: 30,
    minHeight: 20,
  },
});
