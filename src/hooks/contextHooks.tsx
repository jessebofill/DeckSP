import { createContext, useContext } from 'react';
import { DSPParamSettings } from '../types/dspTypes';
import { AsyncDataContext } from '../components/generic/AsyncDataProvider';

export const DspSettingsContext = createContext<AsyncDataContext<DSPParamSettings>>({});
export const useDspSettings = () => useContext(DspSettingsContext);

export const PluginSettingsContext = createContext<AsyncDataContext<DSPParamSettings>>({});
export const usePluginSettings = () => useContext(PluginSettingsContext);

