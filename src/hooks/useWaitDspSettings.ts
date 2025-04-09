import { DSPParamSettings } from '../types/dspTypes';
import { useDspSettingsContext } from './contextHooks';
import { useWaiter } from './useWaiter';

export function useWaitDspSettings<Args extends any[]>(waitFor: (...args: Args) => Promise<DSPParamSettings | Error>) {
    const { setData: setSettings, setError } = useDspSettingsContext();
    if (!setSettings || !setError) return undefined;
    
    return useWaiter(waitFor, (settings) => settings instanceof Error ? setError(settings) : setSettings(settings));
}
