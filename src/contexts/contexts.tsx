import { Dispatch, SetStateAction, createContext } from 'react';
import { DSPCompanderParameters, DSPEQParameters, DSPParamSettings } from '../types/dspTypes';
import { PluginData, PluginStateData } from '../types/types';
import { AsyncDataContext } from '../components/generic/AsyncDataProvider';
import { FlatpakFixState } from '../components/other/FlatpakFixContextProvider';

export type DataProviderSetData<DataType> = Dispatch<SetStateAction<DataType | undefined>>;
export type DataProviderSetError = Dispatch<SetStateAction<Error | undefined>>;

export type DataContext<DataType> = {
    data?: DataType;
    setData?: DataProviderSetData<DataType>;
    error?: Error;
    setError?: DataProviderSetError;
};

export type FlatpakFixStateContext = {
    state?: FlatpakFixState;
    setState?: (state: FlatpakFixState) => void;
    description?: string;
    setDescription?: (description: string) => void;
};

export const PluginContext = createContext<AsyncDataContext<PluginData>>({});
export const DspSettingsContext = createContext<DataContext<DSPParamSettings>>({});
export const PluginStateContext = createContext<DataContext<PluginStateData>>({});
export const FlatpakFixContext = createContext<FlatpakFixStateContext>({});
export const EQDataContext = createContext<{ data?: DSPEQParameters; setParameter?: (parameter: keyof DSPEQParameters, value: number) => void; setAll?: (eqSettings: DSPEQParameters) => void; }>({});
export const CompanderDataContext = createContext<{ data?: DSPCompanderParameters; setParameter?: (parameter: keyof DSPCompanderParameters, value: number) => void; }>({});

