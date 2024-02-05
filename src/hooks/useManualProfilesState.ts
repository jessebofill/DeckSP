import { profileManager } from '../controllers/ProfileManager';
import { handleGetDspSettingsAfterProfileLoad } from '../controllers/asyncDataHandlers';
import { useWaitDspSettings } from './useWaitDspSettings';

export function useManualProfilesState() {
    
    const waitForSetUseManual = async (checked: boolean) => {
        profileManager.setLock(profileManager.setUseManualProfiles(checked));
        return handleGetDspSettingsAfterProfileLoad();
    };
    const waitForManualProfile = async (profileId: string) => {
        profileManager.setLock(profileManager.applyProfile(profileId, true));
        return handleGetDspSettingsAfterProfileLoad();
    };
    
    return {
        useManual: profileManager.manuallyApply,
        manualProfileId: profileManager.manualProfileId,
        onChangeUseManual: useWaitDspSettings(waitForSetUseManual),
        onChangeManualProfile: useWaitDspSettings(waitForManualProfile)
    };
};