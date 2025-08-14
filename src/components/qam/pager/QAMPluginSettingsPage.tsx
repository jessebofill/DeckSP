import { FC } from 'react';
import { ProfileSettings } from '../../profile/ProfileSettings';
import { FixFlatpak } from '../../other/FixFlatpak';
import { QAMPage } from './QAMPage';
import { usePluginStateContext } from '../../../hooks/contextHooks';
import { Focusable, Navigation, PanelSection, PanelSectionRow } from '@decky/ui';
import { QAMHiglightable } from '../QAMHiglightable';
import { FaCircleExclamation, FaCircleInfo } from 'react-icons/fa6';
import { infoRoute } from '../../../defines/constants';
import { EnableInDesktopToggle } from '../EnableInDesktopToggle';
import { SocialButton } from '../../generic/SocialButton';
import { SiGithub, SiKofi } from "react-icons/si";
import { ReorderDspPagesButton } from '../../other/ReorderDspPages';
import { useUpdateSetting } from '../../../hooks/useUpdateSetting';
import { DisableProfileToastsToggle } from '../DisableProfileToastsToggle';
import { PluginManager } from '../../../controllers/PluginManager';
import { observer } from 'mobx-react-lite';

export const QAMPluginSettingsPage: FC<{}> = ({ }) => {
    const { data } = usePluginStateContext();

    return (
        <QAMPage dataProvider='plugin' className='main-page'>
            <WarningMessages />
            {!data ? null :
                data.jdspInstall ? <ProfileSettings /> :
                    <FixFlatpak />}
            <PanelSection title='Plugin'>
                {data?.settings.dspPageOrder &&
                    <QAMHiglightable>
                        <ReorderDspPagesButton currentOrder={data.settings.dspPageOrder} onConfirm={useUpdateSetting('dspPageOrder')} />
                    </QAMHiglightable>}
                <PanelSectionRow>
                    <EnableInDesktopToggle />
                </PanelSectionRow>
                <PanelSectionRow>
                    <DisableProfileToastsToggle />
                </PanelSectionRow>
                <QAMHiglightable>
                    <Focusable
                        onActivate={() => Navigation.Navigate(infoRoute)}
                        onOKActionDescription='View Info'
                        style={{ fontSize: '12px', display: 'flex', justifyContent: 'center', gap: '10px' }}
                    >
                        Plugin Info
                        <FaCircleInfo />
                    </Focusable>
                </QAMHiglightable>
                <SocialButton icon={<SiGithub />} url='https://github.com/jessebofill/DeckSP' fontSize='12px' bottomSeparator='none'>
                    Plugin GitHub
                </SocialButton>
                <SocialButton icon={<SiKofi />} url='https://ko-fi.com/jessebofill' fontSize='12px' bottomSeparator='none'>
                    Kofi
                </SocialButton>
            </PanelSection>
        </QAMPage>
    );
};

export const WarningMessages: FC = observer(() => {
    return !PluginManager.messages.length ? null :
        (
            <div style={{ paddingBottom: '10px', margin: '0 15px' }}>
                <h3 style={{ margin: '5px 0' }}>
                    <FaCircleExclamation style={{ height: '.8em', marginRight: '5px' }} fill="#ffcd00" />
                    Messages
                </h3>
                {PluginManager.messages.map((msg, index) => (
                    <QAMHiglightable bottomSeparator='standard'>
                        <Focusable key={index} style={{ margin: '3px 8px', fontSize: '12px', whiteSpace: 'pre-wrap' }} onActivate={() => { }}>
                            {msg}
                        </Focusable>
                    </QAMHiglightable>
                ))}
            </div>
        );
});