import React, {useEffect} from 'react';
import FormItem, {FormItemProps} from './FormItem';
import {useForm, useFormInstance} from './hooks';
import {FormInstance, FormItemStyle, UseFormType} from './types';
import {FormContext, FormConfigContext} from './Context';

interface FormProps {
  // title?: string;
  form?: FormInstance;
  children?: React.ReactNode;
  disabled?: boolean;
  itemStyle?: FormItemStyle;
  hiddenLine?: boolean;
}

type FormType = React.FC<FormProps> & {
  Item?: React.FC<FormItemProps>;
  useForm?: UseFormType;
  useFormInstance?: () => FormInstance;
};

const Form: FormType = props => {
  const {form, itemStyle, hiddenLine, disabled} = props;
  const [formInstance, setFormInstance] = React.useState<FormInstance>(form);
  const [newFormInstance] = useForm();

  useEffect(() => {
    if (!form) {
      if (newFormInstance) {
        setFormInstance(newFormInstance);
      }
    } else {
      setFormInstance(form);
    }
  }, [form, newFormInstance]);
  return (
    <FormContext.Provider value={formInstance}>
      <FormConfigContext.Provider value={{disabled, itemStyle, hiddenLine}}>{props.children}</FormConfigContext.Provider>
    </FormContext.Provider>
  );
};
Form.defaultProps = {
  // title: 'Form',
  disabled: false,
  itemStyle: {},
  hiddenLine: false,
};
Form.Item = FormItem;
Form.useForm = useForm;
Form.useFormInstance = useFormInstance;

export default Form;
