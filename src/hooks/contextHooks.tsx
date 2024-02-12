import { useContext } from 'react';
import { CompanderDataContext, DspSettingsContext, EQDataContext, FlatpakFixContext, PluginContext, PluginStateContext } from '../contexts/contexts';


export const useDspSettings = () => useContext(DspSettingsContext);
export const usePluginState = () => useContext(PluginStateContext);
export const usePluginContext = () => useContext(PluginContext);
export const useFlatpakFix = () => useContext(FlatpakFixContext);
export const useEQData = () => useContext(EQDataContext);
export const useCompanderData = () => useContext(CompanderDataContext);;


