import { MultiDropdownOption } from 'decky-frontend-lib';
import { ProfileType, profileManager } from '../controllers/ProfileManager'

export const useProfileMultiDropdownOptions = () => {
    const gameOptions = useGameProfileMultiDropdownOption();
    const userOptions = useUserProfileMultiDropdownOption();

    const options = [
        gameOptions
    ];

    if (userOptions) {
        options.push(userOptions);
        return options as [MultiDropdownOption, MultiDropdownOption];
    };
    
    return options as [MultiDropdownOption];
}

export const useGameProfileMultiDropdownOption = () => {
    const gameProfiles = Object.values(profileManager.profiles).filter(profile => profile.type === ProfileType.game);

    return {
        label: 'Game',
        options: gameProfiles.map(profile => ({ data: profile.id, label: profile.name }))
    };
}

export const useUserProfileMultiDropdownOption = () => {
    const userProfiles = Object.values(profileManager.profiles).filter(profile => profile.type === ProfileType.user);

    return userProfiles.length > 0 ?
        {
            label: 'Custom',
            options: userProfiles.map(profile => ({ data: profile.id, label: profile.name }))
        } : undefined;
}