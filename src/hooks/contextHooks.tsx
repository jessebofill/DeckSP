import { useContext } from 'react';
import { CompanderDataContext, DspSettingsContext, EELParametersContext, EELTriggerContext, EQDataContext, FlatpakFixContext, PluginContext, PluginStateContext } from '../contexts/contexts';


export const useDspSettingsContext = () => useContext(DspSettingsContext);
export const usePluginStateContext = () => useContext(PluginStateContext);
export const usePluginContext = () => useContext(PluginContext);
export const useFlatpakFixContext = () => useContext(FlatpakFixContext);
export const useEQDataContext = () => useContext(EQDataContext);
export const useCompanderDataContext = () => useContext(CompanderDataContext);
export const useEELParametersContext = () => useContext(EELParametersContext);
export const useEELTriggerContext = () => useContext(EELTriggerContext);

