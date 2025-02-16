import { FC } from 'react';
import { PLUGIN_NAME } from '../../defines/constants';
import { ProfileIcon } from './ProfileIcon';
import { Profile, ProfileType } from '../../types/types';
import { ProfileManager } from '../../controllers/ProfileManager';
import { toast } from '../../lib/utils';

interface ApplyProfileToastTitleProps {
    profile: Profile<ProfileType>;
    profileManager: ProfileManager;
}

const ApplyProfileToastTitle: FC<ApplyProfileToastTitleProps> = ({ profile, profileManager }) => {

    return (
        <div style={{ gap: '4px', display: 'flex', alignItems: 'center' }}>
            Applied Profile: {profile.name}
            <ProfileIcon profileId={profile.id} profileManager={profileManager} size='14px' />
        </div>
    );
};

export const ToastAppliedProfile = (profile: Profile<ProfileType>, profileManager: ProfileManager, isManuallyApplied?: boolean) => toast(<ApplyProfileToastTitle profile={profile} profileManager={profileManager} />, `${isManuallyApplied ? 'Manually' : 'Automatically'} Applied ${PLUGIN_NAME} profile`);