import {createContext} from 'react';
import {FormConfig} from './types';

export const FormContext = createContext(null);

export const FormConfigContext = createContext<FormConfig>({});
