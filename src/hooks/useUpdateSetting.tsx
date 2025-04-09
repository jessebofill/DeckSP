import { PluginManager } from '../controllers/PluginManager';
import { Log } from '../lib/log';
import { PluginSettings } from '../types/types';
import { usePluginStateContext } from './contextHooks';
import { useWaiter } from './useWaiter';

export function useUpdateSetting<Setting extends keyof PluginSettings>(setting: Setting, checkForBackendError?: boolean) {
    const { data, setData, setError } = usePluginStateContext();
    const onUndefiedContext = (value: PluginSettings[Setting]) => Log.warnN('useUpdateSettings', 'Context data was undefined when rendering');
    if (!data || !setData || !setError) return onUndefiedContext;
    return useWaiter((value: PluginSettings[Setting]) => PluginManager.updateSettings({ [setting]: value }, checkForBackendError), settings => settings instanceof Error ? setError(settings) : setData(data => data && ({ ...data, settings }))) ?? onUndefiedContext;
};