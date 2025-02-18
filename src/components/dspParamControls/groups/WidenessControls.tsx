import { PanelSection, PanelSectionRow } from '@decky/ui';
import { FC } from 'react';
import { ParameterSlider } from '../base/ParameterSlider';
import { ParameterToggle } from '../base/ParameterToggle';
import { EffectInfo } from '../../other/EffectInfo';

export const WidenessControls: FC<{}> = ({ }) => {

    return (
        <PanelSection title='Stereo Wideness'>
            <EffectInfo effect='soundstageWideness'>
                <PanelSectionRow>
                    <ParameterToggle parameter='stereowide_enable' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='stereowide_level' />
                </PanelSectionRow>
            </EffectInfo>
        </PanelSection>
    );
};