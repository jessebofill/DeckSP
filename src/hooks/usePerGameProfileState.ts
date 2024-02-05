import { profileManager } from '../controllers/ProfileManager';
import { handleGetDspSettingsAfterProfileLoad } from '../controllers/asyncDataHandlers';
import { getActiveAppId } from '../lib/utils';
import { useWaitDspSettings } from './useWaitDspSettings';

export function usePerGameProfileState() {
    
    const waitFor = async (checked: boolean) => {
        profileManager.setLock(profileManager.setGameSpecificProfileEnabled(checked));
        return handleGetDspSettingsAfterProfileLoad();
    };
    
    return {
        checked: !!profileManager.watchedGames[getActiveAppId()],
        onChange: useWaitDspSettings(waitFor)
    };
};