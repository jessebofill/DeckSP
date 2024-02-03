import { VFC } from 'react';
import { Toaster } from '../../controllers/Toaster';
import { PLUGIN_NAME } from '../../defines/pluginName';
import { ProfileIcon } from './ProfileIcon';
import { Profile, ProfileType } from '../../controllers/ProfileManager';

interface ApplyProfileToastTitleProps {
    profile: Profile<ProfileType>;
}

const ApplyProfileToastTitle: VFC<ApplyProfileToastTitleProps> = ({ profile }) => {

    return (
        <div style={{ gap: '4px', display: 'flex', alignItems: 'center' }}>
            Applying Profile: {profile.name}
            <ProfileIcon profileId={profile.id} size='14px' />
        </div>
    );
};

export const ToastApplyingProfile = (profile: Profile<ProfileType>, isManuallyApplied?: boolean) => Toaster.toast(<ApplyProfileToastTitle profile={profile} />, `${isManuallyApplied ? 'Manually' : 'Automatically'} applying ${PLUGIN_NAME} profile`);