import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from '@ant-design/react-native';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {StylePropView} from '../../../models';
import Picker from '../../Picker';
import {PickerItemProps} from '../../Picker/PickerItem';
import Popup from '../../Popup';
import isNil from 'lodash/isNil';

export type RenderPickerChildren = (option: PickerItemProps, index: number) => React.ReactNode;

interface SelectProps {
  title?: string;
  value?: string | number;
  style?: StylePropView;
  options: PickerItemProps[];
  placeholder?: string;
  disabled?: boolean;
  children?: React.ReactNode | RenderPickerChildren;
  onChange?: (value: string | number | any) => void;
}

const Select: React.FC<SelectProps> = props => {
  const {value} = props;
  const [show, setShow] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const renderChildren = useCallback(() => {
    if (!props.children) {
      const foundOption = props.options.find(option => option.value === value);
      const showPlaceholder = isNil(value) || value === '';

      return (
        <View style={styles.childrenWrapper}>
          {!showPlaceholder ? <Text>{foundOption?.label || value}</Text> : <Text style={styles.placeholder}>{props.placeholder}</Text>}
          <Icon name="caret-right" style={styles.arrow} />
        </View>
      );
    }
    if (typeof props.children === 'function') {
      const foundIndex = props.options.findIndex(item => item.value === value);
      return props.children(props.options[foundIndex], foundIndex);
    }
  }, [props, value]);

  function handleClose() {
    setShow(false);
  }

  function handleOk() {
    props.onChange && props.onChange(currentValue);
    handleClose();
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (!props.disabled) {
            setShow(true);
          }
        }}>
        {renderChildren()}
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
            <Picker style={{flex: 1}} value={currentValue} onChange={setCurrentValue} items={props.options} />
          </View>
        </View>
      </Popup>
    </>
  );
};
Select.defaultProps = {
  title: '',
  value: '',
  placeholder: '请选择',
  disabled: false,
};
export default Select;
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
  placeholder: {
    color: globalStyleVariables.TEXT_COLOR_TERTIARY,
    fontSize: 15,
  },
  childrenWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    transform: [{rotate: '90deg'}],
    marginLeft: 3,
    color: '#000',
    fontSize: 10,
  },
});
