import React, {useContext} from 'react';
import {Text, StyleSheet, View, TextStyle, ViewStyle} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {StylePropView} from '../../models';
import {FormConfigContext} from './Context';
import {useFormInstance} from './hooks';

export type FormItemStyles = {
  [key in keyof typeof styles]: ViewStyle | TextStyle;
};

export interface FormItemProps {
  children: React.ReactNode;
  label?: string | React.ReactNode;
  desc?: string;
  extra?: React.ReactNode;
  hiddenBorderTop?: boolean;
  hiddenBorderBottom?: boolean;
  name?: string;
  valueKey?: string;
  onChangeKey?: string;
  vertical?: boolean;
  noStyle?: boolean;
  style?: StylePropView;
  styles?: Partial<FormItemStyles>;
}

const FormItem: React.FC<FormItemProps> = props => {
  const {label, hiddenBorderBottom, hiddenBorderTop, valueKey, onChangeKey} = props;
  const formInstance = useFormInstance();
  const config = useContext(FormConfigContext);

  function renderChildren(): React.ReactElement {
    const name = props.name;
    if (name) {
      try {
        const child = React.Children.only(props.children) as React.ReactElement;
        const childProps = child.props || {};
        const oldOnChange = childProps[onChangeKey];
        const newProps = {
          ...childProps,
          [valueKey]: formInstance.getFieldValue(name),
          [onChangeKey]: (value: any) => {
            formInstance.setFieldValue(name, value);
            oldOnChange && oldOnChange(value);
          },
        };
        return React.cloneElement(child, newProps);
      } catch (error) {
        return props.children as React.ReactElement;
      }
    }
    return props.children as React.ReactElement;
  }

  if (props.noStyle) {
    return renderChildren();
  }

  const showTopLine = !hiddenBorderTop && !config.hiddenLine;
  const showBottomLine = !hiddenBorderBottom && !config.hiddenLine;

  const containerStyle = [
    showBottomLine && globalStyles.borderBottom,
    showTopLine && globalStyles.borderTop,
    styles.container,
    config.itemStyle?.container,
    props.style,
    props.styles?.container,
  ];

  function renderLabel() {
    if (typeof label === 'string') {
      return <Text style={[globalStyles.fontPrimary, styles.label]}>{label}</Text>;
    }
    return label;
  }

  if (props.vertical) {
    return (
      <View style={containerStyle}>
        <View style={[styles.item]}>
          <View style={[styles.labelLeft, {maxWidth: '100%'}]}>
            <View style={styles.labelWrapper}>{renderLabel()}</View>
            {props.desc && (
              <View style={{marginTop: 3}}>
                <Text numberOfLines={1} style={styles.desc}>
                  {props.desc}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.extra}>{renderChildren()}</View>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <View style={[styles.item]}>
        <View style={[styles.labelLeft, {maxWidth: '100%'}]}>
          <View style={styles.labelWrapper}>{renderLabel()}</View>
          {props.desc && (
            <View>
              <Text numberOfLines={1} style={styles.desc}>
                {props.desc}
              </Text>
            </View>
          )}
        </View>
        <View style={[{marginLeft: globalStyleVariables.MODULE_SPACE}, styles.children, config?.itemStyle?.children, props.styles?.children]}>{renderChildren()}</View>
      </View>
      {props.extra && <View style={styles.extra}>{props.extra}</View>}
    </View>
  );
};
FormItem.defaultProps = {
  label: '',
  hiddenBorderBottom: false,
  hiddenBorderTop: false,
  valueKey: 'value',
  onChangeKey: 'onChange',
  vertical: false,
  noStyle: false,
  style: {},
  styles: {},
};
export default FormItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    maxWidth: '80%',
  },
  desc: {
    fontSize: 12,
    color: globalStyleVariables.TEXT_COLOR_TERTIARY,
  },
  labelWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
  },
  children: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  extra: {
    marginTop: globalStyleVariables.MODULE_SPACE,
  },
});
