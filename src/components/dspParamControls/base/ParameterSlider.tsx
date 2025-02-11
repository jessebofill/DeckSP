import { FC, useCallback } from 'react';
import { DSPCompanderParameters, DSPEQParameters, DSPRangeParameter } from '../../../types/dspTypes';
import { dspParamDefines } from '../../../defines/dspParameterDefines';
import { Backend } from '../../../controllers/Backend';
import { useCompanderData, useDspSettings, useEQData } from '../../../hooks/contextHooks';
import { ThrottledWaitSlider } from '../../waitable/WaitSlider';

export interface ParameterSliderProps {
    parameter: DSPRangeParameter;
    disable?: boolean;
}

export const ParameterSlider: FC<ParameterSliderProps> = ({ parameter, disable }) => {
    const { data: settings, setData: setSettings } = useDspSettings();
    if (!settings || !setSettings) return null;

    const [min, max] = dspParamDefines[parameter].limits;

    const onChange = useCallback((value: number) => {
        //todo make async and check error
        Backend.setDsp(parameter, value);
        setSettings({ ...settings, [parameter]: value });
    }, [settings])

    const isMappedLabels = dspParamDefines[parameter].units instanceof Array;
    return (
        <ThrottledWaitSlider
            disabled={disable}
            label={dspParamDefines[parameter].label}
            value={settings[parameter]}
            min={min}
            max={max}
            showValue={!isMappedLabels}
            valueSuffix={isMappedLabels ? undefined : ' ' + dspParamDefines[parameter].units}
            step={dspParamDefines[parameter].step}
            notchLabels={isMappedLabels ? (dspParamDefines[parameter].units as string[]).map((label, index) => ({ notchIndex: index, label })) : undefined}
            notchCount={isMappedLabels ? dspParamDefines[parameter].units.length : undefined}
            onChange={onChange}
            bottomSeparator='none'
        />
    );
};

interface EQParameterSliderProps {
    parameter: keyof DSPEQParameters;
}

export const EQParameterSlider: FC<EQParameterSliderProps> = ({ parameter }) => {
    const { data: values, setParameter } = useEQData();
    if (!values || !setParameter) return null;

    const [min, max] = dspParamDefines['tone_eq'][parameter].limits;

    const onChange = useCallback((value: number) => {
        setParameter(parameter, value);
    }, [values]);

    return (
        <ThrottledWaitSlider
            label={dspParamDefines['tone_eq'][parameter].label}
            value={values[parameter]}
            min={min}
            max={max}
            showValue={true}
            valueSuffix={' ' + dspParamDefines['tone_eq'][parameter].units}
            step={dspParamDefines['tone_eq'][parameter].step}
            onChange={onChange}
            bottomSeparator='none'
        />
    );
};

interface CompanderParameterSliderProps {
    parameter: keyof DSPCompanderParameters;
}

export const CompanderParameterSlider: FC<CompanderParameterSliderProps> = ({ parameter }) => {
    const { data: values, setParameter } = useCompanderData();
    if (!values || !setParameter) return null;

    const [min, max] = dspParamDefines['compander_response'][parameter].limits;

    const onChange = (value: number) => {
        setParameter(parameter, value);
    };

    return (
        <ThrottledWaitSlider
            label={dspParamDefines['compander_response'][parameter].label}
            value={values[parameter]}
            min={min}
            max={max}
            showValue={true}
            valueSuffix={' ' + dspParamDefines['compander_response'][parameter].units}
            step={dspParamDefines['compander_response'][parameter].step}
            onChange={onChange}
            bottomSeparator='none'
        />
    );
};