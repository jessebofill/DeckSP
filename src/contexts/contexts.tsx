import { Dispatch, SetStateAction, createContext } from 'react';
import { DSPCompanderParameters, DSPEQParameters, DSPParamSettings } from '../types/dspTypes';
import { PluginData, PluginSettings } from '../types/types';
import { AsyncDataContext } from '../components/generic/AsyncDataProvider';

export type DataProviderSetData<DataType> = Dispatch<SetStateAction<DataType | undefined>>;
export type DataProviderSetError = Dispatch<SetStateAction<Error | undefined>>;

export type DataContext<DataType> = {
    data?: DataType;
    setData?: DataProviderSetData<DataType>;
    error?: Error;
    setError?: DataProviderSetError;
};

export const PluginContext = createContext<AsyncDataContext<PluginData>>({});
export const DspSettingsContext = createContext<DataContext<DSPParamSettings>>({});export const PluginSettingsContext = createContext<DataContext<PluginSettings>>({});
export const EQDataContext = createContext<{ data?: DSPEQParameters; setParameter?: (parameter: keyof DSPEQParameters, value: number) => void; setAll?: (eqSettings: DSPEQParameters) => void; }>({});
export const CompanderDataContext = createContext<{ data?: DSPCompanderParameters; setParameter?: (parameter: keyof DSPCompanderParameters, value: number) => void; }>({});

