import { VFC } from 'react';
import { ProfileSettings } from '../profile/ProfileSettings';
import { FixFlatpak } from '../other/FixFlatpak';
import { QAMPage } from './QAMPage';
import { usePluginState } from '../../hooks/contextHooks';

export const QAMPluginSettingsPage: VFC<{}> = ({ }) => {
    const { data } = usePluginState();
    if (!data) return null;

    return (
        <QAMPage dataProvider='plugin'>
            {data.jdspInstall ? <ProfileSettings /> : <FixFlatpak />}
        </QAMPage>
    );
};