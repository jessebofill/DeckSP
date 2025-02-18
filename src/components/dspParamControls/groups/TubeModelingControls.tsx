import { PanelSection, PanelSectionRow } from '@decky/ui';
import { FC } from 'react';
import { ParameterSlider } from '../base/ParameterSlider';
import { ParameterToggle } from '../base/ParameterToggle';
import { EffectInfo } from '../../other/EffectInfo';

export const TubeModelingControls: FC<{}> = ({ }) => {

    return (
        <PanelSection title='Tube Modeling'>
            <EffectInfo effect='analogModeling'>
                <PanelSectionRow>
                    <ParameterToggle parameter='tube_enable' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='tube_pregain' />
                </PanelSectionRow>
            </EffectInfo>
        </PanelSection>
    );
};