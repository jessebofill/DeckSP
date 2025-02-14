import { profileManager } from '../controllers/ProfileManager';
import { PLUGIN_NAME } from '../defines/constants';
import { toast } from '../lib/utils';
import { useWaiter } from './useWaiter';

export type DeleteProfileType = (profileId: string) => Promise<string | Error>;

export function useDeleteProfile(): DeleteProfileType | undefined {
    return useWaiter((profileId: string) => profileManager.deleteProfile(profileId), (res => { if (res instanceof Error) toast(`${PLUGIN_NAME} Error`, res.message)}));
};