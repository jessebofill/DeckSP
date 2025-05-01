import { useContext } from 'react';
import { CompanderDataContext, DspSettingsContext, EELDataContext, EELTriggerContext, EQDataContext, FlatpakFixContext, PluginContext, PluginStateContext, StaticDataContext } from '../contexts/contexts';


export const useDspSettingsContext = () => useContext(DspSettingsContext);
export const usePluginStateContext = () => useContext(PluginStateContext);
export const usePluginContext = () => useContext(PluginContext);
export const useFlatpakFixContext = () => useContext(FlatpakFixContext);
export const useEQDataContext = () => useContext(EQDataContext);
export const useCompanderDataContext = () => useContext(CompanderDataContext);
export const useEELDataContext = () => useContext(EELDataContext);
export const useEELTriggerContext = () => useContext(EELTriggerContext);
export const useStaticContext = () => useContext(StaticDataContext);