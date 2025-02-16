import { Marquee } from '@decky/ui';
import { FC } from 'react';
import { profileManager } from '../../controllers/ProfileManager';
import { observer } from 'mobx-react-lite';
import { BsFillHandIndexThumbFill } from "react-icons/bs";
import { ProfileIcon } from './ProfileIcon';

export const CurrentProfile: FC<CurrentProfileTextProps> = observer(({ useMarquee }) => {

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '22px' }}>
            <ProfileIcon profileId={profileManager.activeProfileId} profileManager={profileManager} size='22px' />
            <CurrentProfileText useMarquee={useMarquee} />
            {!profileManager.unknownProfile && profileManager.manuallyApply && (
                <div style={{ display: 'flex', marginLeft: 'auto' }}>
                    <BsFillHandIndexThumbFill size='16px' fill='#999696' />
                </div>
            )}
        </div>
    );
});

interface CurrentProfileTextProps {
    useMarquee?: boolean;
}

export const CurrentProfileText: FC<CurrentProfileTextProps> = ({ useMarquee }) => {
    const containerClass = 'profile-name-container';
    const text = profileManager.unknownProfile ? 'Profile status unknown' : `Using ${profileManager.activeProfile?.name} profile`;

    return (
        <div
            className={containerClass}
            style={{
                color: '#b8bcbf',
                fontSize: '12px',
                fontWeight: 'normal'
            }}
        >
            <style>{`
                .${containerClass} > div {
                    display: grid;
                }
            `}</style>
            {useMarquee ?
                (
                    <Marquee center={true} play={true}>
                        {text}
                    </Marquee>
                ) : text}
        </div>
    );
};
