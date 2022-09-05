import {isNil} from 'lodash';
import React, {useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput, NativeSyntheticEvent, TextInputChangeEventData} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {globalStyleVariables} from '../../../constants/styles';

interface InputNumberProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

const InputNumber: React.FC<InputNumberProps> = props => {
  const {value, min, max, step, disabled, onChange} = props;
  const canSubtract = !disabled && value > min;
  const canAdd = !disabled && value < max;

  const showValue = useMemo(() => {
    if (isNil(value)) {
      return '';
    }
    return String(value);
  }, [value]);

  function handleChange(value: string) {
    if (onChange) {
      // if (!value) {
      //   return onChange(undefined);
      // }
      onChange(Number(value));
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
  return (
    <View style={styles.container}>
      {canSubtract ? (
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleStep()}>
          <View style={styles.action}>
            <Icon name="remove" size={20} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.action}>
          <Icon name="remove" size={20} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
        </View>
      )}
      <TextInput keyboardType="numeric" value={showValue} onChange={handleNativeChange} style={styles.input} />
      {canAdd ? (
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleStep(true)}>
          <View style={styles.action}>
            <Icon name="add" size={20} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.action}>
          <Icon name="add" size={20} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
        </View>
      )}
    </View>
  );
};
InputNumber.defaultProps = {
  value: null,
  min: 1,
  max: Infinity,
  step: 1,
  disabled: false,
  onChange: () => {},
};
export default InputNumber;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#f00',
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
    color: '#000',
    textAlign: 'center',
  },
});
