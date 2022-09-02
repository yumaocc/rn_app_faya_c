import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
// import flattenDeep from 'lodash/flattenDeep';
import {Icon} from '@ant-design/react-native';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {StylePropView} from '../../../models';
import Picker from '../../Picker';
import Popup from '../../Popup';
import {flattenTree} from '../../../fst/helper';

interface BaseType {
  [name: string]: any;
}
interface DefaultOptionType {
  label?: string;
  value?: string | number;
  children?: DefaultOptionType[];
}

export type PickerOption = DefaultOptionType & BaseType;

interface CascaderProps {
  title?: string;
  value?: Array<string | number>;
  style?: StylePropView;
  options: PickerOption[];
  placeholder?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  labelKey?: string;
  valueKey?: string;
  childrenKey?: string;
  depth?: number; //遍历几级
  onChange?: (value: string | number | any) => void;
}

const Cascader: React.FC<CascaderProps> = props => {
  const {value, depth, options, valueKey, labelKey, childrenKey} = props;
  const [show, setShow] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [pickerData, setPickerData] = useState<PickerOption[][]>([]);
  const flattenOptions = useMemo<PickerOption[]>(() => flattenTree(options, childrenKey), [options, childrenKey]);

  useEffect(() => {
    const res = [];
    let current = options;
    for (let i = 0; i < depth; i++) {
      res.push(current);
      const parent = current.find(item => item[valueKey] === currentValue[i]);
      current = (parent?.[childrenKey] as PickerOption[]) || [];
    }
    setPickerData(res);
  }, [depth, options, childrenKey, currentValue, valueKey]);

  const renderChildren = useCallback(() => {
    if (!props.children) {
      const labels = value.map(value => {
        const foundOption = flattenOptions.find(option => option[valueKey] === value);
        return foundOption?.[labelKey] || value;
      });
      return (
        <View style={styles.childrenWrapper}>
          {value?.length ? <Text>{labels.join('/')}</Text> : <Text style={styles.placeholder}>{props.placeholder}</Text>}
          <Icon name="caret-right" style={styles.arrow} />
        </View>
      );
    }
  }, [flattenOptions, labelKey, props.children, props.placeholder, value, valueKey]);

  const getValue = useCallback((index: number) => currentValue[index], [currentValue]);
  const setValue = useCallback((index: number, value: string | number) => {
    setCurrentValue(prev => {
      const copied = [...prev];
      copied[index] = value;
      return copied;
    });
  }, []);

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
            {pickerData.map((data, index) => {
              const options = data.map(option => {
                return {
                  label: option[labelKey] as string,
                  value: option[valueKey] as string,
                };
              });
              return <Picker key={index} style={{flex: 1}} value={getValue(index)} onChange={val => setValue(index, val)} items={options} />;
            })}
          </View>
        </View>
      </Popup>
    </>
  );
};
Cascader.defaultProps = {
  title: '',
  value: [],
  placeholder: '请选择',
  disabled: false,
  labelKey: 'label',
  valueKey: 'value',
  depth: 3,
  childrenKey: 'children',
};
export default Cascader;
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
