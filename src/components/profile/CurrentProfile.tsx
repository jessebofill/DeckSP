import { Marquee } from 'decky-frontend-lib';
import { VFC } from 'react';
import { profileManager, globalAppId } from '../../controllers/ProfileManager';
import { AppArtworkAssetType, AppImage } from '../native/AppImage';
import { Log } from '../../lib/log';
import { observer } from 'mobx-react-lite';
import { FaGlobeAsia } from "react-icons/fa";

export const CurrentProfile: VFC<CurrentProfileTextProps> = observer(({ useMarquee }) => {
    Log.log('rendering current profile');

    const isGame = profileManager.activeProfileId !== globalAppId && Object.keys(profileManager.profiles).includes(profileManager.activeProfileId);
    const appOverview = isGame ? appStore.GetAppOverviewByAppID(profileManager.activeProfileIdNumber) : undefined;
    //auto profile indicator
    //user / game profile indicator
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '22px' }}>
            {profileManager.activeProfileId === globalAppId ? (
                <div style={{ height: '22px', display: 'flex', alignItems: 'center' }}>
                    <FaGlobeAsia size='19px' fill='#999696' />
                </div>
            ) : appOverview && (
                <AppImage
                    style={{ width: '22px' }}
                    app={appOverview}
                    eAssetType={AppArtworkAssetType.Icon}
                    className={'perf_Icon_1op4w'}
                    bShortDisplay={true} />
            )}
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
