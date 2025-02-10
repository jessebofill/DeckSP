import { PanelSection, PanelSectionRow } from '@decky/ui';
import { VFC } from 'react';
import { ParameterSlider } from '../base/ParameterSlider';
import { ParameterToggle } from '../base/ParameterToggle';
import { useDspSettings } from '../../../hooks/contextHooks';
import { CrossfeedModeDropdown } from '../base/CrossfeedModeDropdown';

export const CrossfeedControls: VFC<{}> = ({ }) => {
    const { data: settings } = useDspSettings();
    if (!settings) return null;

    const disableSliders = settings.crossfeed_mode < 2 
    const noSliders = settings.crossfeed_mode > 1 && settings.crossfeed_mode !== 99;

    return (
        <PanelSection title='Stereo Crossfeed'>
            <PanelSectionRow>
                <ParameterToggle parameter='crossfeed_enable' />
            </PanelSectionRow>
            <PanelSectionRow>
                <CrossfeedModeDropdown />
            </PanelSectionRow>
            {!noSliders &&
                <>
                    <PanelSectionRow>
                        <ParameterSlider parameter='crossfeed_bs2b_fcut' disable={disableSliders} />
                    </PanelSectionRow>
                    <PanelSectionRow>
                        <ParameterSlider parameter='crossfeed_bs2b_feed' disable={disableSliders} />
                    </PanelSectionRow>
                </>}
        </PanelSection>
    );
};