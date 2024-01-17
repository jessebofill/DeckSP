import { Focusable, PanelSection, PanelSectionRow } from 'decky-frontend-lib';
import { VFC } from 'react';
import { ParameterSlider } from '../base/ParameterSlider';
import { ParameterToggle } from '../base/ParameterToggle';

export const MasterControls: VFC<{}> = ({ }) => {
    return (
        <Focusable>
            <PanelSection title="Master">
                <PanelSectionRow>
                    <ParameterToggle parameter='master_enable' customLabel={'Bypass All'} invert={true}/>
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='master_postgain' />
                </PanelSectionRow>
            </PanelSection>
        </Focusable>
    );
};