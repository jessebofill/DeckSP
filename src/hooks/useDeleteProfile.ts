import { profileManager } from '../controllers/ProfileManager';
import { Toaster } from '../controllers/Toaster';
import { useWaiter } from './useWaiter';

export type DeleteProfileType = (profileId: string) => Promise<string | Error>;

export function useDeleteProfile(): DeleteProfileType | undefined {
    return useWaiter((profileId: string) => profileManager.deleteProfile(profileId), (res => { if (res instanceof Error) Toaster.toast('DeckSP Error', res.message)}));
};