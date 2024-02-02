import { ProfileType, profileManager } from '../controllers/ProfileManager';
import { handleGetDspSettingsAfterProfileLoad } from '../controllers/asyncDataHandlers';
import { Log } from '../lib/log';
import { getActiveAppId } from '../lib/utils';
import { useDspSettings } from './contextHooks';
import { useWaiter } from './useWaiter';

export function useManualProfilesState() {
    const { setData: setSettings, setError } = useDspSettings();
    if (!setSettings || !setError) return {};
    
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
        onChangeUseManual: useWaiter(waitForSetUseManual, (settings) => settings instanceof Error ? setError(settings) : setSettings(settings)),
        onChangeManualProfile: useWaiter(waitForManualProfile, (settings) => settings instanceof Error ? setError(settings) : setSettings(settings)),
    };
};