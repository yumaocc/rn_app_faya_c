import React from 'react';
import {globalStyleVariables} from '../constants/styles';
import {Button as AntButton} from '@ant-design/react-native';
import {ButtonProps as AntButtonProps} from '@ant-design/react-native/lib/button';
import {StyleSheet} from 'react-native';

interface ButtonProps extends AntButtonProps {
  title: string | React.ReactNode;
  cash?: boolean;
}

const Button: React.FC<ButtonProps> = props => {
  const {title, children, activeStyle, styles: propStyles, style, type, cash, ...restProps} = props;
  let newActiveStyle = activeStyle;
  if (props.type === 'primary') {
    newActiveStyle = [styles.primaryTap, activeStyle];
  }
  if (cash) {
    newActiveStyle = [styles.cashTap, activeStyle];
  }
  return (
    <AntButton {...restProps} activeStyle={newActiveStyle} type={cash ? 'primary' : type} styles={{ghostRaw: {borderWidth: 2}, ...propStyles}} style={[style, cash && styles.cash]}>
      {children || title}
    </AntButton>
  );
};

Button.defaultProps = {
  cash: false,
  styles: {},
};
export default Button;

const styles = StyleSheet.create({
  primaryTap: {
    backgroundColor: globalStyleVariables.COLOR_PRIMARY_TAP,
    borderColor: globalStyleVariables.COLOR_PRIMARY_TAP,
  },
  cash: {
    backgroundColor: globalStyleVariables.COLOR_CASH,
  },
  cashTap: {
    backgroundColor: globalStyleVariables.COLOR_CASH_TAP,
    borderColor: globalStyleVariables.COLOR_CASH_TAP,
  },
});
