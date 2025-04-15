import { FC17, FC } from 'react';
import { LimiterControls } from '../../dspParamControls/groups/LimiterControls';
import { WidenessControls } from '../../dspParamControls/groups/WidenessControls';
import { CrossfeedControls } from '../../dspParamControls/groups/CrossfeedControls';
import { TubeModelingControls } from '../../dspParamControls/groups/TubeModelingControls';
import { DynamicBassControls } from '../../dspParamControls/groups/DynamicBassControls';
import { CompanderControls } from '../../dspParamControls/groups/CompanderControls';
import { ReverbControls } from '../../dspParamControls/groups/ReverbControls';
import { EQControls } from '../../dspParamControls/groups/EQControls';
import { MasterControls } from '../../dspParamControls/groups/MasterControls';
import { QAMPage } from './QAMPage';
import { EELControls } from '../../dspParamControls/groups/EELControls';
import { ConvolverControls } from '../../dspParamControls/groups/ConvolverControls';
import { ViperDDCControls } from '../../dspParamControls/groups/ViperDDCControls';
import { EffectSeparator } from './EffectSeparator';

const QAMDspPage: FC17<{}> = ({ children }) => {
    return (
        <QAMPage dataProvider='dsp'>
            {children}
        </QAMPage>
    );
};

export const QAMDspMainPage: FC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <MasterControls />
            <EffectSeparator />
            <LimiterControls />
        </QAMDspPage>
    );
};

export const QAMDspEQPage: FC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <EQControls />
        </QAMDspPage>
    );
};

export const QAMDspCompanderPage: FC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <CompanderControls />
        </QAMDspPage>
    );
};

export const QAMDspStereoPage: FC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <WidenessControls />
            <EffectSeparator />
            <CrossfeedControls />
        </QAMDspPage>
    );
};

export const QAMDspReverbPage: FC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <ReverbControls />
        </QAMDspPage>
    );
};

export const QAMDspBassTubePage: FC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <DynamicBassControls />
            <EffectSeparator />
            <TubeModelingControls />
        </QAMDspPage>
    );
};

export const QAMDspEELPage: FC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <EELControls />
        </QAMDspPage>
    );
};

export const QAMDspDDCConvolverPage: FC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <ViperDDCControls />
            <EffectSeparator />
            <ConvolverControls />
        </QAMDspPage>
    );
};