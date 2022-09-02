import React from 'react';
import {View} from 'react-native';
import {globalStyleVariables} from '../constants/styles';
import {StylePropView} from '../models';

interface SectionGroupProps {
  children?: React.ReactNode;
  style?: StylePropView;
}

const SectionGroup: React.FC<SectionGroupProps> = props => {
  return (
    <View style={[{marginTop: globalStyleVariables.MODULE_SPACE}, props.style]}>
      {props.children}
    </View>
  );
};
export default SectionGroup;
