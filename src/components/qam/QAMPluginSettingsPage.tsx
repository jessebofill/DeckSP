import { DialogButton, Focusable } from 'decky-frontend-lib';
import { VFC } from 'react';
import { ProfileSettings } from '../profile/ProfileSettings';
import { FixFlatpak } from '../other/FixFlatpak';
import { QAMPage } from './QAMPage';

export const QAMPluginSettingsPage: VFC<{}> = ({ }) => {
    return (
        <QAMPage dataProvider='plugin'>
            <DialogButton>
                Set to Default
            </DialogButton>
            <ProfileSettings />
            <FixFlatpak />
        </QAMPage>
    );
};