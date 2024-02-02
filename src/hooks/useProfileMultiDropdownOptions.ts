import { MultiDropdownOption } from 'decky-frontend-lib';
import { ProfileType, profileManager } from '../controllers/ProfileManager'

export const useProfileMultiDropdownOptions = () => {
    const gameProfiles = Object.values(profileManager.profiles).filter(profile => profile.type === ProfileType.game);
    const userProfiles = Object.values(profileManager.profiles).filter(profile => profile.type === ProfileType.user);

    const options = [
        {
            label: 'Game',
            options: gameProfiles.map(profile => ({ data: profile.id, label: profile.name }))
        }
    ];

    if (userProfiles.length > 0) options.push(
        {
            label: 'Custom',
            options: userProfiles.map(profile => ({ data: profile.id, label: profile.name }))
        }
    );

    return options as [MultiDropdownOption, MultiDropdownOption];
}