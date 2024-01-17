import { PanelSection, PanelSectionRow, SliderField } from 'decky-frontend-lib';
import { FC, VFC, createContext, useCallback, useContext, useState } from 'react';
import { ParameterToggle } from '../base/ParameterToggle';
import { Backend } from '../../../controllers/Backend';
import { dspParamDefines } from '../../../defines/dspParameterDefines';
import { useDspSettings } from '../../../hooks/contextHooks';
import { DSPEQParameters } from '../../../types/dspTypes';
import { PresetDropdown } from '../base/PresetDropdown';
import { ThrottledSlider } from '../base/ThrottledSlider';

const EQDataContext = createContext<{ data?: DSPEQParameters, setParameter?: (parameter: keyof DSPEQParameters, value: number) => void, setAll?: (eqSettings: DSPEQParameters) => void }>({});
export const useEQData = () => useContext(EQDataContext);

export const EQDataProvider: FC<{}> = ({ children }) => {
    const { data: settings, setData: setSettings } = useDspSettings();
    if (!settings || !setSettings) return <></>;

    const [values, setValues] = useState(settings['tone_eq']);

    const setParameter = (parameter: keyof DSPEQParameters, value: number) => {
        const newValues = { ...values, [parameter]: value };
        Backend.setDsp('tone_eq', newValues);
        setValues(newValues);
        setSettings({ ...settings, tone_eq: newValues });
    }
    const setAll = (eqSettings: DSPEQParameters) => {
        Backend.setDsp('tone_eq', eqSettings);
        setValues(eqSettings);
        setSettings({ ...settings, tone_eq: eqSettings });
    }

    return (
        <EQDataContext.Provider value={{ data: values, setParameter, setAll }}>
            {children}
        </EQDataContext.Provider>
    );
}

export const EQControls: VFC<{}> = ({ }) => {

    return (
        <EQDataProvider>
            <PanelSection title='Equalizer'>
                <PanelSectionRow>
                    <ParameterToggle parameter='tone_enable' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <PresetDropdown type='eq' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='25' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='40' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='63' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='100' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='160' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='250' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='400' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='630' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='1000' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='1600' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='2500' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='4000' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='6300' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='10000' />
                </PanelSectionRow>
                <PanelSectionRow>
                    <EQParameterSlider parameter='16000' />
                </PanelSectionRow>
            </PanelSection>
        </EQDataProvider>
    );
}

interface EQParameterSliderProps {
    parameter: keyof DSPEQParameters;
}

export const EQParameterSlider: VFC<EQParameterSliderProps> = ({ parameter }) => {
    const { data: values, setParameter } = useEQData();
    if (!values || !setParameter) return <></>;

    const [min, max] = dspParamDefines['tone_eq'][parameter].limits;

    const onChange = useCallback((value: number) => {
        setParameter(parameter, value);
    }, [values]);

    return (
        <ThrottledSlider
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