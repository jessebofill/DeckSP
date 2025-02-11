import { PanelSection, PanelSectionRow } from '@decky/ui';
import { FC } from 'react';
import { ParameterSlider } from '../base/ParameterSlider';

export const LimiterControls: FC<{}> = ({ }) => {

    return (
        <PanelSection title='Limiter'>
            <PanelSectionRow>
                <ParameterSlider parameter='master_limthreshold' />
            </PanelSectionRow>
            <PanelSectionRow>
                <ParameterSlider parameter='master_limrelease' />
            </PanelSectionRow>
        </PanelSection>
    );
};