import { Marquee } from 'decky-frontend-lib';
import { VFC } from 'react';
import { profileManager } from '../../controllers/ProfileManager';
import { Log } from '../../lib/log';
import { observer } from 'mobx-react-lite';
import { ProfileIcon } from './ProfileIcon';

export const CurrentProfile: VFC<CurrentProfileTextProps> = observer(({ useMarquee }) => {
    Log.log('rendering current profile');

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '22px' }}>
            <ProfileIcon profileId={profileManager.activeProfileId} profileManager={profileManager} size='22px' />
            <CurrentProfileText useMarquee={useMarquee} />
        </div>
    );
});

interface CurrentProfileTextProps {
    useMarquee?: boolean;
}

export const CurrentProfileText: VFC<CurrentProfileTextProps> = ({ useMarquee }) => {
    const containerClass = 'profile-name-container';
    const text = `Using ${profileManager.activeProfile?.name} profile`;

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
