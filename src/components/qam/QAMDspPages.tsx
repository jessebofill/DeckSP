import { FC, VFC, useState } from 'react';
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
import { DialogButton } from 'decky-frontend-lib';
import { Log } from '../../lib/log';

const QAMDspPage: FC<{}> = ({ children }) => {
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

export const Test: VFC<{}> = ({ }) => {
    Log.log('render test')
    return <C>
        <A></A>
        <B />
    </C>
}
export const A: VFC<{}> = ({ }) => {
    const [state, setState] = useState(false)
    Log.log('render a')
    return <DialogButton onClick={() => setState(!state)}></DialogButton>
}
export const B: VFC<{}> = ({ }) => {
    Log.log('render b')
    const [state, setState] = useState(false)

    return <DialogButton onClick={() => setState(!state)}></DialogButton>
}
export const C: FC<{}> = ({ children }) => {
    Log.log('render c')
    const [state, setState] = useState(false)

    return <>
        {children}
        <DialogButton onClick={() => setState(!state)}></DialogButton>
    </>
}


