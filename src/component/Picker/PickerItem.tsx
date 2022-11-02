import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {globalStyles} from '../../constants/styles';

export interface PickerItemProps {
  label: string;
  value: string | number;
}
export const PICKER_ITEM_HEIGHT = 40;

const PickerItem: React.FC<PickerItemProps> = props => {
  return (
    <View style={styles.container}>
      <Text style={[globalStyles.fontPrimary, {fontSize: 18}]}>{props.label}</Text>
    </View>
  );
};
// PickerItem.defaultProps = {
// };
export default PickerItem;

const styles = StyleSheet.create({
  container: {
    height: PICKER_ITEM_HEIGHT,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
