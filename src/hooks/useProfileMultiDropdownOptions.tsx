import { MultiDropdownOption } from '@decky/ui';
import { profileManager } from '../controllers/ProfileManager'
import { ProfileType } from '../types/types';

export const useProfileMultiDropdownOptions = () => {
    const gameOptions = useGameProfileMultiDropdownOption();
    const customOptions = useCustomProfileMultiDropdownOption();

    const options = [
        gameOptions
    ];

    if (customOptions) {
        options.push(customOptions);
        return options as [MultiDropdownOption, MultiDropdownOption];
    };
    
    return options as [MultiDropdownOption];
}

export const useGameProfileMultiDropdownOption = () => {
    const gameProfiles = Object.values(profileManager.currentUserProfiles).filter(profile => profile.type === ProfileType.Game);

    return {
        label: 'Game',
        options: gameProfiles.map(profile => ({ data: profile.id, label: profile.name }))
    };
}

export const useCustomProfileMultiDropdownOption = () => {
    const customProfiles = Object.values(profileManager.currentUserProfiles).filter(profile => profile.type === ProfileType.Custom);

    return customProfiles.length > 0 ?
        {
            label: 'Custom',
            options: customProfiles.map(profile => ({ data: profile.id, label: profile.name }))
        } : undefined;
}