import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {globalStyleVariables} from '../constants/styles';
import {StylePropView} from '../models';

interface FormTitleProps {
  title?: string;
  style?: StylePropView;
}

const FormTitle: React.FC<FormTitleProps> = props => {
  const {title} = props;
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.bar} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};
FormTitle.defaultProps = {
  title: 'FormTitle',
};
export default FormTitle;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    height: 30,
  },
  bar: {
    width: 2,
    height: 12,
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
    paddingLeft: 5,
  },
});
