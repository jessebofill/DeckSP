import { PanelSection, PanelSectionRow } from '@decky/ui';
import { FC } from 'react';
import { ParameterSlider } from '../base/ParameterSlider';
import { ParameterToggle } from '../base/ParameterToggle';
import { PresetDropdown } from '../base/PresetDropdown';
import { EffectInfo } from '../../other/EffectInfo';

export const ReverbControls: FC<{}> = ({ }) => {

    return (
        <PanelSection title='Reverb'>
            <EffectInfo effect='reverb'>
                <PanelSectionRow>
                    <ParameterToggle parameter='reverb_enable' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <PresetDropdown type='reverb' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_wet' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_finaldry' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_finalwet' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_reflection_amount' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_reflection_factor' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_reflection_width' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_decay' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_delay' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_osf' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_width' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_bassboost' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_lpf_bass' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_lpf_damp' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_lpf_input' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_lpf_output' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_lfo_spin' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='reverb_lfo_wander' />
                </PanelSectionRow>
            </EffectInfo>
        </PanelSection>
    );
};