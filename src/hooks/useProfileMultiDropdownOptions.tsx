import { profileManager } from '../controllers/ProfileManager'
import { Profile, ProfileType } from '../types/types';

export type OtherUserProfileDropdownOptionData = { user: string, profileId: string };

export const useProfileMultiDropdownOptions = (userId?: string) => {
    const gameOptions = useProfileTypeMultiDropdownOption(ProfileType.Game, userId);
    const customOptions = useProfileTypeMultiDropdownOption(ProfileType.Custom, userId);
    return [gameOptions, customOptions].filter(options => options !== undefined);
};

export const useProfileTypeMultiDropdownOption = (type: ProfileType, userId?: string) => {
    const profiles = userId === undefined ? profileManager.currentUserProfiles : profileManager.otherUsers[userId].profiles ?? {};
    const typeProfiles = Object.values(profiles).filter(profile => profile.type === type);
    const getData = (profile: Profile<ProfileType>) =>
        userId === undefined ? profile.id :
            {
                user: userId,
                profileId: profile.id
            } as OtherUserProfileDropdownOptionData;

    return typeProfiles.length === 0 ? undefined :
        {
            label: type === ProfileType.Game ? 'Game' : 'Custom',
            options: typeProfiles.map(profile => (
                {
                    data: getData(profile),
                    label: profile.name
                }
            ))
        };
};

export const useOtherUsersProfilesMultiDropdownOption = () => {
    const userLabel = (userId: string, name?: string, persona?: string) => name === undefined || persona === undefined ? userId :
        <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
            <div>
                {persona}
            </div>
            <div style={{ textTransform: 'uppercase', fontSize: '11px', lineHeight: '11px', fontWeight: 'bold', color: '#5c636b' }}>
                {name}
            </div>
        </div>;

    const users = Object.entries(profileManager.otherUsers).map(([userId, { name, persona }]) => ({ label: userLabel(userId, name, persona), options: useProfileMultiDropdownOptions(userId) }));

    return users.length === 0 ? undefined :
        {
            label: 'Users',
            options: users
        };
};