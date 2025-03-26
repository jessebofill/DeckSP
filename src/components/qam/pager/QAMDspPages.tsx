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

export const QAMDspOtherPage: FC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <DynamicBassControls />
            <TubeModelingControls />
        </QAMDspPage>
    );
};


