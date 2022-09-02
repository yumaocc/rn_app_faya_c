import {useState, useCallback, useContext} from 'react';
import {FormInstance, FormStore, NamePath} from './types';
import {default as setValue} from 'lodash/set';
import {default as getValue} from 'lodash/get';
import {FormContext} from './Context';
import {produce} from 'immer';

export function useForm(initForm: FormStore = {}): [FormInstance] {
  // fixme: 目前的实现方式会导致form实例一直更新，有时间研究一下ant的form
  const [store, setStore] = useState<FormStore>(initForm);

  const setStoreValue = useCallback((namePath: NamePath, value: any) => {
    setStore(prev => {
      return produce(prev, draft => {
        setValue(draft, namePath, value);
      });
    });
  }, []);

  const setFieldValue = useCallback(
    (namePath: NamePath, value: any | ((storeValue: any) => any)) => {
      const newValue = typeof value === 'function' ? value(getValue(store, namePath)) : value;
      setStoreValue(namePath, newValue);
    },
    [store, setStoreValue],
  );
  const setFieldsValue = useCallback(
    (partial: FormStore) => {
      Object.keys(partial).forEach(key => {
        setStoreValue([key], partial[key]);
      });
    },
    [setStoreValue],
  );
  const getFieldValue = useCallback((namePath: NamePath) => getValue(store, namePath), [store]);
  const getFieldsValue = useCallback(() => store, [store]);
  return [
    {
      setFieldsValue,
      setFieldValue,
      getFieldValue,
      getFieldsValue,
    },
  ];
}

export function useFormInstance(): FormInstance {
  const context = useContext<FormInstance>(FormContext);
  return context;
}
