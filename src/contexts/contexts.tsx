import { Dispatch, SetStateAction, createContext } from 'react';
import { DSPCompanderParameters, DSPEQParameters, DSPParamSettings } from '../types/dspTypes';
import { EELParameter, EELParameterType, PluginData, PluginStateData } from '../types/types';
import { AsyncDataContext } from '../components/dataProviders/AsyncDataProvider';
import { FlatpakFixState } from '../types/types';

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

export const PluginContext = createContext<AsyncDataContext<PluginData>>({}); //Top level plugin data
export const DspSettingsContext = createContext<DataContext<DSPParamSettings>>({}); //dsp settings
export const PluginStateContext = createContext<DataContext<PluginStateData>>({}); // plugin specfic settings
export const FlatpakFixContext = createContext<FlatpakFixStateContext>({});
export const EQDataContext = createContext<{ data?: DSPEQParameters; setParameter?: (parameter: keyof DSPEQParameters, value: number) => void; setAll?: (eqSettings: DSPEQParameters) => void; }>({});
export const CompanderDataContext = createContext<{ data?: DSPCompanderParameters; setParameter?: (parameter: keyof DSPCompanderParameters, value: number) => void; }>({});
export const EELParametersContext = createContext<AsyncDataContext<EELParameter<EELParameterType>[]>>({});
export const EELTriggerContext = createContext<DataContext<{}>>({});
