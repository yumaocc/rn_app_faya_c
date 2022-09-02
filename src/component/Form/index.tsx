import React, {useEffect} from 'react';
import FormItem, {FormItemProps} from './FormItem';
import {useForm, useFormInstance} from './hooks';
import {FormInstance, UseFormType} from './types';
import {FormContext} from './Context';

interface FormProps {
  // title?: string;
  form?: FormInstance;
  children?: React.ReactNode;
}

type FormType = React.FC<FormProps> & {
  Item?: React.FC<FormItemProps>;
  useForm?: UseFormType;
  useFormInstance?: () => FormInstance;
};

const Form: FormType = props => {
  const {form} = props;
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
  return <FormContext.Provider value={formInstance}>{props.children}</FormContext.Provider>;
};
Form.defaultProps = {
  // title: 'Form',
};
Form.Item = FormItem;
Form.useForm = useForm;
Form.useFormInstance = useFormInstance;

export default Form;
