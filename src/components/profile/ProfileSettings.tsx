import { PanelSection, PanelSectionRow } from '@decky/ui';
import { FC } from 'react';
import { usePerGameProfileState } from '../../hooks/usePerGameProfileState';
import { WaitToggle } from '../waitable/WaitToggle';
import { getActiveAppId } from '../../lib/utils';
import { globalAppId } from '../../defines/constants';
import { QAMUnderTitleHider } from '../qam/QAMUnderTitleHider';
import { observer } from 'mobx-react-lite';
import { useManualProfilesState } from '../../hooks/useManualProfilesState';
import { ManualProfilesDropdown } from './ManualProfilesDropdown';
import { CurrentProfile } from './CurrentProfile';
import { SetDefaultsButton } from './SetDefaultsButton';

export const ProfileSettings: FC<{}> = observer(({ }) => {
    const { checked: perGameGecked, onChange: onChangePerGame } = usePerGameProfileState();
    const { useManual, onChangeUseManual, manualProfileId, onChangeManualProfile } = useManualProfilesState();
    if (!onChangePerGame || !onChangeUseManual || !onChangeManualProfile) return null;

    return (
        <PanelSection title='Profiles'>
            <QAMUnderTitleHider />
            <div style={{ padding: '5px 0' }}>
                <CurrentProfile />
            </div>
            {getActiveAppId() !== globalAppId && !useManual &&
                <PanelSectionRow>
                    <WaitToggle label='Use per-game profile' checked={perGameGecked} onChange={onChangePerGame} bottomSeparator='none' />
                </PanelSectionRow>
            }
            <PanelSectionRow>
                <WaitToggle label='Manually apply profile' checked={useManual} onChange={onChangeUseManual} bottomSeparator={'none'} />
            </PanelSectionRow>
            {useManual && (
                <PanelSectionRow>
                    <ManualProfilesDropdown selectedOption={manualProfileId} onSelectProfile={onChangeManualProfile} />
                </PanelSectionRow>
            )}
            <PanelSectionRow>
                <SetDefaultsButton />
            </PanelSectionRow>
        </PanelSection>
    );
});