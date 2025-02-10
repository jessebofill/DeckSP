import { PanelSection, PanelSectionRow } from '@decky/ui';
import { VFC } from 'react';
import { ParameterSlider } from '../base/ParameterSlider';
import { ParameterToggle } from '../base/ParameterToggle';

export const TubeModelingControls: VFC<{}> = ({ }) => {

    return (
        <PanelSection title='Tube Modeling'>
            <PanelSectionRow>
                <ParameterToggle parameter='tube_enable' />
            </PanelSectionRow>
            <PanelSectionRow>
                <ParameterSlider parameter='tube_pregain' />
            </PanelSectionRow>
        </PanelSection>
    );
};