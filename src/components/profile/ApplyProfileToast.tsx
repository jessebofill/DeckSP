import { VFC } from 'react';
import { Toaster } from '../../controllers/Toaster';
import { PLUGIN_NAME } from '../../defines/pluginName';
import { ProfileIcon } from './ProfileIcon';
import { Profile, ProfileType } from '../../types/types';
import { ProfileManager } from '../../controllers/ProfileManager';

interface ApplyProfileToastTitleProps {
    profile: Profile<ProfileType>;
    profileManager: ProfileManager;
}

const ApplyProfileToastTitle: VFC<ApplyProfileToastTitleProps> = ({ profile, profileManager }) => {

    return (
        <div style={{ gap: '4px', display: 'flex', alignItems: 'center' }}>
            Applying Profile: {profile.name}
            <ProfileIcon profileId={profile.id} profileManager={profileManager} size='14px' />
        </div>
    );
};

export const ToastApplyingProfile = (profile: Profile<ProfileType>, profileManager: ProfileManager, isManuallyApplied?: boolean) => Toaster.toast(<ApplyProfileToastTitle profile={profile} profileManager={profileManager} />, `${isManuallyApplied ? 'Manually' : 'Automatically'} applying ${PLUGIN_NAME} profile`);