import { FC } from 'react';
import { FaGlobeAsia } from 'react-icons/fa';
import { ProfileManager } from '../../controllers/ProfileManager';
import { globalAppId } from '../../defines/constants';
import { AppImage, AppArtworkAssetType } from '../native/AppImage';
import { FaCircleExclamation } from 'react-icons/fa6';

export interface ProfileIconProps {
    profileId: string;
    profileManager: ProfileManager;
    size?: string;
}

export const ProfileIcon: FC<ProfileIconProps> = ({ profileId, profileManager, size }) => {
    const defaultSize = '20px'

    const isGame = profileId !== globalAppId && Object.keys(profileManager.profiles).includes(profileId);
    const appOverview = isGame ? appStore.GetAppOverviewByAppID(parseInt(profileId)) : undefined;

    return (
        <>
            {profileId === globalAppId || profileManager.unknownProfile ? (
                <div style={{ height: size ?? defaultSize, width: size ?? defaultSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {profileManager.unknownProfile ?
                        <FaCircleExclamation size='70%' fill='#aa2222'/> :
                        <FaGlobeAsia size='90%' fill='#999696' />}
                </div>
            ) : appOverview && (
                <AppImage
                    style={{ width: size ?? defaultSize }}
                    app={appOverview}
                    eAssetType={AppArtworkAssetType.Icon}
                    className={'perf_Icon_1op4w'}
                    bShortDisplay={true} />
            )}
        </>
    );
};