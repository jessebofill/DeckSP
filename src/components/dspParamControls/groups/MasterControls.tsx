import { PanelSection, PanelSectionRow } from '@decky/ui';
import { FC } from 'react';
import { ParameterSlider } from '../base/ParameterSlider';
import { ParameterToggle } from '../base/ParameterToggle';

export const MasterControls: FC<{}> = ({ }) => {
    return (
        <PanelSection title="Master">
            <PanelSectionRow>
                <ParameterToggle parameter='master_enable' customLabel={'Bypass All'} invert={true} />
            </PanelSectionRow>
            <PanelSectionRow>
                <ParameterSlider parameter='master_postgain' />
            </PanelSectionRow>
        </PanelSection>
    );
};