import { DialogButton, PanelSection, PanelSectionRow } from 'decky-frontend-lib';
import { VFC, useEffect } from 'react';
import { Backend } from '../../controllers/Backend';
import { DynamicBassControls } from '../dspParamControls/groups/DynamicBassControls';
import { Log } from '../../lib/log';
import { useDspSettings } from '../../hooks/contextHooks';
import { ParameterToggle } from '../dspParamControls/base/ParameterToggle';
import { reverseLookupSectionPreset } from '../../lib/utils';
import { LimiterControls } from '../dspParamControls/groups/LimiterControls';
import { TubeModelingControls } from '../dspParamControls/groups/TubeModelingControls';
import { CompanderControls } from '../dspParamControls/groups/CompanderControls';
import { CrossfeedControls } from '../dspParamControls/groups/CrossfeedControls';
import { WidenessControls } from '../dspParamControls/groups/WidenessControls';
import { ReverbControls } from '../dspParamControls/groups/ReverbControls';
import { EQControls } from '../dspParamControls/groups/EQControls';

export const QAMDspSettings: VFC<{}> = ({ }) => {
    const { data: settings } = useDspSettings();
    if (!settings) return <></>;


    useEffect(() => Log.log('page mounted', settings), [])

    return (
        <>
            <DialogButton onClick={async () => {
                Log.log('test called')
                Log.log('done', await Backend.test())
            }}>
                test
            </DialogButton>


            <PanelSection title="Panel Section">
                <PanelSectionRow>
                    <ParameterToggle parameter='master_enable' />
                </PanelSectionRow>
            </PanelSection>
            <LimiterControls />
            <TubeModelingControls />
            <CompanderControls />
            <CrossfeedControls />
            <WidenessControls />
            <ReverbControls />
            <EQControls />
            <DynamicBassControls />
        </>

    );
};