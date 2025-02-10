import { PanelSection, PanelSectionRow } from '@decky/ui';
import { VFC } from 'react';
import { ParameterSlider } from '../base/ParameterSlider';
import { ParameterToggle } from '../base/ParameterToggle';

export const WidenessControls: VFC<{}> = ({ }) => {

    return (
        <PanelSection title='Stereo Wideness'>
            <PanelSectionRow>
                <ParameterToggle parameter='stereowide_enable' />
            </PanelSectionRow>
            <PanelSectionRow>
                <ParameterSlider parameter='stereowide_level' />
            </PanelSectionRow>
        </PanelSection>
    );
};