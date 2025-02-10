import { PanelSection, PanelSectionRow } from '@decky/ui';
import { VFC } from 'react';
import { ParameterSlider } from '../base/ParameterSlider';

export const LimiterControls: VFC<{}> = ({ }) => {

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