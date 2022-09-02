export interface FormStore {
  [key: string]: any;
}

export type NamePath = string | string[];

export interface FormInstance {
  setFieldValue: (namePath: NamePath, value: any) => void;
  setFieldsValue: (partial: FormStore) => void;
  getFieldValue: (namePath: NamePath) => any;
  getFieldsValue: () => FormStore;
}

export type UseFormType = (initForm?: FormStore) => [FormInstance];
export type UseFormInstanceType = () => FormInstance;
