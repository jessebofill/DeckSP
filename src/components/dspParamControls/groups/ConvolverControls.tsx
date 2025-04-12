import { PanelSection, PanelSectionRow } from '@decky/ui';
import { FC } from 'react';
import { ParameterToggle } from '../base/ParameterToggle';
import { ParameterPathSelector } from '../base/ParameterPathSelector';
import { ParameterDropdown } from '../base/ParameterDropdown';
import { EffectInfo } from '../../other/EffectInfo';

export const ConvolverControls: FC<{}> = ({ }) => {
    return (
        <EffectInfo effect='convolver' >
            <PanelSection title='Convolver'>
                <PanelSectionRow>
                    <ParameterToggle parameter='convolver_enable' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterPathSelector parameter='convolver_file' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterDropdown parameter='convolver_optimization_mode' />
                </PanelSectionRow>
            </PanelSection>
        </EffectInfo>
    );
};