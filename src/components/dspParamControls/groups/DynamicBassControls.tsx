import { PanelSection, PanelSectionRow } from 'decky-frontend-lib';
import { VFC } from 'react'
import { ParameterToggle } from '../base/ParameterToggle';
import { ParameterSlider } from '../base/ParameterSlider';
interface DynamicBassControls {

}

export const DynamicBassControls: VFC<DynamicBassControls> = ({ }) => {

    return (
        <PanelSection title='Dynamic Bass'>
            <PanelSectionRow>
                <ParameterToggle parameter='bass_enable' />
            </PanelSectionRow>
            <PanelSectionRow>
                <ParameterSlider parameter='bass_maxgain' />
            </PanelSectionRow>
        </PanelSection>
    );
};