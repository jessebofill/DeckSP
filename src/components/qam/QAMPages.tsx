import { Focusable } from 'decky-frontend-lib';
import { VFC } from 'react';
import { LimiterControls } from '../dspParamControls/groups/LimiterControls';
import { WidenessControls } from '../dspParamControls/groups/WidenessControls';
import { CrossfeedControls } from '../dspParamControls/groups/CrossfeedControls';
import { TubeModelingControls } from '../dspParamControls/groups/TubeModelingControls';
import { DynamicBassControls } from '../dspParamControls/groups/DynamicBassControls';
import { CompanderControls } from '../dspParamControls/groups/CompanderControls';
import { ReverbControls } from '../dspParamControls/groups/ReverbControls';
import { EQControls } from '../dspParamControls/groups/EQControls';
import { MasterControls } from '../dspParamControls/groups/MasterControls';


export const QAMDspMainPage: VFC<{}> = ({ }) => {
    return (
        <Focusable >
            <MasterControls />
            <LimiterControls />
        </ Focusable>
    );
};

export const QAMDspEQPage: VFC<{}> = ({ }) => {
    return (
        <Focusable >
            <EQControls />
        </Focusable>
    );
};

export const QAMDspCompanderPage: VFC<{}> = ({ }) => {
    return (
        <Focusable >
            <CompanderControls />
        </Focusable>
    );
};

export const QAMDspStereoPage: VFC<{}> = ({ }) => {
    return (
        <Focusable >
            <WidenessControls />
            <CrossfeedControls />
        </Focusable>
    );
};

export const QAMDspReverbPage: VFC<{}> = ({ }) => {
    return (
        <Focusable >
            <ReverbControls />
        </Focusable>
    );
};

export const QAMDspOtherPage: VFC<{}> = ({ }) => {
    return (
        <Focusable >
            <DynamicBassControls />
            <TubeModelingControls />
        </Focusable>
    );
};

