import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Checkbox from './Checkbox';

type Value = number[];

export interface GroupProps {
  value?: Value;
  onChange?: (val: Value) => void;
  options: {label: string; value: number}[];
}

const Group: React.FC<GroupProps> = props => {
  const {options} = props;
  const [currentValue, setCurrentValue] = React.useState(new Set(props.value || []));

  useEffect(() => {
    setCurrentValue(new Set(props.value || []));
  }, [props.value]);

  return (
    <View style={styles.container}>
      {options.map(option => {
        // console.log(option);
        return (
          <Checkbox
            key={option.value}
            checked={currentValue.has(option.value)}
            onChange={() => {
              if (currentValue.has(option.value)) {
                currentValue.delete(option.value);
              } else {
                currentValue.add(option.value);
              }
              setCurrentValue(currentValue);
              props.onChange && props.onChange(Array.from(currentValue));
            }}>
            {option.label}
          </Checkbox>
        );
      })}
    </View>
  );
};
Group.defaultProps = {
  // title: 'Group',
};
export default Group;
const styles = StyleSheet.create({
  container: {},
});
