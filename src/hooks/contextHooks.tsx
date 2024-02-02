import { useContext } from 'react';
import { DspSettingsContext } from '../contexts/contexts';
import { PluginSettingsContext } from '../contexts/contexts';
import { PluginContext } from '../contexts/contexts';
import { EQDataContext } from '../contexts/contexts';

export const useDspSettings = () => useContext(DspSettingsContext);
export const usePluginSettings = () => useContext(PluginSettingsContext);
export const usePluginContext = () => useContext(PluginContext);
export const useEQData = () => useContext(EQDataContext);

