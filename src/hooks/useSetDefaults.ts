import { profileManager } from '../controllers/ProfileManager';
import { handleGetDspSettingsAfterProfileLoad } from '../controllers/asyncDataHandlers';
import { useWaitDspSettings } from './useWaitDspSettings';

export function useSetDefaults() {

    const waitFor = async () => {
        profileManager.setLock(profileManager.setDefaults());
        return handleGetDspSettingsAfterProfileLoad();
    };
    
    return useWaitDspSettings(waitFor);
};