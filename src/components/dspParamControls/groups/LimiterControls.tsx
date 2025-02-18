import { PanelSection, PanelSectionRow } from '@decky/ui';
import { FC } from 'react';
import { ParameterSlider } from '../base/ParameterSlider';
import { EffectInfo } from '../../other/EffectInfo';

export const LimiterControls: FC<{}> = ({ }) => {

    return (
        <PanelSection title='Limiter'>
            <EffectInfo effect='limiter'>
                <PanelSectionRow>
                    <ParameterSlider parameter='master_limthreshold' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <ParameterSlider parameter='master_limrelease' />
                </PanelSectionRow>
            </EffectInfo>
        </PanelSection>
    );
};