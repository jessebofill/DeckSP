import { VFC } from 'react';
import { ProfileSettings } from '../profile/ProfileSettings';
import { FixFlatpak } from '../other/FixFlatpak';
import { QAMPage } from './QAMPage';
import { usePluginState } from '../../hooks/contextHooks';

export const QAMPluginSettingsPage: VFC<{}> = ({ }) => {
    const { data } = usePluginState();

    return (
        <QAMPage dataProvider='plugin'>
            {!data ? null :
            data.jdspInstall ? <ProfileSettings /> :
            <FixFlatpak />}
        </QAMPage>
    );
};