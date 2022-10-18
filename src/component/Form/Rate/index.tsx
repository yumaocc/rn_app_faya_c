import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {globalStyleVariables} from '../../../constants/styles';
import {StylePropView} from '../../../models';
import Icon from '../../Icon';

export interface RateProps {
  size?: number;
  style?: StylePropView;
  value?: number;
  onChange?: (value: number) => void;
}

const Rate: React.FC<RateProps> = props => {
  const scores = [1, 2, 3, 4, 5];
  const {value, onChange} = props;

  const [rateValue, setRateValue] = React.useState(value || 1);

  function handleClick(val: number) {
    if (onChange) {
      onChange(val);
    } else {
      setRateValue(val);
    }
  }

  useEffect(() => {
    setRateValue(value);
  }, [value]);

  return (
    <View style={[styles.container, props.style]}>
      {scores.map(i => {
        const active = rateValue >= i;
        return (
          <TouchableWithoutFeedback key={i} onPress={() => handleClick(i)}>
            <View>
              <Icon name="wode_dingdan_pingjia" size={props.size} color={active ? globalStyleVariables.COLOR_PRIMARY : '#c4c4c4'} />
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};

export default Rate;
Rate.defaultProps = {
  size: 30,
  style: {},
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
