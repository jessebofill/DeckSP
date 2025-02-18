import { FC } from 'react';
import { ProfileSettings } from '../profile/ProfileSettings';
import { FixFlatpak } from '../other/FixFlatpak';
import { QAMPage } from './QAMPage';
import { usePluginState } from '../../hooks/contextHooks';
import { Focusable, Navigation, PanelSection, PanelSectionRow } from '@decky/ui';
import { QAMHiglightable } from './QAMHiglightable';
import { FaCircleInfo } from 'react-icons/fa6';
import { infoRoute } from '../../defines/constants';
import { EnableInDesktopToggle } from './EnableInDesktopToggle';

export const QAMPluginSettingsPage: FC<{}> = ({ }) => {
    const { data } = usePluginState();

    return (
        <QAMPage dataProvider='plugin' className='main-page'>
            {!data ? null :
                data.jdspInstall ? <ProfileSettings /> :
                    <FixFlatpak />}
            <PanelSection title='Plugin'>
                <PanelSectionRow>
                    <EnableInDesktopToggle />
                </PanelSectionRow>
            <QAMHiglightable bottomSeparator='none'>
                <Focusable
                    onActivate={() => Navigation.Navigate(infoRoute)}
                    onOKActionDescription='View Info'
                    style={{ fontSize: '12px', display: 'flex', justifyContent: 'center', gap: '10px' }}
                >
                    Plugin Info
                    <FaCircleInfo />
                </Focusable>
            </QAMHiglightable>
            </PanelSection>
        </QAMPage>
    );
};