import { FC17, VFC } from 'react';
import { LimiterControls } from '../dspParamControls/groups/LimiterControls';
import { WidenessControls } from '../dspParamControls/groups/WidenessControls';
import { CrossfeedControls } from '../dspParamControls/groups/CrossfeedControls';
import { TubeModelingControls } from '../dspParamControls/groups/TubeModelingControls';
import { DynamicBassControls } from '../dspParamControls/groups/DynamicBassControls';
import { CompanderControls } from '../dspParamControls/groups/CompanderControls';
import { ReverbControls } from '../dspParamControls/groups/ReverbControls';
import { EQControls } from '../dspParamControls/groups/EQControls';
import { MasterControls } from '../dspParamControls/groups/MasterControls';
import { QAMPage } from './QAMPage';

const QAMDspPage: FC17<{}> = ({ children }) => {
    return (
        <QAMPage dataProvider='dsp'>
            {children}
        </QAMPage>
    );
};

export const QAMDspMainPage: VFC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <MasterControls />
            <LimiterControls />
        </QAMDspPage>
    );
};

export const QAMDspEQPage: VFC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <EQControls />
        </QAMDspPage>
    );
};

export const QAMDspCompanderPage: VFC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <CompanderControls />
        </QAMDspPage>
    );
};

export const QAMDspStereoPage: VFC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <WidenessControls />
            <CrossfeedControls />
        </QAMDspPage>
    );
};

export const QAMDspReverbPage: VFC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <ReverbControls />
        </QAMDspPage>
    );
};

export const QAMDspOtherPage: VFC<{}> = ({ }) => {
    return (
        <QAMDspPage>
            <DynamicBassControls />
            <TubeModelingControls />
        </QAMDspPage>
    );
};


