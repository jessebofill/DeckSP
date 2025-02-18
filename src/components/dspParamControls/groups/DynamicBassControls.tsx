import { PanelSection, PanelSectionRow } from '@decky/ui';
import { FC } from 'react'
import { ParameterToggle } from '../base/ParameterToggle';
import { ParameterSlider } from '../base/ParameterSlider';
import { EffectInfo } from '../../other/EffectInfo';
interface DynamicBassControls {

}

export const DynamicBassControls: FC<DynamicBassControls> = ({ }) => {

    return (
        <PanelSection title='Dynamic Bass Boost'>
            <EffectInfo effect='dynamicBassBoost'>
                <PanelSectionRow>
                    <ParameterToggle parameter='bass_enable' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='bass_maxgain' />
                </PanelSectionRow>
            </EffectInfo>
        </PanelSection>
    );
};