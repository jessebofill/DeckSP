import { VFC, useCallback } from 'react';
import { DSPRangeParameter } from '../../../types/dspTypes';
import { dspParamDefines } from '../../../defines/dspParameterDefines';
import { Backend } from '../../../controllers/Backend';
import { useDspSettings } from '../../../hooks/contextHooks';
import { ThrottledSlider } from './ThrottledSlider';

export interface ParameterSliderProps {
    parameter: DSPRangeParameter;
    disable?: boolean;
}

export const ParameterSlider: VFC<ParameterSliderProps> = ({ parameter, disable }) => {
    const { data: settings, setData: setSettings } = useDspSettings();
    if (!settings || !setSettings) return <></>;

    const [min, max] = dspParamDefines[parameter].limits;

    const onChange = useCallback((value: number) => {
        Backend.setDsp(parameter, value);
        setSettings({ ...settings, [parameter]: value });
    }, [settings])

    const isMappedLabels = dspParamDefines[parameter].units instanceof Array;
    return (
        <ThrottledSlider
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