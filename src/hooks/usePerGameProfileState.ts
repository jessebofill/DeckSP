import { profileManager } from '../controllers/ProfileManager';
import { handleGetDspSettingsAfterProfileLoad } from '../controllers/asyncDataHandlers';
import { Log } from '../lib/log';
import { getActiveAppId } from '../lib/utils';
import { useDspSettings } from './contextHooks';
import { useWaiter } from './useWaiter';

export function usePerGameProfileState() {
    const { setData: setSettings, setError } = useDspSettings();
    if (!setSettings || !setError) return {};
    
    const waitFor = async (checked: boolean) => {
        profileManager.setLock(profileManager.setGameSpecificProfileEnabled(checked));
        return handleGetDspSettingsAfterProfileLoad();
    };
    
    return {
        checked: !!profileManager.watchedGames[getActiveAppId()],
        onChange: useWaiter(waitFor, (settings) => settings instanceof Error ? setError(settings) : setSettings(settings))
    };
};