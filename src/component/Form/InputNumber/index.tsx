import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput, NativeSyntheticEvent, TextInputChangeEventData} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {globalStyleVariables} from '../../../constants/styles';
import {numberToString, stringToNumber} from '../../../fst/helper';
import {StylesProp} from '../../../models';

interface InputNumberProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  controls?: boolean;
  placeholder?: string;
  digit?: number;
  onChange?: (value: number) => void;
  styles?: StylesProp;
}

const InputNumber: React.FC<InputNumberProps> = props => {
  const {value, min, max, step, disabled, controls, onChange} = props;
  const [showValue, setShowValue] = React.useState<string>(numberToString(value));
  const canSubtract = !disabled && value > min;
  const canAdd = !disabled && value < max;

  useEffect(() => {
    if (value !== stringToNumber(showValue)) {
      setShowValue(numberToString(value));
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const numberReg = useMemo(() => {
    let regString = '';
    if (props.digit) {
      regString = `(^[1-9]\\d*(\\.\\d{0,${props.digit}})?$)|(^0{1}(\\.\\d{0,${props.digit}})?$)`;
    } else {
      regString = '(^[1-9]\\d*(\\.\\d*)?$)|(^0{1}(\\.\\d*)?$)';
    }
    return new RegExp(regString);
  }, [props.digit]);

  function handleChange(value: string) {
    if (!value) {
      setShowValue('');
      onChange && onChange(undefined);
      return;
    }
    // console.log(numberReg);
    if (numberReg.test(value)) {
      onChange && onChange(stringToNumber(value));
      setShowValue(value);
    } else {
      // console.log('inValid');
      setShowValue(showValue);
    }
  }
  function handleNativeChange(e: NativeSyntheticEvent<TextInputChangeEventData>) {
    handleChange(e.nativeEvent.text);
  }

  function handleStep(isAdd = false) {
    let newValue = value || 0;
    if (isAdd) {
      newValue += step;
      newValue = Math.min(newValue, max);
    } else {
      newValue -= step;
      newValue = Math.max(newValue, min);
    }
    if (onChange) {
      onChange(newValue);
    }
  }

  function renderAddControl() {
    if (!controls) {
      return null;
    }
    if (canAdd) {
      return (
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleStep(true)}>
          <View style={styles.action}>
            <Icon name="add" size={20} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.action}>
          <Icon name="add" size={20} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
        </View>
      );
    }
  }

  function renderSubtractControl() {
    if (!controls) {
      return null;
    }
    if (canSubtract) {
      return (
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleStep(false)}>
          <View style={styles.action}>
            <Icon name="remove" size={20} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.action}>
          <Icon name="remove" size={20} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
        </View>
      );
    }
  }

  return (
    <View style={[styles.container, props.styles?.container]}>
      {renderSubtractControl()}
      <View style={props.styles?.inputContainer}>
        <TextInput placeholder={props.placeholder} keyboardType="numeric" value={showValue} onChange={handleNativeChange} style={[styles.input, props.styles?.input]} />
      </View>
      {renderAddControl()}
    </View>
  );
};
InputNumber.defaultProps = {
  value: null,
  styles: {},
  min: 1,
  max: Infinity,
  step: 1,
  disabled: false,
  controls: true,
  onChange: () => {},
};
export default InputNumber;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    backgroundColor: '#0000001A',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2.5,
    width: 24,
    height: 24,
  },
  input: {
    width: 50,
    fontSize: 16,
    margin: 0,
    padding: 0,
    flex: 1,
    color: '#000',
    textAlign: 'center',
  },
});
